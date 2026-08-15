import "server-only";
import { google } from "googleapis";

/**
 * Admin panelindeki siparişlerin tek kaynağı, "Sipariş Kayıtları" Google
 * Sheet'i. Ekstra bir veritabanı kurmak yerine mevcut sheet'e servis
 * hesabıyla okuma/yazma yapıyoruz — kurulum adımları için bkz.
 * docs/admin-panel-kurulum.md
 *
 * Sabit sütun sırası (1. satır başlık) — panel arayüzünde alanlar farklı
 * sırada gösterilse de (bkz. OrderFormDialog/OrdersTable), sheet'teki
 * fiziksel sütun sırası mevcut kayıtları bozmamak için hiç değişmiyor:
 *  A: Sipariş Numarası   B: İsim              C: Soyisim
 *  D: Hizmet Türü        E: Hizmete Başlama Tarihi
 *  F: Hesap Kesim Tarihi G: Telefon           H: E-posta
 *  I: Ücret              J: Para Birimi       K: Toplam Taksit
 *  L: Ödenen Taksit       M: Durum             N: Not
 */

const HEADER_ROW = [
  "Sipariş Numarası",
  "İsim",
  "Soyisim",
  "Hizmet Türü",
  "Hizmete Başlama Tarihi",
  "Hesap Kesim Tarihi",
  "Telefon",
  "E-posta",
  "Ücret",
  "Para Birimi",
  "Toplam Taksit",
  "Ödenen Taksit",
  "Durum",
  "Not",
] as const;

const DATA_RANGE_COLUMNS = "A:N";

export const CURRENCIES = ["TRY", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const STATUSES = ["Aktif", "Tamamlandı", "İptal"] as const;
export type Status = (typeof STATUSES)[number];

export interface OrderInput {
  firstName: string;
  lastName: string;
  serviceType: string;
  startDate: string; // yyyy-mm-dd (input[type=date] formatı)
  billingDate: string; // yyyy-mm-dd
  phone: string;
  email: string;
  fee: string; // sayı, boş bırakılabilir
  currency: Currency;
  // Yıllık/taksitli planlar için — ikisi de boşsa tek seferlik/taksitsiz
  // sipariş demektir. Kalan taksit = totalInstallments - paidInstallments.
  totalInstallments: string;
  paidInstallments: string;
  status: Status;
  note: string;
}

export interface Order extends OrderInput {
  rowNumber: number;
  orderNumber: string;
}

/**
 * Sipariş başına giderler (hosting, domain, SMS gateway vb.) ayrı bir sheet
 * sekmesinde ("Giderler") tutulur — bire-çok ilişki olduğu için ana sipariş
 * satırına sığdırmak yerine kendi tablosu var. Sekme yoksa ilk kullanımda
 * otomatik oluşturulur (bkz. ensureExpenseSheet).
 * Sütunlar: A: Gider ID  B: Sipariş Numarası  C: Gider Adı  D: Tutar
 *           E: Para Birimi  F: Ödeme Tarihi  G: Not  H: Tekrar
 */
const EXPENSE_SHEET_NAME = "Giderler";
const EXPENSE_HEADER_ROW = [
  "Gider ID",
  "Sipariş Numarası",
  "Gider Adı",
  "Tutar",
  "Para Birimi",
  "Ödeme Tarihi",
  "Not",
  "Tekrar",
] as const;
const EXPENSE_DATA_COLUMNS = "A:H";

export const EXPENSE_RECURRENCES = ["Tek seferlik", "Aylık", "Yıllık"] as const;
export type ExpenseRecurrence = (typeof EXPENSE_RECURRENCES)[number];

export interface ExpenseInput {
  name: string;
  amount: string;
  currency: Currency;
  recurrence: ExpenseRecurrence;
  // Tek seferlik/Yıllık: yyyy-mm-dd (yıllıkta yıl sadece bilgi amaçlı, hatırlatma
  // hesaplanırken sadece ay/gün kullanılır). Aylık: ayın günü, "1"–"31".
  dueDate: string;
  note: string;
}

export interface Expense extends ExpenseInput {
  rowNumber: number;
  expenseId: string;
  orderNumber: string;
}

export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID,
  );
}

function getConfig() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Sayfa1";

  if (!email || !privateKey || !sheetId) {
    throw new Error(
      "Google Sheets bağlantısı yapılandırılmamış (GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY / " +
        "GOOGLE_SHEET_ID env değişkenleri eksik). Kurulum için bkz. docs/admin-panel-kurulum.md",
    );
  }

  return { email, privateKey: normalizePrivateKey(privateKey), sheetId, sheetName };
}

/** GOOGLE_PRIVATE_KEY, ortama göre birkaç farklı şekilde gelebilir: gerçek
 * satır sonlarıyla (Vercel'in çok satırlı env value kutusuna direkt
 * yapıştırılmışsa), literal "\n" dizileriyle (tek satır .env formatı), ya
 * da yanlışlıkla başında/sonunda tırnakla. Hepsini geçerli bir PEM'e
 * normalize eder; olmuyorsa net bir hata fırlatır (Node'un ham
 * "DECODER routines::unsupported" hatası yerine). */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();

  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }

  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }

  if (!key.includes("-----BEGIN PRIVATE KEY-----") || !key.includes("-----END PRIVATE KEY-----")) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY geçerli bir PEM anahtarı gibi görünmüyor (BEGIN/END PRIVATE KEY satırları eksik). " +
        "Değeri servis hesabı JSON dosyasındaki private_key alanından, başında/sonunda tırnak olmadan tekrar " +
        "kopyalayıp Vercel'e yapıştırın — bkz. docs/admin-panel-kurulum.md",
    );
  }

  return key;
}

async function getSheetsClient() {
  const { email, privateKey } = getConfig();
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

/** Sheet'te eksik başlıklar varsa (ör. Telefon/E-posta/Ücret/Para
 * Birimi/Taksit sütunları) sona ekler — sadece eksikse yazar, mevcut
 * başlıkları hiçbir zaman değiştirmez. */
async function ensureHeaders(): Promise<void> {
  const sheets = await getSheetsClient();
  const { sheetId, sheetName } = getConfig();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:N1`,
  });

  const currentHeaders = data.values?.[0] ?? [];
  const needsUpdate = HEADER_ROW.some((header, index) => currentHeaders[index] !== header);
  if (!needsUpdate) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:N1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[...HEADER_ROW]] },
  });
}

function isoToTurkishDate(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

function turkishDateToIso(value: string): string {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!match) return value;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function toCurrency(value: string | undefined): Currency {
  return (CURRENCIES as readonly string[]).includes(value ?? "") ? (value as Currency) : "TRY";
}

function toStatus(value: string | undefined): Status {
  return (STATUSES as readonly string[]).includes(value ?? "") ? (value as Status) : "Aktif";
}

/** Google Sheets, USER_ENTERED modunda "+"/"-"/"="/"@" ile başlayan
 * hücreleri formül gibi yorumlamaya çalışır — bu da başına "+" konan
 * telefon numaralarının (ör. +90 555 ...) bozuk görünmesine yol açar.
 * Sheets'in metin olarak zorlamak için tanıdığı standart kaçış: hücrenin
 * başına görünmez bir kesme işareti (') koymak — API'den okuyunca bu işaret
 * otomatik düşer, geri dönen değeri etkilemez. */
function protectFromFormula(value: string): string {
  return /^[+\-=@]/.test(value) ? `'${value}` : value;
}

function rowToOrder(row: string[], rowNumber: number): Order | null {
  const orderNumber = row[0]?.trim();
  if (!orderNumber) return null;

  return {
    rowNumber,
    orderNumber,
    firstName: row[1] ?? "",
    lastName: row[2] ?? "",
    serviceType: row[3] ?? "",
    startDate: turkishDateToIso(row[4] ?? ""),
    billingDate: turkishDateToIso(row[5] ?? ""),
    phone: row[6] ?? "",
    email: row[7] ?? "",
    fee: row[8] ?? "",
    currency: toCurrency(row[9]),
    totalInstallments: row[10] ?? "",
    paidInstallments: row[11] ?? "",
    status: toStatus(row[12]),
    note: row[13] ?? "",
  };
}

export async function listOrders(): Promise<Order[]> {
  await ensureHeaders();
  const sheets = await getSheetsClient();
  const { sheetId, sheetName } = getConfig();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A2:${DATA_RANGE_COLUMNS.split(":")[1]}`,
  });

  const rows = data.values ?? [];
  const orders: Order[] = [];
  rows.forEach((row, index) => {
    const order = rowToOrder(row as string[], index + 2);
    if (order) orders.push(order);
  });

  return orders.reverse(); // en yeni sipariş en üstte görünsün
}

function generateOrderNumber(existing: Set<string>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = String(Math.floor(100000 + Math.random() * 900000));
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error("Benzersiz sipariş numarası üretilemedi, lütfen tekrar deneyin.");
}

export async function createOrder(input: OrderInput): Promise<Order> {
  await ensureHeaders();
  const sheets = await getSheetsClient();
  const { sheetId, sheetName } = getConfig();

  const existingOrders = await listOrders();
  const orderNumber = generateOrderNumber(new Set(existingOrders.map((order) => order.orderNumber)));

  const values = [
    orderNumber,
    protectFromFormula(input.firstName),
    protectFromFormula(input.lastName),
    protectFromFormula(input.serviceType),
    isoToTurkishDate(input.startDate),
    isoToTurkishDate(input.billingDate),
    protectFromFormula(input.phone),
    protectFromFormula(input.email),
    input.fee,
    input.currency,
    input.totalInstallments,
    input.paidInstallments,
    input.status,
    protectFromFormula(input.note),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:N`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });

  return { rowNumber: -1, orderNumber, ...input };
}

async function findOrderRow(orderNumber: string): Promise<number | null> {
  const orders = await listOrders();
  const match = orders.find((order) => order.orderNumber === orderNumber);
  return match ? match.rowNumber : null;
}

export async function updateOrder(orderNumber: string, patch: Partial<OrderInput>): Promise<Order> {
  const sheets = await getSheetsClient();
  const { sheetId, sheetName } = getConfig();

  const rowNumber = await findOrderRow(orderNumber);
  if (!rowNumber) {
    throw new Error(`${orderNumber} numaralı sipariş bulunamadı.`);
  }

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A${rowNumber}:N${rowNumber}`,
  });
  const current = rowToOrder((data.values?.[0] as string[]) ?? [], rowNumber);
  if (!current) {
    throw new Error(`${orderNumber} numaralı sipariş satırı okunamadı.`);
  }

  const merged: Order = { ...current, ...patch };
  const values = [
    merged.orderNumber,
    protectFromFormula(merged.firstName),
    protectFromFormula(merged.lastName),
    protectFromFormula(merged.serviceType),
    isoToTurkishDate(merged.startDate),
    isoToTurkishDate(merged.billingDate),
    protectFromFormula(merged.phone),
    protectFromFormula(merged.email),
    merged.fee,
    merged.currency,
    merged.totalInstallments,
    merged.paidInstallments,
    merged.status,
    protectFromFormula(merged.note),
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${sheetName}!A${rowNumber}:N${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });

  return merged;
}

async function getNumericSheetId(sheetName: string): Promise<number | null> {
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();
  const { data } = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheet = data.sheets?.find((item) => item.properties?.title === sheetName);
  return sheet?.properties?.sheetId ?? null;
}

/** "Giderler" sekmesi yoksa oluşturur, başlık satırını yazar/tamamlar —
 * kullanıcının elle hazırlamasına gerek kalmadan ilk gider eklendiğinde
 * kendiliğinden hazır hale gelir. */
async function ensureExpenseSheet(): Promise<void> {
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const existingSheetId = await getNumericSheetId(EXPENSE_SHEET_NAME);
  if (existingSheetId === null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: EXPENSE_SHEET_NAME } } }] },
    });
  }

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${EXPENSE_SHEET_NAME}!A1:H1`,
  });
  const currentHeaders = data.values?.[0] ?? [];
  const needsUpdate = EXPENSE_HEADER_ROW.some((header, index) => currentHeaders[index] !== header);
  if (!needsUpdate) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${EXPENSE_SHEET_NAME}!A1:H1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[...EXPENSE_HEADER_ROW]] },
  });
}

function toExpenseRecurrence(value: string | undefined): ExpenseRecurrence {
  return (EXPENSE_RECURRENCES as readonly string[]).includes(value ?? "")
    ? (value as ExpenseRecurrence)
    : "Tek seferlik";
}

/** "Aylık" gider için Ödeme Tarihi sütunu bir tarih değil, sadece ayın günü
 * (ör. "15") — bu yüzden tarih dönüşümü recurrence'a göre değişiyor. */
function serializeExpenseDueDate(recurrence: ExpenseRecurrence, dueDate: string): string {
  return recurrence === "Aylık" ? dueDate : isoToTurkishDate(dueDate);
}

function deserializeExpenseDueDate(recurrence: ExpenseRecurrence, raw: string): string {
  return recurrence === "Aylık" ? raw : turkishDateToIso(raw);
}

function rowToExpense(row: string[], rowNumber: number): Expense | null {
  const expenseId = row[0]?.trim();
  if (!expenseId) return null;

  const recurrence = toExpenseRecurrence(row[7]);

  return {
    rowNumber,
    expenseId,
    orderNumber: row[1] ?? "",
    name: row[2] ?? "",
    amount: row[3] ?? "",
    currency: toCurrency(row[4]),
    dueDate: deserializeExpenseDueDate(recurrence, row[5] ?? ""),
    note: row[6] ?? "",
    recurrence,
  };
}

function generateExpenseId(existing: Set<string>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = String(Math.floor(100000 + Math.random() * 900000));
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error("Benzersiz gider numarası üretilemedi, lütfen tekrar deneyin.");
}

export async function listExpenses(): Promise<Expense[]> {
  await ensureExpenseSheet();
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${EXPENSE_SHEET_NAME}!A2:${EXPENSE_DATA_COLUMNS.split(":")[1]}`,
  });

  const rows = data.values ?? [];
  const expenses: Expense[] = [];
  rows.forEach((row, index) => {
    const expense = rowToExpense(row as string[], index + 2);
    if (expense) expenses.push(expense);
  });
  return expenses;
}

export async function listExpensesForOrder(orderNumber: string): Promise<Expense[]> {
  const all = await listExpenses();
  return all.filter((expense) => expense.orderNumber === orderNumber).reverse();
}

export async function createExpense(orderNumber: string, input: ExpenseInput): Promise<Expense> {
  await ensureExpenseSheet();
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const existing = await listExpenses();
  const expenseId = generateExpenseId(new Set(existing.map((expense) => expense.expenseId)));

  const values = [
    expenseId,
    orderNumber,
    protectFromFormula(input.name),
    input.amount,
    input.currency,
    serializeExpenseDueDate(input.recurrence, input.dueDate),
    protectFromFormula(input.note),
    input.recurrence,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${EXPENSE_SHEET_NAME}!${EXPENSE_DATA_COLUMNS}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });

  return { rowNumber: -1, expenseId, orderNumber, ...input };
}

export async function updateExpense(expenseId: string, patch: Partial<ExpenseInput>): Promise<Expense> {
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const all = await listExpenses();
  const current = all.find((expense) => expense.expenseId === expenseId);
  if (!current) {
    throw new Error(`${expenseId} numaralı gider bulunamadı.`);
  }

  const merged: Expense = { ...current, ...patch };
  const values = [
    merged.expenseId,
    merged.orderNumber,
    protectFromFormula(merged.name),
    merged.amount,
    merged.currency,
    serializeExpenseDueDate(merged.recurrence, merged.dueDate),
    protectFromFormula(merged.note),
    merged.recurrence,
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${EXPENSE_SHEET_NAME}!A${current.rowNumber}:H${current.rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });

  return merged;
}

export async function deleteExpense(expenseId: string, actor: string): Promise<void> {
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const all = await listExpenses();
  const current = all.find((expense) => expense.expenseId === expenseId);
  if (!current) {
    throw new Error(`${expenseId} numaralı gider bulunamadı.`);
  }

  await moveToTrash("Gider", `${current.name} · sipariş #${current.orderNumber}`, current, actor);

  const numericSheetId = await getNumericSheetId(EXPENSE_SHEET_NAME);
  if (numericSheetId === null) {
    throw new Error(`"${EXPENSE_SHEET_NAME}" adlı sayfa bulunamadı.`);
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: numericSheetId,
              dimension: "ROWS",
              startIndex: current.rowNumber - 1,
              endIndex: current.rowNumber,
            },
          },
        },
      ],
    },
  });
}

/** Bir siparişe bağlı tüm giderleri siler — sipariş silindiğinde "Giderler"
 * sekmesinde sahipsiz kayıt kalmasın diye (bkz. deleteOrder). Giderler ayrı
 * bir sheet'te olduğu için sipariş satırının silinmesinden bağımsız. Her
 * gider kendi çöp kutusu kaydını alır (deleteExpense üzerinden). */
export async function deleteExpensesForOrder(orderNumber: string, actor: string): Promise<void> {
  const expenses = await listExpensesForOrder(orderNumber);
  for (const expense of expenses) {
    await deleteExpense(expense.expenseId, actor);
  }
}

export async function deleteOrder(orderNumber: string, actor: string): Promise<void> {
  const sheets = await getSheetsClient();
  const { sheetId, sheetName } = getConfig();

  const orders = await listOrders();
  const current = orders.find((order) => order.orderNumber === orderNumber);
  if (!current) {
    throw new Error(`${orderNumber} numaralı sipariş bulunamadı.`);
  }

  await moveToTrash("Sipariş", `${current.firstName} ${current.lastName} (#${current.orderNumber})`, current, actor);
  await deleteExpensesForOrder(orderNumber, actor);

  const numericSheetId = await getNumericSheetId(sheetName);
  if (numericSheetId === null) {
    throw new Error(`"${sheetName}" adlı sayfa bulunamadı.`);
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: numericSheetId,
              dimension: "ROWS",
              startIndex: current.rowNumber - 1,
              endIndex: current.rowNumber,
            },
          },
        },
      ],
    },
  });
}

/**
 * Aktivite log'u — hangi admin ne zaman ne değiştirdi/sildi. Ayrı bir
 * "Aktivite Log" sekmesinde tutulur (yoksa otomatik oluşturulur). Sadece
 * ekleme yapılır, hiç silme/güncelleme yok — kalıcı bir defter gibi.
 * logActivity() kendi hatasını asla dışarı fırlatmaz: log yazımı
 * başarısız olsa bile asıl işlemi (sipariş/gider kaydı vb.) bozmasın diye.
 */
const ACTIVITY_SHEET_NAME = "Aktivite Log";
const ACTIVITY_HEADER_ROW = ["Zaman", "Admin", "Eylem", "Detay"] as const;

export interface ActivityLogEntry {
  rowNumber: number;
  timestamp: string; // ISO
  actor: string;
  action: string;
  detail: string;
}

let activitySheetEnsured = false;

async function ensureActivitySheet(): Promise<void> {
  if (activitySheetEnsured) return;
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const existingSheetId = await getNumericSheetId(ACTIVITY_SHEET_NAME);
  if (existingSheetId === null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: ACTIVITY_SHEET_NAME } } }] },
    });
  }

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${ACTIVITY_SHEET_NAME}!A1:D1`,
  });
  const currentHeaders = data.values?.[0] ?? [];
  const needsUpdate = ACTIVITY_HEADER_ROW.some((header, index) => currentHeaders[index] !== header);
  if (needsUpdate) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${ACTIVITY_SHEET_NAME}!A1:D1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[...ACTIVITY_HEADER_ROW]] },
    });
  }

  activitySheetEnsured = true;
}

export async function logActivity(actor: string, action: string, detail: string): Promise<void> {
  try {
    await ensureActivitySheet();
    const sheets = await getSheetsClient();
    const { sheetId } = getConfig();
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${ACTIVITY_SHEET_NAME}!A:D`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [new Date().toISOString(), protectFromFormula(actor), protectFromFormula(action), protectFromFormula(detail)],
        ],
      },
    });
  } catch (error) {
    console.error("[google-sheets] logActivity hata:", error);
  }
}

export async function listActivity(limit = 100): Promise<ActivityLogEntry[]> {
  await ensureActivitySheet();
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${ACTIVITY_SHEET_NAME}!A2:D`,
  });

  const rows = data.values ?? [];
  const entries: ActivityLogEntry[] = [];
  rows.forEach((row, index) => {
    if (!row[0]) return;
    entries.push({
      rowNumber: index + 2,
      timestamp: row[0] ?? "",
      actor: row[1] ?? "",
      action: row[2] ?? "",
      detail: row[3] ?? "",
    });
  });

  return entries.reverse().slice(0, limit);
}

/**
 * Aylık gelir hedefleri — Analiz sayfasındaki ilerleme çubuğu için. Ayrı
 * bir "Hedefler" sekmesinde tutulur (yoksa otomatik oluşturulur). Her
 * ay+para birimi kombinasyonu için tek satır — aynı ay/para birimi tekrar
 * kaydedilirse üzerine yazılır (upsert).
 * Sütunlar: A: Ay (yyyy-mm)  B: Para Birimi  C: Hedef Tutar
 */
const GOAL_SHEET_NAME = "Hedefler";
const GOAL_HEADER_ROW = ["Ay", "Para Birimi", "Hedef Tutar"] as const;

export interface MonthlyGoal {
  rowNumber: number;
  month: string; // "yyyy-mm"
  currency: Currency;
  amount: string;
}

let goalSheetEnsured = false;

async function ensureGoalSheet(): Promise<void> {
  if (goalSheetEnsured) return;
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const existingSheetId = await getNumericSheetId(GOAL_SHEET_NAME);
  if (existingSheetId === null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: GOAL_SHEET_NAME } } }] },
    });
  }

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${GOAL_SHEET_NAME}!A1:C1`,
  });
  const currentHeaders = data.values?.[0] ?? [];
  const needsUpdate = GOAL_HEADER_ROW.some((header, index) => currentHeaders[index] !== header);
  if (needsUpdate) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${GOAL_SHEET_NAME}!A1:C1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[...GOAL_HEADER_ROW]] },
    });
  }

  goalSheetEnsured = true;
}

export async function listMonthlyGoals(): Promise<MonthlyGoal[]> {
  await ensureGoalSheet();
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${GOAL_SHEET_NAME}!A2:C`,
  });

  const rows = data.values ?? [];
  const goals: MonthlyGoal[] = [];
  rows.forEach((row, index) => {
    if (!row[0]) return;
    goals.push({
      rowNumber: index + 2,
      month: row[0] ?? "",
      currency: toCurrency(row[1]),
      amount: row[2] ?? "",
    });
  });
  return goals;
}

export async function setMonthlyGoal(month: string, currency: Currency, amount: string): Promise<MonthlyGoal> {
  await ensureGoalSheet();
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const existing = await listMonthlyGoals();
  const current = existing.find((goal) => goal.month === month && goal.currency === currency);

  if (current) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${GOAL_SHEET_NAME}!A${current.rowNumber}:C${current.rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[month, currency, amount]] },
    });
    return { ...current, amount };
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${GOAL_SHEET_NAME}!A:C`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [[month, currency, amount]] },
  });
  return { rowNumber: -1, month, currency, amount };
}

/**
 * Çöp kutusu — silinen sipariş/gider kayıtları kalıcı silinmeden önce
 * burada saklanır, geri getirilebilir ya da kalıcı silinebilir. Ayrı bir
 * "Çöp Kutusu" sekmesinde tutulur (yoksa otomatik oluşturulur).
 * Sütunlar: A: Çöp ID  B: Zaman  C: Tür  D: Özet  E: Silen  F: Veri (JSON)
 */
const TRASH_SHEET_NAME = "Çöp Kutusu";
const TRASH_HEADER_ROW = ["Çöp ID", "Zaman", "Tür", "Özet", "Silen", "Veri"] as const;

export type TrashType = "Sipariş" | "Gider";

export interface TrashEntry {
  rowNumber: number;
  trashId: string;
  deletedAt: string; // ISO
  type: TrashType;
  summary: string;
  actor: string;
  data: Order | Expense;
}

let trashSheetEnsured = false;

async function ensureTrashSheet(): Promise<void> {
  if (trashSheetEnsured) return;
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const existingSheetId = await getNumericSheetId(TRASH_SHEET_NAME);
  if (existingSheetId === null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: TRASH_SHEET_NAME } } }] },
    });
  }

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${TRASH_SHEET_NAME}!A1:F1`,
  });
  const currentHeaders = data.values?.[0] ?? [];
  const needsUpdate = TRASH_HEADER_ROW.some((header, index) => currentHeaders[index] !== header);
  if (needsUpdate) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${TRASH_SHEET_NAME}!A1:F1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[...TRASH_HEADER_ROW]] },
    });
  }

  trashSheetEnsured = true;
}

function generateTrashId(existing: Set<string>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = String(Math.floor(100000 + Math.random() * 900000));
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error("Benzersiz çöp kutusu numarası üretilemedi, lütfen tekrar deneyin.");
}

function rowToTrashEntry(row: string[], rowNumber: number): TrashEntry | null {
  const trashId = row[0]?.trim();
  if (!trashId) return null;
  const type: TrashType = row[2] === "Gider" ? "Gider" : "Sipariş";
  let data: Order | Expense;
  try {
    data = JSON.parse(row[5] ?? "{}");
  } catch {
    return null;
  }
  return {
    rowNumber,
    trashId,
    deletedAt: row[1] ?? "",
    type,
    summary: row[3] ?? "",
    actor: row[4] ?? "",
    data,
  };
}

export async function listTrash(): Promise<TrashEntry[]> {
  await ensureTrashSheet();
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${TRASH_SHEET_NAME}!A2:F`,
  });

  const rows = data.values ?? [];
  const entries: TrashEntry[] = [];
  rows.forEach((row, index) => {
    const entry = rowToTrashEntry(row as string[], index + 2);
    if (entry) entries.push(entry);
  });
  return entries.reverse(); // en son silinen en üstte
}

/** Silinen bir sipariş/gider kaydını kalıcı silmeden önce çöp kutusuna
 * taşır. deleteOrder/deleteExpense içinden AWAIT edilir ve hata fırlatırsa
 * silme işlemi de iptal olur — logActivity'nin aksine burada asıl amaç
 * veri kaybını önlemek olduğu için hata yutulmaz. */
async function moveToTrash(type: TrashType, summary: string, data: Order | Expense, actor: string): Promise<void> {
  await ensureTrashSheet();
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const existing = await listTrash();
  const trashId = generateTrashId(new Set(existing.map((entry) => entry.trashId)));

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${TRASH_SHEET_NAME}!A:F`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          trashId,
          new Date().toISOString(),
          type,
          protectFromFormula(summary),
          protectFromFormula(actor),
          JSON.stringify(data),
        ],
      ],
    },
  });
}

async function findTrashRow(trashId: string): Promise<TrashEntry | null> {
  const entries = await listTrash();
  return entries.find((entry) => entry.trashId === trashId) ?? null;
}

async function deleteTrashRow(rowNumber: number): Promise<void> {
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();
  const numericSheetId = await getNumericSheetId(TRASH_SHEET_NAME);
  if (numericSheetId === null) {
    throw new Error(`"${TRASH_SHEET_NAME}" adlı sayfa bulunamadı.`);
  }
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: numericSheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });
}

/** Bir siparişi, ORİJİNAL sipariş numarasını koruyarak "Sipariş Kayıtları"
 * sheet'ine geri ekler — createOrder()'ın rastgele numara üretme mantığını
 * atlar, aksi halde geri getirilen sipariş yeni bir numara alır ve ona
 * bağlı giderlerin orderNumber referansı kırılır. */
async function restoreOrderRow(order: Order): Promise<void> {
  await ensureHeaders();
  const sheets = await getSheetsClient();
  const { sheetId, sheetName } = getConfig();

  const values = [
    order.orderNumber,
    protectFromFormula(order.firstName),
    protectFromFormula(order.lastName),
    protectFromFormula(order.serviceType),
    isoToTurkishDate(order.startDate),
    isoToTurkishDate(order.billingDate),
    protectFromFormula(order.phone),
    protectFromFormula(order.email),
    order.fee,
    order.currency,
    order.totalInstallments,
    order.paidInstallments,
    order.status,
    protectFromFormula(order.note),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:N`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
}

/** restoreOrderRow'un gider karşılığı — ORİJİNAL gider ID'sini korur. */
async function restoreExpenseRow(expense: Expense): Promise<void> {
  await ensureExpenseSheet();
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();

  const values = [
    expense.expenseId,
    expense.orderNumber,
    protectFromFormula(expense.name),
    expense.amount,
    expense.currency,
    serializeExpenseDueDate(expense.recurrence, expense.dueDate),
    protectFromFormula(expense.note),
    expense.recurrence,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${EXPENSE_SHEET_NAME}!${EXPENSE_DATA_COLUMNS}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
}

/** Çöp kutusundaki bir kaydı geri getirir: ilgili sheet'e orijinal
 * kimliğiyle ekler, sonra çöp kutusu satırını siler. Sipariş/gider
 * numarası bir başka kayıtta yeniden kullanılmışsa sessizce üzerine
 * yazmak yerine hata fırlatır. */
export async function restoreFromTrash(trashId: string): Promise<void> {
  const entry = await findTrashRow(trashId);
  if (!entry) {
    throw new Error(`${trashId} numaralı çöp kutusu kaydı bulunamadı.`);
  }

  if (entry.type === "Sipariş") {
    const order = entry.data as Order;
    const orders = await listOrders();
    if (orders.some((existing) => existing.orderNumber === order.orderNumber)) {
      throw new Error(
        `${order.orderNumber} numaralı sipariş numarası bir başka kayıtta kullanılıyor, geri getirilemedi.`,
      );
    }
    await restoreOrderRow(order);
  } else {
    const expense = entry.data as Expense;
    const expenses = await listExpenses();
    if (expenses.some((existing) => existing.expenseId === expense.expenseId)) {
      throw new Error(
        `${expense.expenseId} numaralı gider numarası bir başka kayıtta kullanılıyor, geri getirilemedi.`,
      );
    }
    await restoreExpenseRow(expense);
  }

  await deleteTrashRow(entry.rowNumber);
}

/** Çöp kutusundan kalıcı olarak siler — geri alınamaz. */
export async function permanentlyDeleteTrashEntry(trashId: string): Promise<void> {
  const entry = await findTrashRow(trashId);
  if (!entry) {
    throw new Error(`${trashId} numaralı çöp kutusu kaydı bulunamadı.`);
  }
  await deleteTrashRow(entry.rowNumber);
}

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
 *  L: Ödenen Taksit
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
] as const;

const DATA_RANGE_COLUMNS = "A:L";

export const CURRENCIES = ["TRY", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

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
}

export interface Order extends OrderInput {
  rowNumber: number;
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

  return { email, privateKey: privateKey.replace(/\\n/g, "\n"), sheetId, sheetName };
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
    range: `${sheetName}!A1:L1`,
  });

  const currentHeaders = data.values?.[0] ?? [];
  const needsUpdate = HEADER_ROW.some((header, index) => currentHeaders[index] !== header);
  if (!needsUpdate) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:L1`,
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
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:L`,
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
    range: `${sheetName}!A${rowNumber}:L${rowNumber}`,
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
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${sheetName}!A${rowNumber}:L${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });

  return merged;
}

async function getNumericSheetId(sheetName: string): Promise<number> {
  const sheets = await getSheetsClient();
  const { sheetId } = getConfig();
  const { data } = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheet = data.sheets?.find((item) => item.properties?.title === sheetName);
  const numericId = sheet?.properties?.sheetId;
  if (numericId === undefined || numericId === null) {
    throw new Error(`"${sheetName}" adlı sayfa bulunamadı.`);
  }
  return numericId;
}

export async function deleteOrder(orderNumber: string): Promise<void> {
  const sheets = await getSheetsClient();
  const { sheetId, sheetName } = getConfig();

  const rowNumber = await findOrderRow(orderNumber);
  if (!rowNumber) {
    throw new Error(`${orderNumber} numaralı sipariş bulunamadı.`);
  }

  const numericSheetId = await getNumericSheetId(sheetName);

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

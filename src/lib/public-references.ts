import "server-only";
import { clientReferences, type ClientReference } from "@/content/references";
import { groupOrdersByCustomer } from "@/lib/customers";
import { isSheetsConfigured, listOrders } from "@/lib/google-sheets";

/** İşletme adı girilmişse o gösterilir; yoksa kişi adı kısaltılır.
 * "Mehmet Yılmaz" → "Mehmet Y." — siteye sadece ad + soyadın baş harfi çıkar.
 * Telefon, e-posta, ücret ve not alanları hiçbir koşulda dışarı verilmez. */
function publicName(firstName: string, lastName: string): string {
  const first = firstName.trim();
  const initial = lastName.trim().charAt(0).toLocaleUpperCase("tr");
  return initial ? `${first} ${initial}.` : first;
}

/**
 * Ana sayfadaki referans bölümünün verisi: admin panelindeki sipariş
 * sheet'inden "kime ne sattık" bilgisini çeker. İptal edilen ve henüz
 * başlamamış (Planlandı) siparişler dahil edilmez. Sheets yapılandırılmamışsa
 * ya da okuma başarısızsa `content/references.ts` içindeki elle yazılmış
 * liste kullanılır, sayfa asla bozulmaz.
 */
export async function getPublicReferences(): Promise<ClientReference[]> {
  if (!isSheetsConfigured()) return clientReferences;

  try {
    const orders = (await listOrders()).filter(
      (order) => order.status === "Aktif" || order.status === "Tamamlandı",
    );
    const customers = groupOrdersByCustomer(orders);

    const fromSheet = customers.map<ClientReference>((customer) => ({
      name:
        customer.businessName.trim() ||
        publicName(customer.firstName, customer.lastName),
      service: [...new Set(customer.orders.map((order) => order.serviceType))].join(" · "),
    }));

    return fromSheet.length > 0 ? fromSheet : clientReferences;
  } catch (error) {
    console.error("Referanslar sheet'ten alınamadı, statik listeye dönüldü:", error);
    return clientReferences;
  }
}

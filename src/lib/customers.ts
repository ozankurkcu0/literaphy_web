import type { Order } from "@/lib/google-sheets";

/** Siparişleri "aynı müşteri" saydığımız birime göre gruplar. Telefon
 * numarası varsa (normalize edilmiş hâli) birincil anahtar; yoksa isim +
 * soyisime düşer. Müşteri bazlı görünüm (Müşteriler sayfası) bunun
 * üzerine kurulu — ekstra bir "müşteri" tablosu yok, sipariş kayıtlarından
 * türetiliyor. */
export interface Customer {
  key: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  orders: Order[];
}

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

function customerKey(order: Order): string {
  const phone = normalizePhone(order.phone);
  if (phone) return `phone:${phone}`;
  return `name:${order.firstName.trim().toLowerCase()}|${order.lastName.trim().toLowerCase()}`;
}

export function groupOrdersByCustomer(orders: Order[]): Customer[] {
  const map = new Map<string, Customer>();

  for (const order of orders) {
    const key = customerKey(order);
    const existing = map.get(key);
    if (existing) {
      existing.orders.push(order);
      // En güncel iletişim bilgisini tutmak için: sonradan eklenen sipariş
      // telefon/e-posta girmişse ve elimizdeki boşsa güncelle.
      if (!existing.phone && order.phone) existing.phone = order.phone;
      if (!existing.email && order.email) existing.email = order.email;
    } else {
      map.set(key, {
        key,
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        email: order.email,
        orders: [order],
      });
    }
  }

  return [...map.values()].sort((a, b) =>
    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, "tr"),
  );
}

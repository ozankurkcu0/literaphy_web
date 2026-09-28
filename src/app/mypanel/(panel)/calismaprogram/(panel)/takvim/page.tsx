import type { Metadata } from "next";
import { CalismaProgramCalendar } from "@/components/calisma-program/CalendarView";

export const metadata: Metadata = {
  title: "Takvim — Çalışma Programım",
  robots: { index: false, follow: false },
};

export default function CalismaProgramTakvimPage() {
  return <CalismaProgramCalendar />;
}

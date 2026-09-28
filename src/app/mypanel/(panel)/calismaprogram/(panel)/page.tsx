import type { Metadata } from "next";
import { CalismaProgramDashboard } from "@/components/calisma-program/Dashboard";

export const metadata: Metadata = {
  title: "Çalışma Programım",
  robots: { index: false, follow: false },
};

export default function CalismaProgramPage() {
  return <CalismaProgramDashboard />;
}

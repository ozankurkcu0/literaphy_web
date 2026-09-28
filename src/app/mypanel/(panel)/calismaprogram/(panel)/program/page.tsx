import type { Metadata } from "next";
import { CalismaProgramProgramEditor } from "@/components/calisma-program/ProgramEditor";

export const metadata: Metadata = {
  title: "Ders Programı — Çalışma Programım",
  robots: { index: false, follow: false },
};

export default function CalismaProgramProgramPage() {
  return <CalismaProgramProgramEditor />;
}

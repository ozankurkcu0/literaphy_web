import type { Metadata } from "next";
import { YagmurProgramEditor } from "@/components/yagmur/YagmurProgramEditor";

export const metadata: Metadata = {
  title: "Yağmur'un Programı",
  robots: { index: false, follow: false },
};

export default function YagmurProgramPage() {
  return <YagmurProgramEditor />;
}

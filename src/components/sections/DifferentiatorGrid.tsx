import { Gauge, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/IconBox";

const differentiators = [
  {
    icon: Gauge,
    title: "Hızlı Teslimat",
    description: "Net kapsam ve şeffaf süreçle projelerinizi zamanında, gecikmeden teslim ediyoruz.",
  },
  {
    icon: ShieldCheck,
    title: "Teknik Güvenilirlik",
    description: "Kolay değil, doğru ve sürdürülebilir mimariyi tercih eder, kod kalitesinden ödün vermeyiz.",
  },
  {
    icon: Sparkles,
    title: "Sonuç Odaklı Yaklaşım",
    description: "Her proje için ölçülebilir bir başarı metriği belirler, sonucu birlikte takip ederiz.",
  },
  {
    icon: Users,
    title: "Uzun Vadeli Ortaklık",
    description: "Teslimle biten değil, teslim sonrası destekle devam eden bir çalışma ilişkisi kurarız.",
  },
];

export function DifferentiatorGrid() {
  return (
    <Section tone="base" padding="standard">
      <SectionHeading eyebrow="Neden Literaphy" title="Teknoloji ortağınızı seçerken önemli olanlar" className="mb-14" />
      <RevealGroup className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-hairline">
        {differentiators.map((item) => (
          <RevealItem key={item.title} className="flex flex-col items-start gap-4 lg:px-8 lg:first:pl-0 lg:last:pr-0">
            <IconBox icon={item.icon} />
            <h3 className="text-[16px] font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm leading-relaxed text-foreground-muted">{item.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

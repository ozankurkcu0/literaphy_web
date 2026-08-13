import { qrMenuComparisonRows } from "@/content/qr-menu";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function PricingComparisonTable() {
  return (
    <Section tone="elevated" padding="standard">
      <SectionHeading eyebrow="Karşılaştırma" title="Paketleri detaylı karşılaştırın" tone="product" className="mb-12" />
      <Reveal>
        <div className="overflow-x-auto rounded-lg border border-hairline">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface">
                <th className="px-6 py-4 font-semibold text-foreground">Özellik</th>
                <th className="px-6 py-4 font-semibold text-foreground">Başlangıç</th>
                <th className="px-6 py-4 font-semibold text-accent-product">Standart</th>
                <th className="px-6 py-4 font-semibold text-foreground">Premium</th>
              </tr>
            </thead>
            <tbody>
              {qrMenuComparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-hairline last:border-b-0 hover:bg-surface-hover">
                  <td className="px-6 py-4 text-foreground-secondary">{row.feature}</td>
                  <td className="px-6 py-4 text-foreground-muted">{row.starter}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{row.standard}</td>
                  <td className="px-6 py-4 text-foreground-muted">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}

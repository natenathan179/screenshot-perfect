import { createFileRoute } from "@tanstack/react-router";
import { InfoSections, PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/regulatory")({
  head: () => seo('Regulatory Disclosures & Compliance | PeptideLabs', 'PeptideLabs regulatory position on research peptides, controlled substances and regional product restrictions in the US, UK and EU.'),
  component: () => (
    <>
      <PageHero title={'Regulatory Disclosures'} subtitle={'PeptideLabs regulatory position on research peptides, controlled substances and regional product restrictions in the US, UK and EU.'} />
      <InfoSections sections={[{ h: 'Research use statement', p: ['Products are intended for laboratory research. No statements on this website have been evaluated by the FDA, MHRA or EMA.'] },{ h: 'Controlled substances', p: ['Anabolic steroids are Schedule III in the US (DEA), Class C in the UK (Misuse of Drugs Act) and prescription-only in the EU. They are supplied only to appropriately licensed and authorised buyers.'] },{ h: 'Regional restrictions', p: ['Product availability is checked against the destination country before any quote is issued. Some products are unavailable in certain regions.'] },{ h: 'Payment and shipping compliance', p: ['Payment processing, shipping and product listings comply with applicable laws and provider policies.'] }]} />
    </>
  ),
});

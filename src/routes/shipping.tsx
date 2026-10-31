import { createFileRoute } from "@tanstack/react-router";
import { InfoSections, PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/shipping")({
  head: () => seo('Shipping Policy | Worldwide Discreet Delivery | PeptideLabs', 'PeptideLabs shipping times, regions, packaging, cold-chain handling and customs information.'),
  component: () => (
    <>
      <PageHero title={'Shipping Policy'} subtitle={'PeptideLabs shipping times, regions, packaging, cold-chain handling and customs information.'} />
      <InfoSections sections={[{ h: 'Where we ship', p: ['We ship to the United States, United Kingdom, European Union and selected international markets where products are legally permitted. Some products are restricted by region.'] },{ h: 'Processing times', p: ['Confirmed orders are processed within 1–2 business days. Orders confirmed after 2pm local time ship the next business day.'] },{ h: 'Delivery estimates', p: [['United States: 2–5 business days','United Kingdom: 2–4 business days','Europe: 3–7 business days','International: 5–14 business days']] },{ h: 'Packaging', p: ['All parcels are discreet, tamper-evident and labelled only with the information required by carriers. Temperature-sensitive items are shipped with cold packs.'] },{ h: 'Customs and duties', p: ['International buyers are responsible for import permits, duties and taxes. We provide commercial invoices and COAs to support customs clearance.'] },{ h: 'Lost or damaged parcels', p: ['Contact us within 7 days of the expected delivery date. We will open a carrier investigation and arrange a replacement where appropriate.'] }]} />
    </>
  ),
});

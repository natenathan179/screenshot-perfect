import { createFileRoute } from "@tanstack/react-router";
import { InfoSections, PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/returns")({
  head: () => seo('Returns & Refunds Policy | PeptideLabs', 'How returns, replacements and refunds work at PeptideLabs for damaged, incorrect or non-conforming research products.'),
  component: () => (
    <>
      <PageHero title={'Returns Policy'} subtitle={'How returns, replacements and refunds work at PeptideLabs for damaged, incorrect or non-conforming research products.'} />
      <InfoSections sections={[{ h: 'Eligibility', p: ['Because of the nature of research compounds, we cannot accept returns of opened or temperature-sensitive products. Unopened items may be returned within 14 days of delivery.'] },{ h: 'Damaged or incorrect items', p: ['If an item arrives damaged, incorrect or outside specification, notify us within 7 days with photos and the lot number. We will replace it or issue a refund.'] },{ h: 'Non-conforming results', p: ['If your independent testing shows results outside the published specification, send us the data. Our QA team will review and, if confirmed, replace the batch.'] },{ h: 'Refund process', p: ['Approved refunds are issued to the original payment method within 5–10 business days.'] }]} />
    </>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { InfoSections, PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/faq")({
  head: () => seo('Frequently Asked Questions | PeptideLabs', 'Answers about ordering, research-use policy, COAs, shipping, storage and payment at PeptideLabs.'),
  component: () => (
    <>
      <PageHero title={'FAQ'} subtitle={'Answers about ordering, research-use policy, COAs, shipping, storage and payment at PeptideLabs.'} />
      <InfoSections sections={[{ h: 'How do I place an order?', p: ['Add products to your cart and choose Proceed to checkout, or click Request Quote on any product. Submit the inquiry form and our team will email a formal quote with payment and shipping instructions.'] },{ h: 'Why is there no online payment?', p: ['Because many of our products are regulated, we review every order for regional eligibility before accepting payment. This protects you and keeps us compliant.'] },{ h: 'Are your products for human use?', p: ['No. All products are sold strictly for laboratory research use only and are not intended for human or veterinary use.'] },{ h: 'Do you provide a Certificate of Analysis?', p: ['Yes. Every batch has a COA with HPLC purity, mass spec identity and lot number, available on request.'] },{ h: 'Which countries do you ship to?', p: ['The United States, United Kingdom, European Union and other international markets where the product may be legally supplied.'] },{ h: 'How should I store peptides?', p: ['Store lyophilised peptides at -20°C away from light and moisture. After reconstitution, refrigerate at 2–8°C.'] },{ h: 'Can I buy steroid reference compounds?', p: ['Only if you are an appropriately licensed or authorised buyer in your jurisdiction. These products are quote-only and require verification.'] },{ h: 'How long does delivery take?', p: ['Typically 2–5 business days in the US and UK, 3–7 in Europe and 5–14 internationally.'] }]} />
    </>
  ),
});

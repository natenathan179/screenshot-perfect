import { createFileRoute } from "@tanstack/react-router";
import { InfoSections, PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/terms")({
  head: () => seo('Terms & Conditions | PeptideLabs', 'Terms governing the use of the PeptideLabs website and the purchase of research products.'),
  component: () => (
    <>
      <PageHero title={'Terms & Conditions'} subtitle={'Terms governing the use of the PeptideLabs website and the purchase of research products.'} />
      <InfoSections sections={[{ h: 'Research use only', p: ['All products are supplied for in-vitro laboratory research only. They are not drugs, food, cosmetics or supplements and must not be used in humans or animals.'] },{ h: 'Buyer responsibility', p: ['You confirm you are at least 21, qualified to handle research chemicals, and legally permitted to purchase the products in your jurisdiction.'] },{ h: 'Quotes and pricing', p: ['Website prices are indicative. A binding contract forms only when we issue a written order confirmation.'] },{ h: 'Right to refuse', p: ['We may decline any inquiry or order, including where eligibility cannot be verified.'] },{ h: 'Liability', p: ['Our liability is limited to the purchase price of the products concerned. We are not liable for misuse.'] }]} />
    </>
  ),
});

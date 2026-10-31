import { createFileRoute } from "@tanstack/react-router";
import { InfoSections, PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () => seo('Privacy Policy | PeptideLabs', 'How PeptideLabs collects, uses and protects your personal data, in line with GDPR and UK data protection law.'),
  component: () => (
    <>
      <PageHero title={'Privacy Policy'} subtitle={'How PeptideLabs collects, uses and protects your personal data, in line with GDPR and UK data protection law.'} />
      <InfoSections sections={[{ h: 'Information we collect', p: ['We collect information you provide in inquiry, contact and newsletter forms: name, email, phone, country, organisation and message details.'] },{ h: 'How we use it', p: ['To respond to inquiries, prepare quotes, verify regulatory eligibility, fulfil orders and, if you opt in, send newsletters.'] },{ h: 'Sharing', p: ['We share data only with service providers needed to operate (email delivery, couriers) and when required by law. We never sell personal data.'] },{ h: 'Your rights', p: ['You may request access, correction or deletion of your data at any time by contacting support@peptidelabs.com.'] },{ h: 'Cookies and local storage', p: ['Your cart and wishlist are stored in your browser. We use no advertising cookies.'] }]} />
    </>
  ),
});

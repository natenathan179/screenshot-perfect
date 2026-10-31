import { createFileRoute } from "@tanstack/react-router";
import { PageHero, InfoSections, seo } from "@/components/site/PageHero";
import { SimpleForm } from "@/components/site/SimpleForm";

export const Route = createFileRoute("/track-order")({
  head: () => seo("Track Your Order | PeptideLabs", "Request a status update on your PeptideLabs order. Enter your order reference and email to receive tracking details."),
  component: () => (
    <>
      <PageHero title="Track Your Order" subtitle="Enter your order reference and the email used for your inquiry. We'll send you the latest status and courier tracking link." />
      <div className="container-x max-w-3xl py-12">
        <SimpleForm
          subject="Order tracking request - PeptideLabs"
          button="Request tracking update"
          fields={[
            { name: "order", label: "Order / quote reference", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "name", label: "Full name", full: true },
            { name: "notes", label: "Additional details", textarea: true },
          ]}
        />
      </div>
      <InfoSections sections={[
        { h: "Order stages", p: [["Inquiry received – our team reviews eligibility and stock.", "Quote confirmed – you receive pricing, shipping and payment instructions.", "Processing – your order is picked, packed and documented.", "Dispatched – a tracking number is emailed to you.", "Delivered – signature may be required for some products."]] },
        { h: "Typical delivery times", p: ["United States: 2–5 business days. United Kingdom: 2–4 business days. Europe: 3–7 business days. International: 5–14 business days depending on customs."] },
      ]} />
    </>
  ),
});

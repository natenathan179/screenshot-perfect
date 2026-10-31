import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero, seo } from "@/components/site/PageHero";
import { SimpleForm } from "@/components/site/SimpleForm";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact PeptideLabs | Customer & Scientific Support", "Contact PeptideLabs for product questions, quotes, documentation requests and order support. We reply within one business day."),
  component: () => (
    <>
      <PageHero title="Contact Us" subtitle="Questions about a product, documentation or an existing order? Send us a message and a specialist will reply within one business day." crumb="Contact Us" />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="space-y-4">
          {[
            [Mail, "Email", "support@peptidelabs.com"],
            [Phone, "Phone", "+1 (800) 555-0123"],
            [Clock, "Hours", "Mon–Fri, 9:00–18:00 (GMT/EST)"],
            [MapPin, "Serving", "United States • United Kingdom • Europe • International"],
          ].map(([I, t, d]) => { const Icon = I as typeof Mail; return (
            <div key={t as string} className="flex gap-3 rounded-lg bg-ice p-4">
              <Icon className="h-5 w-5 shrink-0 text-brand" />
              <div><p className="font-bold text-navy">{t as string}</p><p className="text-sm text-charcoal">{d as string}</p></div>
            </div>); })}
        </aside>
        <div className="rounded-xl border border-border p-6 md:p-8">
          <h2 className="mb-5 text-2xl font-extrabold text-navy">Send a message</h2>
          <SimpleForm
            subject="Contact form - PeptideLabs"
            button="Send message"
            fields={[
              { name: "name", label: "Full name", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "phone", label: "Phone" },
              { name: "subject", label: "Subject", required: true },
              { name: "message", label: "Message", textarea: true, required: true },
            ]}
          />
        </div>
      </div>
    </>
  ),
});

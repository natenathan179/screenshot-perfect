import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, FlaskConical, Globe2, Microscope } from "lucide-react";
import { PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/about")({
  head: () => seo("About PeptideLabs | Our Science, Quality Standards & Mission", "Learn how PeptideLabs sources, tests and documents research peptides and reference compounds for laboratories in the US, UK, Europe and beyond."),
  component: About,
});

function About() {
  return (
    <>
      <PageHero title="About PeptideLabs" subtitle="Advancing peptide science through purity, transparency and responsible supply." image="/images/lab.jpg" crumb="About Us" />
      <section className="container-x grid items-center gap-10 py-14 lg:grid-cols-2">
        <img src="/images/lab.jpg" alt="PeptideLabs scientist inspecting a vial" loading="lazy" className="rounded-xl shadow-card" />
        <div className="prose-lab">
          <h2>Who we are</h2>
          <p>PeptideLabs is a specialist supplier of research peptides, steroid reference standards, biotechnology products and laboratory consumables. We serve universities, contract research organisations, analytical laboratories and independent researchers who need materials they can trust.</p>
          <p>Our team combines backgrounds in analytical chemistry, pharmacology and regulatory affairs. That mix lets us offer more than a catalogue: we help customers choose the right compound, understand documentation and stay compliant with local law.</p>
          <h2>Our mission</h2>
          <p>To make high-purity research compounds accessible with complete transparency — every batch tested, every result documented, every shipment handled responsibly.</p>
        </div>
      </section>
      <section className="bg-ice">
        <div className="container-x grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [FlaskConical, "Independent testing", "Every lot is analysed by an accredited third-party laboratory using HPLC and LC-MS."],
            [Microscope, "Scientific support", "Speak with specialists who understand peptide chemistry and assay design."],
            [Award, "Documented quality", "Batch-specific Certificates of Analysis with traceable lot numbers."],
            [Globe2, "Responsible supply", "Regional eligibility checks so products ship only where legally permitted."],
          ].map(([I, t, d]) => { const Icon = I as typeof Award; return (
            <div key={t as string} className="rounded-lg bg-background p-6 shadow-card">
              <Icon className="h-9 w-9 text-brand" />
              <h3 className="mt-3 text-lg font-extrabold text-navy">{t as string}</h3>
              <p className="mt-2 text-sm text-charcoal">{d as string}</p>
            </div>); })}
        </div>
      </section>
      <section className="container-x prose-lab max-w-4xl py-14">
        <h2>Our quality process</h2>
        <ul>
          <li><strong>Sourcing:</strong> we partner only with GMP-aligned synthesis facilities that pass our supplier audits.</li>
          <li><strong>Testing:</strong> identity by mass spectrometry, purity by HPLC, plus endotoxin and sterility testing where relevant.</li>
          <li><strong>Documentation:</strong> a Certificate of Analysis is issued for every batch and archived for traceability.</li>
          <li><strong>Storage:</strong> temperature-controlled warehousing with continuous monitoring.</li>
          <li><strong>Dispatch:</strong> tamper-evident, discreet packaging with tracked shipping.</li>
        </ul>
        <h2>Markets we serve</h2>
        <p>We supply customers in the United States, United Kingdom, European Union and selected international markets where products may be legally marketed. Product listings and availability are restricted by jurisdiction, and controlled substances are supplied only to appropriately licensed buyers.</p>
        <p><Link to="/contact" className="font-semibold text-brand underline">Get in touch with our team →</Link></p>
      </section>
    </>
  );
}

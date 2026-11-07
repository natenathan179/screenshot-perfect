// Storefront taxonomy: main categories, subcategories, and the rules that assign them.

export const CATEGORIES = [
  {
    slug: "peptides",
    name: "Peptides",
    image: "/images/cat-peptides.jpg",
    tagline: "Research Peptides • GLP-1 Agonists • Growth Hormone Secretagogues",
    intro:
      "Our peptide catalogue covers high-purity research peptides including BPC-157, TB-500, semaglutide, tirzepatide, ipamorelin and GHK-Cu. Each lyophilised peptide is synthesised by solid-phase peptide synthesis, purified by preparative HPLC and verified by mass spectrometry before release. Every vial ships with a lot-specific Certificate of Analysis so your lab can trace identity, purity and net peptide content.",
  },
  {
    slug: "steroids",
    name: "Steroids",
    image: "/images/cat-steroids.jpg",
    tagline: "Androgen Reference Standards • Esters • Oral Compounds",
    intro:
      "Steroid reference compounds for analytical, pharmacological and toxicology research. Products in this category are prescription-only or controlled in many jurisdictions, including the United States, United Kingdom and much of Europe. They are supplied only to appropriately licensed and authorised buyers, and every inquiry is reviewed for regulatory eligibility before a quote is issued.",
  },
  {
    slug: "ancillaries",
    name: "Ancillaries & PCT",
    image: "/images/lab.jpg",
    tagline: "Aromatase Inhibitors • SERMs • Sexual Health • Metabolic",
    intro:
      "Ancillary reference compounds used alongside endocrine research, including aromatase inhibitors, selective estrogen receptor modulators, PDE5 inhibitors and metabolic agents. These are prescription-only medicines in most jurisdictions and are listed for information only.",
  },
  {
    slug: "biotech",
    name: "Biotechnology",
    image: "/images/cat-biotech.jpg",
    tagline: "Growth Factors • Hormones • Recombinant Proteins",
    intro:
      "Biotechnology products including recombinant growth factors and glycoprotein hormones such as IGF-1 LR3 and HCG. These materials support cell culture, endocrinology and assay development work and are handled under cold-chain conditions from manufacture to dispatch.",
  },
  {
    slug: "research",
    name: "Research Products",
    image: "/images/cat-research.jpg",
    tagline: "Lab Supplies • Reagents • Accessories",
    intro:
      "Everything a research bench needs to work with peptides safely and accurately: bacteriostatic water, reconstitution kits, pH-calibrated buffer sets and laboratory accessories. Quality-checked consumables help you get reproducible results batch after batch.",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const categoryName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

/** Controlled / prescription-only categories: informational listings, no cart or quote. */
export const isInfoOnly = (category: string) => category === "steroids" || category === "ancillaries";

type Rule = { slug: string; name: string; match?: RegExp };

// Rules are checked top to bottom; the first match wins. A rule without `match` is the fallback.
export const SUBCATEGORIES: Record<CategorySlug, Rule[]> = {
  peptides: [
    { slug: "recovery-healing", name: "Recovery & Healing", match: /bpc|tb-?500|\bglow\b|\bklow\b|\bkpv\b|ll-37/ },
    { slug: "weight-metabolic", name: "Weight & Metabolic", match: /semaglutide|tirzepatide|retatrutide|glp-|aod|5-amino|slu-pp|shred|carnitine|mots-?c/ },
    { slug: "gh-secretagogues", name: "GH Secretagogues", match: /cjc|ipamorelin|tesamorelin|ghrp|sermorelin|hexarelin/ },
    { slug: "cognitive-sleep", name: "Cognitive & Sleep", match: /semax|selank|dsip|adamax|dihexa|cerebrolysin/ },
    { slug: "longevity-skin", name: "Longevity & Skin", match: /epitalon|nad\+?|ss-31|glutathione|ghk/ },
    { slug: "tanning-libido", name: "Tanning & Libido", match: /melanotan|pt-141|kisspeptin/ },
    { slug: "other", name: "Other Peptides" },
  ],
  steroids: [
    { slug: "orals", name: "Oral Compounds", match: /anadrol|anavar|oxandrolone|dianabol|halotestin|proviron|superdrol|turinabol|winstrol|stanozolol/ },
    { slug: "injectables", name: "Injectables" },
  ],
  ancillaries: [
    { slug: "pct-estrogen", name: "PCT & Estrogen Control", match: /arimidex|anastr|aromasin|exemestane|letrozole|clomid|enclomiphene|tamoxifen|nolvadex|raloxifene/ },
    { slug: "sexual-health", name: "Sexual Health", match: /cialis|tadalafil|sildenafil|viagra/ },
    { slug: "metabolic", name: "Metabolic", match: /clenbuterol|\bt3\b|\bt4\b|thyroid/ },
    { slug: "other", name: "Other Ancillaries" },
  ],
  biotech: [
    { slug: "hgh", name: "Growth Hormone (HGH)", match: /hgh|somatropin/ },
    { slug: "hcg", name: "HCG", match: /\bhcg\b/ },
    { slug: "growth-factors", name: "Growth Factors", match: /igf|follistatin|mgf/ },
    { slug: "cellular-health", name: "Cellular Health", match: /nad|glutathione/ },
    { slug: "other", name: "Other Biotech" },
  ],
  research: [{ slug: "lab-supplies", name: "Lab Supplies" }],
};

// Products stored under "steroids" that are really ancillary drugs, not anabolic steroids.
const ANCILLARY = new RegExp(SUBCATEGORIES.ancillaries.flatMap((r) => (r.match ? [r.match.source] : [])).join("|"));

/** Derive the storefront category + subcategory for a product from its stored category and name. */
export function classify(p: { name: string; category: string }): { category: string; subcategory: string } {
  const name = p.name.toLowerCase();
  const category = p.category === "steroids" && ANCILLARY.test(name) ? "ancillaries" : p.category;
  const rules = SUBCATEGORIES[category as CategorySlug];
  const rule = rules?.find((r) => !r.match || r.match.test(name));
  return { category, subcategory: rule?.slug ?? "other" };
}

export const subcategoryName = (category: string, sub: string) =>
  SUBCATEGORIES[category as CategorySlug]?.find((r) => r.slug === sub)?.name ?? sub;

import { queryOptions } from "@tanstack/react-query";
import { getPost, getProduct, listPosts, listProducts, listReviews } from "./catalog.functions";

export const productsQuery = () => queryOptions({ queryKey: ["products"], queryFn: () => listProducts() });
export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }) });
export const postsQuery = () => queryOptions({ queryKey: ["posts"], queryFn: () => listPosts() });
export const postQuery = (slug: string) =>
  queryOptions({ queryKey: ["post", slug], queryFn: () => getPost({ data: { slug } }) });
export const reviewsQuery = () => queryOptions({ queryKey: ["reviews"], queryFn: () => listReviews() });

export type Product = Awaited<ReturnType<typeof listProducts>>[number];
export type PostSummary = Awaited<ReturnType<typeof listPosts>>[number];

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

export const categoryName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export const productImage = (p: Product) =>
  [...(p.product_images ?? [])].sort((a, b) => a.position - b.position)[0]?.url ?? "/images/products/vial-blue.jpg";

export const money = (n: number) => `$${Number(n).toFixed(2)}`;

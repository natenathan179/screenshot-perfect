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

export { CATEGORIES, SUBCATEGORIES, categoryName, subcategoryName, isInfoOnly } from "./taxonomy";

export const productImage = (p: Product) =>
  [...(p.product_images ?? [])].sort((a, b) => a.position - b.position)[0]?.url ?? "/images/products/vial-blue.jpg";

export const money = (n: number) => `$${Number(n).toFixed(2)}`;

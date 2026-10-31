import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const PRODUCT_SELECT = "*, product_images(id,url,position)";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { data: p, error } = await publicClient()
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return p;
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("posts")
    .select("id,title,slug,excerpt,cover_url,author,tags,published_at")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { data: p, error } = await publicClient().from("posts").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    return p;
  });

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("reviews").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

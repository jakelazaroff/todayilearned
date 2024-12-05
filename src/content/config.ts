import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const til = defineCollection({
  loader: glob({ pattern: "*/**/[^_]*.md", base: "./til" }),
});

export const collections = { til };

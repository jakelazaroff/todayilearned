import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://til.jakelazaroff.com",
  markdown: { shikiConfig: { theme: "material-theme-palenight" } },
  vite: { resolve: { preserveSymlinks: true } }
});

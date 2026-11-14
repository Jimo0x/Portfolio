import { defineConfig } from "vite";
import { resolve } from "node:path";
import { PROJECTS } from "./src/data.js";

/* Site multi-pages : chaque page HTML (générée par scripts/pages.mjs) est une entrée. */
const page = p => resolve(import.meta.dirname, p);
const input = {
  accueil: page("index.html"),
  projets: page("projets/index.html"),
  services: page("services/index.html"),
  apropos: page("a-propos/index.html"),
  contact: page("contact/index.html"),
  introuvable: page("404.html"),
  ...Object.fromEntries(PROJECTS.map(p => ["projet-" + p.id, page(`projets/${p.id}/index.html`)])),
};

export default defineConfig({
  build: { rolldownOptions: { input } },
});

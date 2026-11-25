import { defineConfig } from "vite";
import { resolve } from "node:path";
import { PROJECTS } from "./src/data.js";

/* Site multi-pages : chaque page HTML (générée par scripts/pages.mjs) est une entrée.
   Chaque page existe en deux langues (racine = fr, /en/ = en) ; les deux doivent être
   listées ici, sinon la version qui manque n'est jamais copiée dans le build et son URL
   renvoie un 404 une fois déployé. */
const page = p => resolve(import.meta.dirname, p);
const input = {
  accueil: page("index.html"),
  projets: page("projets/index.html"),
  services: page("services/index.html"),
  apropos: page("a-propos/index.html"),
  contact: page("contact/index.html"),
  introuvable: page("404.html"),
  ...Object.fromEntries(PROJECTS.map(p => ["projet-" + p.id, page(`projets/${p.id}/index.html`)])),
  "en-accueil": page("en/index.html"),
  "en-projets": page("en/projets/index.html"),
  "en-services": page("en/services/index.html"),
  "en-apropos": page("en/a-propos/index.html"),
  "en-contact": page("en/contact/index.html"),
  "en-introuvable": page("en/404.html"),
  ...Object.fromEntries(PROJECTS.map(p => ["en-projet-" + p.id, page(`en/projets/${p.id}/index.html`)])),
};

export default defineConfig({
  build: { rolldownOptions: { input } },
});

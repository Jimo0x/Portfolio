/* Couche de langue pour le rendu client (carte réseau, liste de projets, palette,
   terminal, timeline, stats, scan de compétences). La langue de la page est fixée
   une fois pour toutes par scripts/pages.mjs (attribut lang="fr"|"en" sur <html>),
   donc pas de bascule dynamique ici : on choisit juste la bonne variante de données
   au chargement du module. Les six modules qui lisaient PROJECTS/PROFILE/KINDS/...
   depuis ./data.js les lisent maintenant depuis ce fichier, sous les mêmes noms. */

import { PROFILE as PROFILE_FR, KINDS as KINDS_FR, PROJECTS as PROJECTS_FR, MAP_IDS, TIMELINE as TIMELINE_FR, SERVICES as SERVICES_FR, STACK as STACK_FR, STATS as STATS_FR, imageUrl } from "./data.js";
import { PROFILE_EN, KINDS_EN, PROJECTS_EN, TIMELINE_EN, SERVICES_EN, STACK_EN, STATS_LABELS_EN } from "./content.en.js";

export const LANG = (typeof document !== "undefined" && document.documentElement.lang === "en") ? "en" : "fr";

export const PROFILE = LANG === "en" ? { ...PROFILE_FR, ...PROFILE_EN } : PROFILE_FR;
export const KINDS = LANG === "en" ? KINDS_EN : KINDS_FR;
export const PROJECTS = LANG === "en"
  ? PROJECTS_FR.map(p => ({ ...p, ...(PROJECTS_EN[p.id] || {}) }))
  : PROJECTS_FR;
export const TIMELINE = LANG === "en" ? TIMELINE_EN : TIMELINE_FR;
export const SERVICES = LANG === "en" ? SERVICES_EN : SERVICES_FR;
export const STACK = LANG === "en" ? STACK_EN : STACK_FR;
export const STATS = LANG === "en" ? STATS_FR.map((s, i) => ({ ...s, label: STATS_LABELS_EN[i] })) : STATS_FR;
export { MAP_IDS, imageUrl };

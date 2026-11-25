/* Générateur des pages du portfolio, en français et en anglais.
   Toutes les pages partagent la même tête (métadonnées de partage), la même barre latérale
   et le même pied de page ; seul le contenu change. Le texte des projets vient de src/data.js
   (français) et src/content.en.js (anglais, fusionné par id de projet).

   Lancer : npm run pages   (exécuté aussi automatiquement par npm run build)

   Pages générées, pour chaque langue (le français à la racine, l'anglais sous /en/) :
     index.html                 accueil
     projets/index.html         tous les projets
     projets/<id>/index.html    une page par projet
     services/index.html
     a-propos/index.html
     contact/index.html
     404.html
     public/sitemap.xml, public/robots.txt (communs aux deux langues) */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROFILE as PROFILE_FR, PROJECTS as PROJECTS_FR, KINDS as KINDS_FR, TIMELINE as TIMELINE_FR, SERVICES as SERVICES_FR, STACK as STACK_FR, imageUrl } from "../src/data.js";
import { PROFILE_EN, KINDS_EN, PROJECTS_EN, TIMELINE_EN, SERVICES_EN, STACK_EN } from "../src/content.en.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://jimoox.vercel.app";
const YEAR = 2026;
const LOCALES = ["fr", "en"];

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const cap = s => s[0].toUpperCase() + s.slice(1);

/* Chemin « logique » (sans préfixe de langue) -> chemin réel pour la langue donnée.
   Le français reste à la racine (inchangé), l'anglais vit sous /en/. */
const L = (p, locale) => (locale === "fr" ? p : (p === "/" ? "/en/" : "/en" + p));

const NUM = {
  fr: ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"],
  en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
};
const word = (n, locale) => NUM[locale][n] ?? String(n);

/* Chaînes d'interface fixes (hors contenu des projets, qui vient de data.js / content.en.js). */
const UI = {
  fr: {
    skip: "Aller au contenu", openMenu: "Ouvrir le menu", mainMenu: "Menu principal", expandMenu: "Déplier le menu",
    backHome: "Julio Dahou, retour à l'accueil", pages: "Pages", tools: "Outils", search: "Rechercher",
    terminal: "Terminal", github: "GitHub", email: "Email", openRemote: "Ouvert au remote",
    readAt: pct => `Cotonou <b data-clock>--:--</b>, lu à <b id="stScroll">${pct}</b>`,
    footerNav: "Pied de page", footerLine: `© ${YEAR} Julio Dahou, conçu et codé à Cotonou`,
    commandPalette: "Palette de commandes", searchPlaceholder: "Chercher un projet ou une page…",
    nextPage: "Page suivante",
    homeTitle: "Julio Dahou, cybersécurité et développement",
    homeDesc: n => `Portfolio de Julio Dahou, spécialiste cybersécurité et développeur à Cotonou, ouvert au remote. ${cap(word(n, "fr"))} outils de sécurité, des projets d'IA, des applications web et des jeux jouables dans le navigateur.`,
    homeImgAlt: "Julio Dahou : je casse des systèmes pour mieux les protéger. Carte réseau en pixel art.",
    heroTitle1: "Je casse des systèmes", heroTitle2: "pour mieux les protéger.",
    heroLede: "Julio Dahou, spécialiste cybersécurité et développeur à Cotonou, ouvert au remote. Pentest, analyse SOC, C, Python et web.",
    runBtn: "./voir-les-projets.sh", contactBtn: "Me contacter",
    mapHint: "Chaque nœud est un projet. Clique dessus.", mapAria: "Projets sur la carte",
    reportPath: "~/rapport", statsTitle1: "Le travail, ", statsTitle2: "en clair",
    pickPath: "~/projets --selection", pickTitle1: "Trois projets ", pickTitle2: "pour commencer",
    seeAll: n => `Voir les ${n} projets`,
    dirPath: "ls -l ~/", dirTitle1: "La suite ", dirTitle2: "du portfolio",
    dirProjets: n => `Les ${word(n, "fr")} projets en détail : sécurité, IA, web, outils système, jeux et créations.`,
    dirEntries: n => `${n} entrées`,
    dirServices: "Test d'intrusion, revue de code, développement web, outils sur mesure.",
    dirServicesN: n => `${n} services`,
    dirAbout: "Mon parcours, ma formation et le scan complet de mes compétences.",
    dirAboutN: n => `${n} étapes`,
    dirContact: "Email, téléphone et GitHub. Je réponds vite.", dirOpen: "ouvert",
    projetsTitle: "Projets | Julio Dahou",
    projetsDesc: (n, c, i, w, j) => `${cap(word(n, "fr"))} projets de Julio Dahou : ${word(c, "fr")} outils de cybersécurité, ${word(i, "fr")} projets d'IA, ${word(w, "fr")} applications web, ${word(j, "fr")} jeux jouables dans le navigateur, des outils système et des projets créatifs.`,
    projetsImgAlt: n => `Les ${n} projets de Julio Dahou, en pixel art.`,
    projetsLede: (n, c, i, w, j) => `${cap(word(n, "fr"))} projets, du scanner réseau au jeu vidéo : ${word(c, "fr")} outils de cybersécurité, ${word(i, "fr")} projets d'IA, ${word(w, "fr")} applications web, ${word(j, "fr")} jeux, un lecteur de musique multiplateforme et des expériences créatives. Ouvre une fenêtre pour lire l'étude complète.`,
    filterLabel: "Filtrer par domaine :", filterAria: "Filtrer les projets",
    projetsTitleH1: "Ce que <em>j'ai construit</em>",
    nextServices: "Ce que ces projets peuvent devenir pour toi : audit, revue de code, développement.",
    viewCode: "Voir le code", privateRepo: "Dépôt privé, démo sur demande",
    breadcrumbAria: "Fil d'Ariane", talk: "En parler", keyFeatures: "Points clés",
    dtDomain: "Domaine", dtCode: "Code", dtTech: "Technologies",
    otherProjectsAria: "Autres projets", previous: "Précédent", back: "Retour", allProjects: "Tous les projets", next: "Suivant",
    servicesTitle: "Services | Julio Dahou",
    servicesDesc: "Test d'intrusion, revue de sécurité du code, développement web sécurisé, outils Python sur mesure et sensibilisation au phishing. Julio Dahou, Cotonou, en remote ou sur place.",
    servicesImgAlt: "Services de Julio Dahou : test d'intrusion, revue de code, développement web.",
    servicesLede: "Auditer une application qui existe déjà, en construire une nouvelle qui tient la route, ou écrire les outils qui automatisent le travail de sécurité. Je travaille depuis Cotonou, en remote ou sur place.",
    servicesTitleH1: "Ce que je <em>peux faire pour toi</em>",
    servicesHint: "Choisis une commande : la console te répond.",
    howTitle: "Comment <em>je travaille</em>",
    proofTitle: "Ce que <em>ça donne en vrai</em>",
    proofs: [
      ["Analyse de menaces", "Phishing &amp; Threat Detector", "Un score de risque et un rapport HTML qui ne peut pas piéger l'analyste qui l'ouvre.", "phishing"],
      ["Sécurité de la chaîne d'approvisionnement", "safe-install", "Un paquet npm ou PyPI piégé est bloqué avant de s'installer.", "safe-install"],
      ["Développement web sécurisé", "SynergyCraft", "Les règles d'accès vivent dans la base de données, le paiement est vérifié par signature.", "synergy"],
    ],
    nextAbout: "Qui est derrière ces services : formation, parcours et compétences.",
    aboutTitle: "À propos | Julio Dahou",
    aboutDesc: "Julio Dahou, étudiant en cybersécurité et expertise informatique (ESGIS Bénin et Epitech Bénin) à Cotonou. Parcours, formation et compétences : C, Python, pentest, analyse SOC, web.",
    aboutImgAlt: "À propos de Julio Dahou : parcours et compétences.",
    aboutLede: "Julio Dahou, étudiant en cybersécurité et expertise informatique à Cotonou. J'apprends à attaquer les systèmes pour savoir les défendre, et je construis les outils dont j'ai besoin en chemin.",
    aboutTitleH1: "Derrière <em>le terminal</em>",
    bio: [
      "Tout a commencé par l'électronique : un baccalauréat F2 au Lycée Don Bosco, des circuits et des systèmes industriels. Comprendre une machine de l'intérieur m'a mené vers l'informatique, puis vers sa sécurité.",
      "En stage chez Accompli Technologie et Services, à Cotonou, j'ai maintenu un parc informatique, géré des réseaux et monté des projets embarqués sur Arduino. Aujourd'hui je me forme à la sécurité offensive, aux systèmes et à la programmation en C à ESGIS Bénin et Epitech Bénin.",
      "Mes projets suivent une même logique. Chaque outil part d'une attaque réelle : phishing, paquet piégé, reconnaissance réseau. Et chaque application que je construis applique ce que ces outils m'ont appris : entrées validées, rapports échappés, règles d'accès gravées dans la base de données.",
    ],
    factBasedIn: "Basé à", factLocalTime: "Heure locale", factWork: "Travail", factWorkVal: "Remote ou sur place",
    factEducation: "Formation", factLanguages: "Langages", factCode: "Code",
    pathTitle: "D'où <em>je viens</em>", skillTitle: "Scan de <em>mes compétences</em>", skillHint: "Tous les ports sont ouverts. Survole une ligne.",
    nextContact: "Un audit, un projet, un stage : établissons la connexion.",
    contactTitle: "Contact | Julio Dahou",
    contactDesc: email => `Écrire à Julio Dahou pour un audit, un projet web ou un stage : ${email}. Basé à Cotonou, ouvert au remote.`,
    contactImgAlt: "Contacter Julio Dahou.",
    contactLede: "Un audit, un projet, un stage ou une simple question : écris-moi, je réponds vite.",
    contactTitleH1: "Établissons <em>la connexion</em>",
    writeEmail: "Écrire un email",
    contactSub: "Pour une réponse rapide, précise",
    checklist: [
      "Ce que tu veux : un audit, une application, un outil, un stage",
      "Le contexte : site, API, réseau ou application à construire",
      "Le délai que tu vises",
      "Pour un test d'intrusion : le périmètre que tu es en droit de faire tester",
    ],
    factEmail: "Email", factPhone: "Téléphone", factCity: "Ville",
    notFoundTitle: "Page introuvable | Julio Dahou",
    notFoundDesc: "Cette page n'existe pas. Retour au portfolio de Julio Dahou.",
    notFoundImgAlt: "Julio Dahou, cybersécurité et développement.",
    notFoundH1: "Cette page <em>n'existe pas</em>",
    notFoundLede: "Le lien est peut-être ancien, ou mal recopié. Tout le reste est à sa place :",
    notFoundCd: "cd: aucun fichier ou dossier de ce nom",
  },
  en: {
    skip: "Skip to content", openMenu: "Open menu", mainMenu: "Main menu", expandMenu: "Expand menu",
    backHome: "Julio Dahou, back to home", pages: "Pages", tools: "Tools", search: "Search",
    terminal: "Terminal", github: "GitHub", email: "Email", openRemote: "Open to remote work",
    readAt: pct => `Cotonou <b data-clock>--:--</b>, read <b id="stScroll">${pct}</b>`,
    footerNav: "Footer", footerLine: `© ${YEAR} Julio Dahou, designed and coded in Cotonou`,
    commandPalette: "Command palette", searchPlaceholder: "Search a project or a page…",
    nextPage: "Next page",
    homeTitle: "Julio Dahou, cybersecurity and software development",
    homeDesc: n => `Julio Dahou's portfolio: a cybersecurity specialist and developer in Cotonou, open to remote work. ${cap(word(n, "en"))} security tools, AI projects, web apps, and browser-playable games.`,
    homeImgAlt: "Julio Dahou: I break systems to protect them better. Pixel-art network map.",
    heroTitle1: "I break systems", heroTitle2: "to protect them better.",
    heroLede: "Julio Dahou, cybersecurity specialist and developer in Cotonou, open to remote work. Pentesting, SOC analysis, C, Python, and web.",
    runBtn: "./see-the-projects.sh", contactBtn: "Contact me",
    mapHint: "Each node is a project. Click it.", mapAria: "Projects on the map",
    reportPath: "~/report", statsTitle1: "The work, ", statsTitle2: "laid bare",
    pickPath: "~/projects --selection", pickTitle1: "Three projects ", pickTitle2: "to start with",
    seeAll: n => `See all ${n} projects`,
    dirPath: "ls -l ~/", dirTitle1: "More ", dirTitle2: "of the portfolio",
    dirProjets: n => `All ${word(n, "en")} projects in detail: security, AI, web, system tools, games, and creations.`,
    dirEntries: n => `${n} entries`,
    dirServices: "Penetration testing, code review, web development, custom tools.",
    dirServicesN: n => `${n} services`,
    dirAbout: "My background, education, and a full scan of my skills.",
    dirAboutN: n => `${n} steps`,
    dirContact: "Email, phone, and GitHub. I reply fast.", dirOpen: "open",
    projetsTitle: "Projects | Julio Dahou",
    projetsDesc: (n, c, i, w, j) => `${cap(word(n, "en"))} projects by Julio Dahou: ${word(c, "en")} cybersecurity tools, ${word(i, "en")} AI projects, ${word(w, "en")} web apps, ${word(j, "en")} browser-playable games, system tools, and creative projects.`,
    projetsImgAlt: n => `Julio Dahou's ${n} projects, in pixel art.`,
    projetsLede: (n, c, i, w, j) => `${cap(word(n, "en"))} projects, from network scanners to video games: ${word(c, "en")} cybersecurity tools, ${word(i, "en")} AI projects, ${word(w, "en")} web apps, ${word(j, "en")} games, a cross-platform music player, and creative experiments. Open a window to read the full case study.`,
    filterLabel: "Filter by category:", filterAria: "Filter projects",
    projetsTitleH1: "What I've <em>built</em>",
    nextServices: "What these projects can become for you: audit, code review, development.",
    viewCode: "View code", privateRepo: "Private repo, demo on request",
    breadcrumbAria: "Breadcrumb", talk: "Let's talk about it", keyFeatures: "Key features",
    dtDomain: "Category", dtCode: "Code", dtTech: "Technologies",
    otherProjectsAria: "Other projects", previous: "Previous", back: "Back", allProjects: "All projects", next: "Next",
    servicesTitle: "Services | Julio Dahou",
    servicesDesc: "Penetration testing, security code review, secure web development, custom Python tools, and phishing awareness. Julio Dahou, Cotonou, remote or on-site.",
    servicesImgAlt: "Julio Dahou's services: penetration testing, code review, web development.",
    servicesLede: "Auditing an app that already exists, building a solid new one, or writing the tools that automate security work. I work from Cotonou, remote or on-site.",
    servicesTitleH1: "What I can <em>do for you</em>",
    servicesHint: "Pick a command: the console answers.",
    howTitle: "How <em>I work</em>",
    proofTitle: "What it looks like <em>in practice</em>",
    proofs: [
      ["Threat analysis", "Phishing &amp; Threat Detector", "A risk score and an HTML report that can't trap the analyst who opens it.", "phishing"],
      ["Supply-chain security", "safe-install", "A booby-trapped npm or PyPI package is blocked before it installs.", "safe-install"],
      ["Secure web development", "SynergyCraft", "Access rules live in the database, payment is verified by signature.", "synergy"],
    ],
    nextAbout: "Who's behind these services: education, background, and skills.",
    aboutTitle: "About | Julio Dahou",
    aboutDesc: "Julio Dahou, a student in cybersecurity and IT (ESGIS Benin and Epitech Benin) in Cotonou. Background, education, and skills: C, Python, pentesting, SOC analysis, web.",
    aboutImgAlt: "About Julio Dahou: background and skills.",
    aboutLede: "Julio Dahou, a cybersecurity and IT student in Cotonou. I learn to attack systems in order to know how to defend them, and I build the tools I need along the way.",
    aboutTitleH1: "Behind <em>the terminal</em>",
    bio: [
      "It all started with electronics: a Baccalauréat F2 at Lycée Don Bosco, circuits, and industrial systems. Understanding a machine from the inside led me to computing, then to its security.",
      "During an internship at Accompli Technologie et Services, in Cotonou, I maintained a computer fleet, managed networks, and ran embedded Arduino projects. Today I'm training in offensive security, systems, and C programming at ESGIS Benin and Epitech Benin.",
      "My projects all follow the same logic. Every tool starts from a real attack: phishing, a booby-trapped package, network recon. And every app I build applies what those tools taught me: validated input, escaped reports, access rules carved into the database.",
    ],
    factBasedIn: "Based in", factLocalTime: "Local time", factWork: "Work", factWorkVal: "Remote or on-site",
    factEducation: "Education", factLanguages: "Languages", factCode: "Code",
    pathTitle: "Where I <em>come from</em>", skillTitle: "Scanning <em>my skills</em>", skillHint: "All ports are open. Hover a line.",
    nextContact: "An audit, a project, an internship: let's connect.",
    contactTitle: "Contact | Julio Dahou",
    contactDesc: email => `Write to Julio Dahou for an audit, a web project, or an internship: ${email}. Based in Cotonou, open to remote work.`,
    contactImgAlt: "Contact Julio Dahou.",
    contactLede: "An audit, a project, an internship, or just a question: write to me, I reply fast.",
    contactTitleH1: "Let's <em>connect</em>",
    writeEmail: "Send an email",
    contactSub: "For a fast, precise reply",
    checklist: [
      "What you need: an audit, an app, a tool, an internship",
      "The context: a site, API, network, or app to build",
      "Your target timeline",
      "For a penetration test: the scope you're authorized to have tested",
    ],
    factEmail: "Email", factPhone: "Phone", factCity: "City",
    notFoundTitle: "Page not found | Julio Dahou",
    notFoundDesc: "This page doesn't exist. Back to Julio Dahou's portfolio.",
    notFoundImgAlt: "Julio Dahou, cybersecurity and development.",
    notFoundH1: "This page <em>doesn't exist</em>",
    notFoundLede: "The link might be old, or mistyped. Everything else is right where it should be:",
    notFoundCd: "cd: no such file or directory",
  },
};

/* ------------------------------------------------------------------ icônes (identiques dans les deux langues) */
const I = {
  home: `<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>`,
  works: `<rect x="3" y="4" width="8" height="7"/><rect x="13" y="4" width="8" height="7"/><rect x="3" y="13" width="8" height="7"/><rect x="13" y="13" width="8" height="7"/>`,
  shield: `<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>`,
  mail: `<rect x="3" y="5" width="18" height="14"/><path d="m3 7 9 6 9-6"/>`,
  search: `<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>`,
  term: `<path d="m5 7 5 5-5 5M12 18h7"/>`,
  arrow: `<path d="M5 12h14M13 6l6 6-6 6"/>`,
  back: `<path d="M19 12H5M11 6l-6 6 6 6"/>`,
};
const svg = (name, cls = "") => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ""}>${I[name]}</svg>`;
const GH = `<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>`;

const ALL_URLS = []; // chemins réels (avec préfixe /en si besoin), accumulés pour le sitemap commun

/* Respecte la langue mémorisée (bouton FR/EN, localStorage) même quand on arrive par un lien ou
   un favori dans l'autre langue. Le bouton écrit lui-même la langue cible avant de naviguer,
   donc il n'y a jamais de redirection en boucle. Placé tout en haut de <head>, avant le CSS,
   pour rediriger avant le premier rendu. */
const LANG_REDIRECT = `(function(){try{var want=localStorage.getItem("lang");var cur=document.documentElement.lang;if(!want||want===cur)return;var p=location.pathname,target;if(want==="en"){target=cur==="fr"?("/en"+(p==="/"?"/":p)):p;}else{target=p.replace(/^\\/en(\\/|$)/,"/");if(target==="")target="/";}if(target!==p)location.replace(target+location.search+location.hash);}catch(e){}})();`;

/* ===================================================================
   Construction d'une langue complète du site.
   =================================================================== */
function buildLocale(locale) {
  const t = UI[locale];
  const PROFILE = locale === "en" ? { ...PROFILE_FR, ...PROFILE_EN } : PROFILE_FR;
  const KINDS = locale === "en" ? KINDS_EN : KINDS_FR;
  const PROJECTS = locale === "en" ? PROJECTS_FR.map(p => ({ ...p, ...(PROJECTS_EN[p.id] || {}) })) : PROJECTS_FR;
  const TIMELINE = locale === "en" ? TIMELINE_EN : TIMELINE_FR;
  const SERVICES = locale === "en" ? SERVICES_EN : SERVICES_FR;
  const STACK = locale === "en" ? STACK_EN : STACK_FR;
  const count = kind => PROJECTS.filter(p => p.kind === kind).length;
  const l = p => L(p, locale); // raccourci local

  const NAV = [
    { key: "accueil", href: l("/"), label: locale === "fr" ? "Accueil" : "Home", icon: "home" },
    { key: "projets", href: l("/projets/"), label: locale === "fr" ? "Projets" : "Projects", icon: "works" },
    { key: "services", href: l("/services/"), label: locale === "fr" ? "Services" : "Services", icon: "shield" },
    { key: "a-propos", href: l("/a-propos/"), label: locale === "fr" ? "À propos" : "About", icon: "user" },
    { key: "contact", href: l("/contact/"), label: locale === "fr" ? "Contact" : "Contact", icon: "mail" },
  ];

  /* ------------------------------------------------------------------ tête */
  function head({ logicalPath, title, description, image, imageAlt, type = "website", noindex = false, jsonld = [], extra = "" }) {
    const path = l(logicalPath);
    const url = SITE + path;
    const img = SITE + image;
    const altFr = SITE + logicalPath;
    const altEn = SITE + L(logicalPath, "en");
    if (!noindex) ALL_URLS.push(path);
    return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>${LANG_REDIRECT}</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(PROFILE.name)}">
${noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`}
<link rel="alternate" hreflang="fr" href="${altFr}">
<link rel="alternate" hreflang="en" href="${altEn}">
<link rel="alternate" hreflang="x-default" href="${altFr}">
<meta name="theme-color" content="#050505">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Julio Dahou">
<meta property="og:locale" content="${locale === "fr" ? "fr_FR" : "en_US"}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${img}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${img}">
<meta name="twitter:image:alt" content="${esc(imageAlt)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,500;0,600;0,700;1,500&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/src/style.css">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}${extra}
</head>`;
  }

  /* ------------------------------------------------------------------ barre latérale */
  function side(active, logicalPath) {
    const links = NAV.map((n, i) => {
      const on = n.key === active;
      return `      <a href="${n.href}" data-label="${n.label}"${on ? ` class="active" aria-current="page"` : ""}>${svg(n.icon)}<span class="lbl"><i>${i}</i>${n.label}</span></a>`;
    }).join("\n");
    const otherLocale = locale === "fr" ? "en" : "fr";
    const otherHref = L(logicalPath ?? "/", otherLocale);
    const langLabel = otherLocale.toUpperCase();
    const langTip = locale === "fr" ? "Switch to English" : "Passer en français";
    const langLink = `<a class="lang-switch" id="langToggle" href="${otherHref}" title="${langTip}" aria-label="${langTip}" onclick="try{localStorage.setItem('lang','${otherLocale}')}catch(e){}"><span class="lang-ic" aria-hidden="true">${langLabel}</span></a>`;
    return `<div class="progress" aria-hidden="true"><span id="progressBar"></span></div>
<div class="scanline" aria-hidden="true"></div>
<a class="skip" href="#contenu">${t.skip}</a>
${langLink}

<header class="mobilebar" id="topbar">
  <button class="side-toggle" type="button" data-side-toggle aria-controls="side" aria-expanded="false" aria-label="${t.openMenu}"><span></span><span></span><span></span></button>
  <a class="brand" href="${l("/")}"><span class="brand-prompt">&gt;</span>julio<b>_</b>dahou</a>
</header>
<div class="side-scrim" data-side-close></div>
<aside class="side" id="side" aria-label="${t.mainMenu}">
  <div class="side-head">
    <button class="side-toggle" type="button" data-side-toggle aria-controls="side" aria-expanded="false" aria-label="${t.expandMenu}"><span></span><span></span><span></span></button>
    <a class="brand" href="${l("/")}" aria-label="${t.backHome}"><span class="brand-prompt">&gt;</span><span class="lbl">julio<b>_</b>dahou</span></a>
  </div>
  <p class="side-caption lbl">${t.pages}</p>
  <nav class="side-nav" aria-label="${t.pages}">
${links}
  </nav>
  <p class="side-caption lbl">${t.tools}</p>
  <div class="side-tools">
    <button type="button" id="paletteBtn" data-label="${t.search}">${svg("search")}<span class="lbl">${t.search} <kbd>Ctrl K</kbd></span></button>
    <button type="button" id="termBtn" data-terminal data-label="${t.terminal}">${svg("term")}<span class="lbl">${t.terminal} <kbd>\`</kbd></span></button>
    <a href="${PROFILE.github}" target="_blank" rel="noopener" data-label="${t.github}">${GH}<span class="lbl">${t.github}</span></a>
    <a href="mailto:${PROFILE.email}" data-label="${t.email}">${svg("mail")}<span class="lbl">${t.email}</span></a>
  </div>
  <div class="side-foot">
    <div class="side-meter" aria-hidden="true"><span id="sideMeter"></span></div>
    <p class="lbl side-status"><span class="dot"></span>${t.openRemote}</p>
    <p class="lbl side-pct">${t.readAt("0%")}</p>
  </div>
</aside>`;
  }

  /* ------------------------------------------------------------------ pied de page */
  function foot() {
    return `<div class="wordmark" aria-hidden="true"><span id="wordmark">Julio Dahou</span></div>
<footer class="foot">
  <nav class="foot-nav" aria-label="${t.footerNav}">${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join("")}</nav>
  <span>${t.footerLine}</span>
</footer>

<div class="palette" id="palette" hidden>
  <div class="palette-box" role="dialog" aria-modal="true" aria-label="${t.commandPalette}">
    <input id="paletteInput" type="text" placeholder="${t.searchPlaceholder}" autocomplete="off" spellcheck="false" aria-controls="paletteList">
    <ul id="paletteList" role="listbox"></ul>
  </div>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>document.documentElement.lang="${locale}";</script>
<script type="module" src="/src/app.js"></script>
</body>
</html>
`;
  }

  /* En-tête des pages intérieures : chemin, titre caviardé, introduction. */
  function pageHead({ path, title, lede }) {
    return `  <header class="block page-head">
    <p class="path">~/${path}</p>
    <h1 class="page-title">${title}</h1>
    <p class="page-lede">${lede}</p>
  </header>`;
  }

  /* Bandeau « page suivante » en bas des pages : le portfolio se lit dans l'ordre du menu. */
  function nextBand(key, text) {
    const n = NAV.find(x => x.key === key);
    return `  <a class="next-band" href="${n.href}">
    <span class="next-k">${t.nextPage}</span>
    <span class="next-t"><span class="next-path">cd ~/${key === "accueil" ? "" : key}</span><b>${n.label}</b></span>
    <span class="next-d">${text}</span>
    <span class="next-arrow">${svg("arrow")}</span>
  </a>`;
  }

  function write(rel, html) {
    const file = join(ROOT, locale === "fr" ? rel : join("en", rel));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  }

  const PERSON = {
    "@type": "Person",
    name: PROFILE.name,
    jobTitle: PROFILE.role,
    email: "mailto:" + PROFILE.email,
    url: SITE + l("/"),
    image: SITE + "/og/accueil.png",
    address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" },
    sameAs: [PROFILE.github],
    knowsAbout: STACK.flatMap(s => s.items),
  };
  const crumbs = items => ({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + l(path) })),
  });

  /* =================================================================== ACCUEIL */
  const HOME_PICKS = ["phishing", "safe-install", "breach"];

  write("index.html", `${head({
    logicalPath: "/",
    title: t.homeTitle,
    description: t.homeDesc(count("cyber")),
    image: "/og/accueil.png",
    imageAlt: t.homeImgAlt,
    jsonld: [{ "@context": "https://schema.org", ...PERSON }, { "@context": "https://schema.org", "@type": "WebSite", name: "Julio Dahou", url: SITE + l("/"), inLanguage: locale }],
    // les anciens liens (#projet-breach, #contact…) mènent vers les nouvelles pages
    extra: `\n<script>(function(){var h=location.hash,m=h.match(/^#projet-([\\w-]+)$/),t={"#projets":"${l("/projets/")}","#services":"${l("/services/")}","#competences":"${l("/a-propos/")}","#parcours":"${l("/a-propos/")}","#contact":"${l("/contact/")}"};if(m)location.replace("${l("/projets/")}"+m[1]+"/");else if(t[h])location.replace(t[h]);})();</script>`,
  })}
<body data-page="accueil">
<div class="intro" id="intro" aria-hidden="true">
  <pre class="boot" id="boot"></pre>
</div>
${side("accueil", "/")}

<main id="contenu">
  <section class="hero" id="accueil" aria-labelledby="heroTitle">
    <div class="aura" aria-hidden="true"></div>
    <canvas id="netmap" aria-hidden="true"></canvas>
    <div class="hero-copy">
      <p class="path">~/accueil</p>
      <h1 id="heroTitle"><span class="decode">${t.heroTitle1}</span> <em class="redact decode">${t.heroTitle2}</em></h1>
      <p class="lede">${t.heroLede}</p>
      <div class="cta">
        <a class="cmd-btn" href="${l("/projets/")}" id="runBtn"><span class="cmd-ps">$</span> <span class="cmd-text">${t.runBtn}</span><span class="caret"></span></a>
        <a class="btn ghost" href="${l("/contact/")}">${t.contactBtn}</a>
      </div>
    </div>
    <p class="map-hint" id="mapHint" aria-hidden="true">${t.mapHint}</p>
    <ul class="node-list" id="nodeList" aria-label="${t.mapAria}"></ul>
  </section>

  <section class="block" id="chiffres" aria-labelledby="statsTitle">
    <p class="path">${t.reportPath}</p>
    <h2 id="statsTitle">${t.statsTitle1}<em>${t.statsTitle2}</em></h2>
    <div class="report" id="stats" role="list"></div>
  </section>

  <section class="block" id="selection" aria-labelledby="pickTitle">
    <p class="path">${t.pickPath}</p>
    <div class="block-head">
      <h2 id="pickTitle">${t.pickTitle1}<em>${t.pickTitle2}</em></h2>
      <a class="more" href="${l("/projets/")}">${t.seeAll(PROJECTS.length)} ${svg("arrow")}</a>
    </div>
    <div class="works" id="projectList" data-ids="${HOME_PICKS.join(",")}"></div>
  </section>

  <section class="block" id="sommaire" aria-labelledby="dirTitle">
    <p class="path">${t.dirPath}</p>
    <h2 id="dirTitle">${t.dirTitle1}<em>${t.dirTitle2}</em></h2>
    <ul class="dirlist">
      <li><a href="${l("/projets/")}" class="reveal"><span class="perm">drwxr-xr-x</span><b>projets/</b><span class="dir-d">${t.dirProjets(PROJECTS.length)}</span><span class="dir-n">${t.dirEntries(PROJECTS.length)}</span></a></li>
      <li><a href="${l("/services/")}" class="reveal" style="--d:.06s"><span class="perm">drwxr-xr-x</span><b>services/</b><span class="dir-d">${t.dirServices}</span><span class="dir-n">${t.dirServicesN(SERVICES.length)}</span></a></li>
      <li><a href="${l("/a-propos/")}" class="reveal" style="--d:.12s"><span class="perm">drwxr-xr-x</span><b>a-propos/</b><span class="dir-d">${t.dirAbout}</span><span class="dir-n">${t.dirAboutN(TIMELINE.length)}</span></a></li>
      <li><a href="${l("/contact/")}" class="reveal" style="--d:.18s"><span class="perm">-rw-r--r--</span><b>contact</b><span class="dir-d">${t.dirContact}</span><span class="dir-n">${t.dirOpen}</span></a></li>
    </ul>
  </section>
</main>
${foot()}`);

  /* =================================================================== PROJETS */
  write("projets/index.html", `${head({
    logicalPath: "/projets/",
    title: t.projetsTitle,
    description: t.projetsDesc(PROJECTS.length, count("cyber"), count("ia"), count("web"), count("jeu")),
    image: "/og/projets.png",
    imageAlt: t.projetsImgAlt(PROJECTS.length),
    jsonld: [crumbs([[locale === "fr" ? "Accueil" : "Home", "/"], [locale === "fr" ? "Projets" : "Projects", "/projets/"]]), {
      "@context": "https://schema.org", "@type": "ItemList",
      itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${l(`/projets/${p.id}/`)}`, name: p.name })),
    }],
  })}
<body data-page="projets">
${side("projets", "/projets/")}

<main id="contenu">
${pageHead({
    path: "projets",
    title: t.projetsTitleH1,
    lede: t.projetsLede(PROJECTS.length, count("cyber"), count("ia"), count("web"), count("jeu")),
  })}
  <section class="block tight" aria-label="${t.filterAria}">
    <div class="block-head">
      <p class="intro-text">${t.filterLabel}</p>
      <div class="filters" role="group" aria-label="${t.filterAria}" id="filters"></div>
    </div>
    <div class="works" id="projectList"></div>
  </section>
${nextBand("services", t.nextServices)}
</main>
${foot()}`);

  /* =================================================================== PAGE PROJET */
  PROJECTS.forEach((p, i) => {
    const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    const media = p.images.length
      ? `<div class="gallery ${p.images.length > 1 ? "many" : ""}">${p.images.map((img, k) =>
          `<figure class="win"><div class="win-bar"><i></i><i></i><i></i><span>~/projets/${p.id}${p.images.length > 1 ? ` (${k + 1}/${p.images.length})` : ""}</span></div><img src="${imageUrl(img)}" alt="${locale === "fr" ? "Capture" : "Screenshot"} ${k + 1} ${locale === "fr" ? "de" : "of"} ${esc(p.name)}" ${k ? `loading="lazy"` : ""} decoding="async"></figure>`).join("")}</div>`
      : p.code ? `<figure class="win codeshot-win"><div class="win-bar"><i></i><i></i><i></i><span>terminal</span></div><pre class="codeshot">${esc(p.code).replace(/BLOCK/, '<span class="bad">BLOCK</span>')}</pre></figure>` : "";
    const repo = p.repo
      ? `<a class="btn" href="${p.repo}" target="_blank" rel="noopener">${GH} ${t.viewCode}</a>`
      : `<span class="private">${t.privateRepo}</span>`;
    const desc = `${p.tagline} ${p.summary}`;

    write(`projets/${p.id}/index.html`, `${head({
      logicalPath: `/projets/${p.id}/`,
      title: `${p.name} | Julio Dahou`,
      description: desc.length > 300 ? desc.slice(0, 297).replace(/\s+\S*$/, "") + "…" : desc,
      image: `/og/projet-${p.id}.png`,
      imageAlt: `${p.name} : ${p.tagline}`,
      type: "article",
      jsonld: [crumbs([[locale === "fr" ? "Accueil" : "Home", "/"], [locale === "fr" ? "Projets" : "Projects", "/projets/"], [p.name, `/projets/${p.id}/`]]), {
        "@context": "https://schema.org",
        "@type": p.repo ? "SoftwareSourceCode" : "CreativeWork",
        name: p.name, description: p.tagline, url: `${SITE}${l(`/projets/${p.id}/`)}`,
        image: `${SITE}/og/projet-${p.id}.png`, inLanguage: locale, keywords: p.stack.join(", "),
        author: { "@type": "Person", name: PROFILE.name, url: SITE + l("/") },
        ...(p.repo ? { codeRepository: p.repo } : {}),
      }],
    })}
<body data-page="projet" data-project="${p.id}">
${side("projets", `/projets/${p.id}/`)}

<main id="contenu">
  <article class="case" aria-labelledby="caseTitle">
    <nav class="block crumbs" aria-label="${t.breadcrumbAria}"><a href="${l("/")}">~</a>/<a href="${l("/projets/")}">projets</a>/<span aria-current="page">${p.id}</span></nav>
    <header class="block case-head">
      <div class="work-meta"><span class="id">#${String(i + 1).padStart(2, "0")}</span><span class="kind">${KINDS[p.kind]}</span></div>
      <h1 class="case-title" id="caseTitle">${esc(p.name)}</h1>
      <p class="tagline">${esc(p.tagline)}</p>
      <div class="links-row">${repo}<a class="btn ghost" href="${l("/contact/")}">${t.talk}</a></div>
    </header>
    <div class="block case-media reveal">${media}</div>
    <div class="block case-cols">
      <div class="case-text">
        <p class="case-lead">${esc(p.summary)}</p>
        ${p.body.map(tx => `<p>${esc(tx)}</p>`).join("\n        ")}
      </div>
      <aside class="case-side" aria-label="${locale === "fr" ? "Fiche technique" : "Tech sheet"}">
        <dl class="case-meta">
          <div><dt>${t.dtDomain}</dt><dd>${KINDS[p.kind]}</dd></div>
          <div><dt>${t.dtCode}</dt><dd>${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">github.com/${esc(p.repo.split("github.com/")[1])}</a>` : (locale === "fr" ? "Privé" : "Private")}</dd></div>
          <div><dt>${t.dtTech}</dt><dd class="tags">${p.stack.map(s => `<span>${esc(s)}</span>`).join("")}</dd></div>
        </dl>
        <h2>${t.keyFeatures}</h2>
        <ul class="features">${p.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      </aside>
    </div>
    <nav class="block case-nav" aria-label="${t.otherProjectsAria}">
      <a href="${l(`/projets/${prev.id}/`)}"><small>${svg("back")} ${t.previous}</small><b>${esc(prev.name)}</b></a>
      <a href="${l("/projets/")}"><small>${t.back}</small><b>${t.allProjects}</b></a>
      <a href="${l(`/projets/${next.id}/`)}"><small>${t.next} ${svg("arrow")}</small><b>${esc(next.name)}</b></a>
    </nav>
  </article>
</main>
${foot()}`);
  });

  /* =================================================================== SERVICES */
  const STEPS = locale === "fr" ? [
    ["Cadrage", "On fixe ensemble l'objectif, le périmètre et le calendrier. Pour un test d'intrusion, rien ne commence sans autorisation écrite et sans liste précise de ce qui peut être testé."],
    ["Analyse ou construction", "Reconnaissance et tests pour un audit, développement par étapes pour une application. Tu reçois des points d'avancement réguliers, pas un silence de trois semaines."],
    ["Rapport", "Chaque constat arrive avec sa gravité, la preuve qui le démontre et la correction proposée, classés du plus urgent au moins urgent. Pour un développement : le code, sa documentation et la mise en ligne."],
    ["Suivi", "Je vérifie que les correctifs ferment bien les failles signalées, ou j'accompagne les premières semaines de l'application en production."],
  ] : [
    ["Scoping", "We set the goal, scope, and timeline together. For a penetration test, nothing starts without written authorization and a precise list of what can be tested."],
    ["Analysis or build", "Recon and testing for an audit, step-by-step development for an app. You get regular progress updates, not three weeks of silence."],
    ["Report", "Every finding comes with its severity, the proof behind it, and the proposed fix, ranked from most to least urgent. For development: the code, its documentation, and the deployment."],
    ["Follow-up", "I verify the fixes actually close the reported issues, or I support the first weeks of the app in production."],
  ];

  write("services/index.html", `${head({
    logicalPath: "/services/",
    title: t.servicesTitle,
    description: t.servicesDesc,
    image: "/og/services.png",
    imageAlt: t.servicesImgAlt,
    jsonld: [crumbs([[locale === "fr" ? "Accueil" : "Home", "/"], ["Services", "/services/"]]), {
      "@context": "https://schema.org", "@type": "ProfessionalService", name: t.homeTitle,
      url: SITE + l("/services/"), areaServed: "Remote", address: PERSON.address, email: PROFILE.email, telephone: PROFILE.phone,
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: SERVICES.map(s => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })) },
    }],
  })}
<body data-page="services">
${side("services", "/services/")}

<main id="contenu">
${pageHead({
    path: "services",
    title: t.servicesTitleH1,
    lede: t.servicesLede,
  })}
  <section class="block tight" aria-labelledby="servTitle">
    <div class="block-head">
      <h2 id="servTitle" class="sr-only">Services</h2>
      <p class="intro-text">${t.servicesHint}</p>
    </div>
    <div class="console" id="console">
      <div class="console-bar"><i></i><i></i><i></i><span>services.sh</span></div>
      <div class="console-body">
        <ul class="console-cmds" id="serviceList" role="tablist" aria-label="Services"></ul>
        <div class="console-out" id="serviceOut" role="tabpanel" aria-live="polite"></div>
      </div>
    </div>
    <noscript><ul class="svc-plain">${SERVICES.map(s => `<li><b>${esc(s.title)}</b> ${esc(s.text)}</li>`).join("")}</ul></noscript>
  </section>

  <section class="block" aria-labelledby="methodTitle">
    <p class="path">~/services/${locale === "fr" ? "methode" : "method"}</p>
    <h2 id="methodTitle">${t.howTitle}</h2>
    <ol class="steps">
${STEPS.map(([tt, d], k) => `      <li class="reveal" style="--d:${k * 0.07}s"><span class="step-n">${String(k + 1).padStart(2, "0")}</span><h3>${tt}</h3><p>${d}</p></li>`).join("\n")}
    </ol>
  </section>

  <section class="block" aria-labelledby="proofTitle">
    <p class="path">~/services/${locale === "fr" ? "preuves" : "proof"}</p>
    <h2 id="proofTitle">${t.proofTitle}</h2>
    <ul class="proofs">
${t.proofs.map(([label, name, quote, id], k) => `      <li class="reveal"${k ? ` style="--d:${k * 0.06}s"` : ""}><a href="${l(`/projets/${id}/`)}"><span>${label}</span><b>${name}</b><em>${quote}</em></a></li>`).join("\n")}
    </ul>
  </section>
${nextBand("a-propos", t.nextAbout)}
</main>
${foot()}`);

  /* =================================================================== À PROPOS */
  write("a-propos/index.html", `${head({
    logicalPath: "/a-propos/",
    title: t.aboutTitle,
    description: t.aboutDesc,
    image: "/og/a-propos.png",
    imageAlt: t.aboutImgAlt,
    type: "profile",
    jsonld: [crumbs([[locale === "fr" ? "Accueil" : "Home", "/"], [locale === "fr" ? "À propos" : "About", "/a-propos/"]]), { "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: PERSON }],
  })}
<body data-page="a-propos">
${side("a-propos", "/a-propos/")}

<main id="contenu">
${pageHead({
    path: "a-propos",
    title: t.aboutTitleH1,
    lede: t.aboutLede,
  })}
  <section class="block tight bio" aria-label="${locale === "fr" ? "Présentation" : "Introduction"}">
    <div class="bio-text">
${t.bio.map(p => `      <p>${p}</p>`).join("\n")}
    </div>
    <dl class="facts reveal">
      <div><dt>${t.factBasedIn}</dt><dd>${PROFILE.city}</dd></div>
      <div><dt>${t.factLocalTime}</dt><dd><b data-clock>--:--</b> (UTC+1)</dd></div>
      <div><dt>${t.factWork}</dt><dd>${t.factWorkVal}</dd></div>
      <div><dt>${t.factEducation}</dt><dd>ESGIS ${locale === "fr" ? "Bénin" : "Benin"}, Epitech ${locale === "fr" ? "Bénin" : "Benin"}</dd></div>
      <div><dt>${t.factLanguages}</dt><dd>${STACK[0].items.slice(0, 3).join(", ")}</dd></div>
      <div><dt>${t.factCode}</dt><dd><a href="${PROFILE.github}" target="_blank" rel="noopener">github.com/${PROFILE.handle}</a></dd></div>
    </dl>
  </section>

  <section class="block" id="parcours" aria-labelledby="pathTitle">
    <p class="path">~/a-propos/${locale === "fr" ? "parcours" : "path"}</p>
    <h2 id="pathTitle">${t.pathTitle}</h2>
    <div class="timeline" id="timeline"><span class="tl-track" aria-hidden="true"><span class="tl-fill"></span></span></div>
  </section>

  <section class="block" id="competences" aria-labelledby="skillTitle">
    <p class="path">~/a-propos/${locale === "fr" ? "competences" : "skills"}</p>
    <div class="block-head">
      <h2 id="skillTitle">${t.skillTitle}</h2>
      <p class="intro-text">${t.skillHint}</p>
    </div>
    <div class="scan" id="scan"></div>
  </section>
${nextBand("contact", t.nextContact)}
</main>
${foot()}`);

  /* =================================================================== CONTACT */
  write("contact/index.html", `${head({
    logicalPath: "/contact/",
    title: t.contactTitle,
    description: t.contactDesc(PROFILE.email),
    image: "/og/contact.png",
    imageAlt: t.contactImgAlt,
    jsonld: [crumbs([[locale === "fr" ? "Accueil" : "Home", "/"], ["Contact", "/contact/"]]), { "@context": "https://schema.org", "@type": "ContactPage", mainEntity: PERSON }],
  })}
<body data-page="contact">
${side("contact", "/contact/")}

<main id="contenu">
${pageHead({
    path: "contact",
    title: t.contactTitleH1,
    lede: t.contactLede,
  })}
  <section class="block tight contact" aria-label="${locale === "fr" ? "Coordonnées" : "Contact details"}">
    <div class="handshake" id="handshake" aria-hidden="true">
      <div class="hs-row"><span>${locale === "fr" ? "toi" : "you"}</span><i class="hs-line"><b></b></i><span>julio</span><code>SYN</code></div>
      <div class="hs-row back"><span>${locale === "fr" ? "toi" : "you"}</span><i class="hs-line"><b></b></i><span>julio</span><code>SYN-ACK</code></div>
      <div class="hs-row"><span>${locale === "fr" ? "toi" : "you"}</span><i class="hs-line"><b></b></i><span>julio</span><code>ACK</code></div>
    </div>
    <a class="mail" id="mailLink" href="mailto:${PROFILE.email}">${PROFILE.email}</a>
    <div class="contact-actions">
      <a class="btn" href="mailto:${PROFILE.email}?subject=${encodeURIComponent(locale === "fr" ? "Contact depuis ton portfolio" : "Contact from your portfolio")}">${svg("mail")}${t.writeEmail}</a>
      <a class="btn ghost" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
      <a class="btn ghost" href="${PROFILE.phoneHref}">${PROFILE.phone}</a>
    </div>
  </section>

  <section class="block contact-grid" aria-label="${locale === "fr" ? "Avant d'écrire" : "Before you write"}">
    <div class="reveal">
      <h2 class="mini">${t.contactSub}</h2>
      <ul class="checklist">
${t.checklist.map(c => `        <li>${c}</li>`).join("\n")}
      </ul>
    </div>
    <dl class="facts reveal" style="--d:.08s">
      <div><dt>${t.factEmail}</dt><dd><a href="mailto:${PROFILE.email}">${PROFILE.email}</a></dd></div>
      <div><dt>${t.factPhone}</dt><dd><a href="${PROFILE.phoneHref}">${PROFILE.phone}</a></dd></div>
      <div><dt>GitHub</dt><dd><a href="${PROFILE.github}" target="_blank" rel="noopener">github.com/${PROFILE.handle}</a></dd></div>
      <div><dt>${t.factCity}</dt><dd>${PROFILE.city}</dd></div>
      <div><dt>${t.factLocalTime}</dt><dd><b data-clock>--:--</b> (UTC+1)</dd></div>
    </dl>
  </section>
</main>
${foot()}`);

  /* =================================================================== 404 */
  write("404.html", `${head({
    logicalPath: "/404.html",
    title: t.notFoundTitle,
    description: t.notFoundDesc,
    image: "/og/accueil.png",
    imageAlt: t.notFoundImgAlt,
    noindex: true,
  })}
<body data-page="404">
${side("", "/404.html")}

<main id="contenu">
${pageHead({
    path: "404",
    title: t.notFoundH1,
    lede: t.notFoundLede,
  })}
  <section class="block tight" aria-label="${locale === "fr" ? "Pages disponibles" : "Available pages"}">
    <pre class="codeshot err-shot"><span class="dim">$</span> cd <span data-missing>/cette-page</span>
<span class="bad">${t.notFoundCd}</span>
<span class="dim">$</span> ls ~/</pre>
    <ul class="dirlist">
${NAV.map(n => `      <li><a href="${n.href}"><span class="perm">drwxr-xr-x</span><b>${n.href === l("/") ? "~/" : n.href.replace(/^\/(en\/)?/, "")}</b><span class="dir-d">${n.label}</span><span class="dir-n">${svg("arrow")}</span></a></li>`).join("\n")}
    </ul>
  </section>
</main>
${foot()}`);

  return PROJECTS.length + 6; // accueil, projets, services, a-propos, contact, 404
}

let total = 0;
for (const locale of LOCALES) total += buildLocale(locale);

/* =================================================================== sitemap + robots (communs aux deux langues) */
mkdirSync(join(ROOT, "public"), { recursive: true });
writeFileSync(join(ROOT, "public/sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ALL_URLS.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}
</urlset>
`);
writeFileSync(join(ROOT, "public/robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`pages : ${total} fichiers HTML générés (fr + en), ${ALL_URLS.length} URLs indexables dans le sitemap`);

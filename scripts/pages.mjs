/* Générateur des pages du portfolio.
   Toutes les pages partagent la même tête (métadonnées de partage), la même barre latérale
   et le même pied de page ; seul le contenu change. Le texte des projets vient de src/data.js.

   Lancer : npm run pages   (exécuté aussi automatiquement par npm run build)

   Pages générées :
     index.html                 accueil
     projets/index.html         tous les projets
     projets/<id>/index.html    une page par projet
     services/index.html
     a-propos/index.html
     contact/index.html
     404.html
     public/sitemap.xml, public/robots.txt */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROFILE, PROJECTS, KINDS, TIMELINE, SERVICES, STACK, imageUrl } from "../src/data.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://jimoox.vercel.app";
const YEAR = 2026;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const count = kind => PROJECTS.filter(p => p.kind === kind).length;
const NUM = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"];
const word = n => NUM[n] ?? String(n);
const cap = s => s[0].toUpperCase() + s.slice(1);

/* ------------------------------------------------------------------ icônes */
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

/* ------------------------------------------------------------------ navigation */
const NAV = [
  { key: "accueil", href: "/", label: "Accueil", icon: "home" },
  { key: "projets", href: "/projets/", label: "Projets", icon: "works" },
  { key: "services", href: "/services/", label: "Services", icon: "shield" },
  { key: "a-propos", href: "/a-propos/", label: "À propos", icon: "user" },
  { key: "contact", href: "/contact/", label: "Contact", icon: "mail" },
];

/* ------------------------------------------------------------------ tête */
function head({ path, title, description, image, imageAlt, type = "website", noindex = false, jsonld = [], extra = "" }) {
  const url = SITE + path;
  const img = SITE + image;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(PROFILE.name)}">
${noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#050505">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Julio Dahou">
<meta property="og:locale" content="fr_FR">
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
function side(active) {
  const links = NAV.map((n, i) => {
    const on = n.key === active;
    return `      <a href="${n.href}" data-label="${n.label}"${on ? ` class="active" aria-current="page"` : ""}>${svg(n.icon)}<span class="lbl"><i>${i}</i>${n.label}</span></a>`;
  }).join("\n");
  return `<div class="progress" aria-hidden="true"><span id="progressBar"></span></div>
<div class="scanline" aria-hidden="true"></div>
<a class="skip" href="#contenu">Aller au contenu</a>

<header class="mobilebar" id="topbar">
  <button class="side-toggle" type="button" data-side-toggle aria-controls="side" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
  <a class="brand" href="/"><span class="brand-prompt">&gt;</span>julio<b>_</b>dahou</a>
</header>
<div class="side-scrim" data-side-close></div>
<aside class="side" id="side" aria-label="Menu principal">
  <div class="side-head">
    <button class="side-toggle" type="button" data-side-toggle aria-controls="side" aria-expanded="false" aria-label="Déplier le menu"><span></span><span></span><span></span></button>
    <a class="brand" href="/" aria-label="Julio Dahou, retour à l'accueil"><span class="brand-prompt">&gt;</span><span class="lbl">julio<b>_</b>dahou</span></a>
  </div>
  <p class="side-caption lbl">Pages</p>
  <nav class="side-nav" aria-label="Pages">
${links}
  </nav>
  <p class="side-caption lbl">Outils</p>
  <div class="side-tools">
    <button type="button" id="paletteBtn" data-label="Rechercher">${svg("search")}<span class="lbl">Rechercher <kbd>Ctrl K</kbd></span></button>
    <button type="button" id="termBtn" data-terminal data-label="Terminal">${svg("term")}<span class="lbl">Terminal <kbd>\`</kbd></span></button>
    <a href="${PROFILE.github}" target="_blank" rel="noopener" data-label="GitHub">${GH}<span class="lbl">GitHub</span></a>
    <a href="mailto:${PROFILE.email}" data-label="Email">${svg("mail")}<span class="lbl">Email</span></a>
  </div>
  <div class="side-foot">
    <div class="side-meter" aria-hidden="true"><span id="sideMeter"></span></div>
    <p class="lbl side-status"><span class="dot"></span>Ouvert au remote</p>
    <p class="lbl side-pct">Cotonou <b data-clock>--:--</b>, lu à <b id="stScroll">0%</b></p>
  </div>
</aside>`;
}

/* ------------------------------------------------------------------ pied de page */
function foot() {
  return `<div class="wordmark" aria-hidden="true"><span id="wordmark">Julio Dahou</span></div>
<footer class="foot">
  <nav class="foot-nav" aria-label="Pied de page">${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join("")}</nav>
  <span>© ${YEAR} Julio Dahou, conçu et codé à Cotonou</span>
</footer>

<div class="palette" id="palette" hidden>
  <div class="palette-box" role="dialog" aria-modal="true" aria-label="Palette de commandes">
    <input id="paletteInput" type="text" placeholder="Chercher un projet ou une page…" autocomplete="off" spellcheck="false" aria-controls="paletteList">
    <ul id="paletteList" role="listbox"></ul>
  </div>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

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
    <span class="next-k">Page suivante</span>
    <span class="next-t"><span class="next-path">cd ~/${key === "accueil" ? "" : key}</span><b>${n.label}</b></span>
    <span class="next-d">${text}</span>
    <span class="next-arrow">${svg("arrow")}</span>
  </a>`;
}

function write(rel, html) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const PERSON = {
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  email: "mailto:" + PROFILE.email,
  url: SITE + "/",
  image: SITE + "/og/accueil.png",
  address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" },
  sameAs: [PROFILE.github],
  knowsAbout: STACK.flatMap(s => s.items),
};
const crumbs = items => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + path })),
});

/* =================================================================== ACCUEIL */
const HOME_PICKS = ["phishing", "safe-install", "breach"];

write("index.html", `${head({
  path: "/",
  title: "Julio Dahou, cybersécurité et développement",
  description: `Portfolio de Julio Dahou, spécialiste cybersécurité et développeur à Cotonou, ouvert au remote. ${cap(word(count("cyber")))} outils de sécurité, des applications web et un jeu de hacking.`,
  image: "/og/accueil.png",
  imageAlt: "Julio Dahou : je casse des systèmes pour mieux les protéger. Carte réseau en pixel art.",
  jsonld: [{ "@context": "https://schema.org", ...PERSON }, { "@context": "https://schema.org", "@type": "WebSite", name: "Julio Dahou", url: SITE + "/", inLanguage: "fr" }],
  // les anciens liens (#projet-breach, #contact…) mènent vers les nouvelles pages
  extra: `\n<script>(function(){var h=location.hash,m=h.match(/^#projet-([\\w-]+)$/),t={"#projets":"/projets/","#services":"/services/","#competences":"/a-propos/","#parcours":"/a-propos/","#contact":"/contact/"};if(m)location.replace("/projets/"+m[1]+"/");else if(t[h])location.replace(t[h]);})();</script>`,
})}
<body data-page="accueil">
<div class="intro" id="intro" aria-hidden="true">
  <pre class="boot" id="boot"></pre>
</div>
${side("accueil")}

<main id="contenu">
  <section class="hero" id="accueil" aria-labelledby="heroTitle">
    <div class="aura" aria-hidden="true"></div>
    <canvas id="netmap" aria-hidden="true"></canvas>
    <div class="hero-copy">
      <p class="path">~/accueil</p>
      <h1 id="heroTitle"><span class="decode">Je casse des systèmes</span> <em class="redact decode">pour mieux les protéger.</em></h1>
      <p class="lede">Julio Dahou, spécialiste cybersécurité et développeur à Cotonou, ouvert au remote. Pentest, analyse SOC, C, Python et web.</p>
      <div class="cta">
        <a class="cmd-btn" href="/projets/" id="runBtn"><span class="cmd-ps">$</span> <span class="cmd-text">./voir-les-projets.sh</span><span class="caret"></span></a>
        <a class="btn ghost" href="/contact/">Me contacter</a>
      </div>
    </div>
    <p class="map-hint" id="mapHint" aria-hidden="true">Chaque nœud est un projet. Clique dessus.</p>
    <ul class="node-list" id="nodeList" aria-label="Projets sur la carte"></ul>
  </section>

  <section class="block" id="chiffres" aria-labelledby="statsTitle">
    <p class="path">~/rapport</p>
    <h2 id="statsTitle">Le travail, <em>en clair</em></h2>
    <div class="report" id="stats" role="list"></div>
  </section>

  <section class="block" id="selection" aria-labelledby="pickTitle">
    <p class="path">~/projets --selection</p>
    <div class="block-head">
      <h2 id="pickTitle">Trois projets <em>pour commencer</em></h2>
      <a class="more" href="/projets/">Voir les ${PROJECTS.length} projets ${svg("arrow")}</a>
    </div>
    <div class="works" id="projectList" data-ids="${HOME_PICKS.join(",")}"></div>
  </section>

  <section class="block" id="sommaire" aria-labelledby="dirTitle">
    <p class="path">ls -l ~/</p>
    <h2 id="dirTitle">La suite <em>du portfolio</em></h2>
    <ul class="dirlist">
      <li><a href="/projets/" class="reveal"><span class="perm">drwxr-xr-x</span><b>projets/</b><span class="dir-d">Les ${word(PROJECTS.length)} projets en détail : outils de sécurité, applications web et un jeu.</span><span class="dir-n">${PROJECTS.length} entrées</span></a></li>
      <li><a href="/services/" class="reveal" style="--d:.06s"><span class="perm">drwxr-xr-x</span><b>services/</b><span class="dir-d">Test d'intrusion, revue de code, développement web, outils sur mesure.</span><span class="dir-n">${SERVICES.length} services</span></a></li>
      <li><a href="/a-propos/" class="reveal" style="--d:.12s"><span class="perm">drwxr-xr-x</span><b>a-propos/</b><span class="dir-d">Mon parcours, ma formation et le scan complet de mes compétences.</span><span class="dir-n">${TIMELINE.length} étapes</span></a></li>
      <li><a href="/contact/" class="reveal" style="--d:.18s"><span class="perm">-rw-r--r--</span><b>contact</b><span class="dir-d">Email, téléphone et GitHub. Je réponds vite.</span><span class="dir-n">ouvert</span></a></li>
    </ul>
  </section>
</main>
${foot()}`);

/* =================================================================== PROJETS */
write("projets/index.html", `${head({
  path: "/projets/",
  title: "Projets | Julio Dahou",
  description: `${cap(word(PROJECTS.length))} projets de Julio Dahou : ${word(count("cyber"))} outils de cybersécurité en Python, ${word(count("web"))} applications web et un metroidvania de hacking jouable dans le navigateur.`,
  image: "/og/projets.png",
  imageAlt: `Les ${PROJECTS.length} projets de Julio Dahou, en pixel art.`,
  jsonld: [crumbs([["Accueil", "/"], ["Projets", "/projets/"]]), {
    "@context": "https://schema.org", "@type": "ItemList",
    itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/projets/${p.id}/`, name: p.name })),
  }],
})}
<body data-page="projets">
${side("projets")}

<main id="contenu">
${pageHead({
  path: "projets",
  title: "Ce que <em>j'ai construit</em>",
  lede: `${cap(word(PROJECTS.length))} projets, du scanner réseau au jeu vidéo : ${word(count("cyber"))} outils de cybersécurité, ${word(count("web"))} applications web et un metroidvania jouable dans le navigateur. Ouvre une fenêtre pour lire l'étude complète.`,
})}
  <section class="block tight" aria-label="Liste des projets">
    <div class="block-head">
      <p class="intro-text">Filtrer par domaine :</p>
      <div class="filters" role="group" aria-label="Filtrer les projets" id="filters"></div>
    </div>
    <div class="works" id="projectList"></div>
  </section>
${nextBand("services", "Ce que ces projets peuvent devenir pour toi : audit, revue de code, développement.")}
</main>
${foot()}`);

/* =================================================================== PAGE PROJET */
PROJECTS.forEach((p, i) => {
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const media = p.images.length
    ? `<div class="gallery ${p.images.length > 1 ? "many" : ""}">${p.images.map((img, k) =>
        `<figure class="win"><div class="win-bar"><i></i><i></i><i></i><span>~/projets/${p.id}${p.images.length > 1 ? ` (${k + 1}/${p.images.length})` : ""}</span></div><img src="${imageUrl(img)}" alt="Capture ${k + 1} de ${esc(p.name)}" ${k ? `loading="lazy"` : ""} decoding="async"></figure>`).join("")}</div>`
    : p.code ? `<figure class="win codeshot-win"><div class="win-bar"><i></i><i></i><i></i><span>terminal</span></div><pre class="codeshot">${esc(p.code).replace(/BLOCK/, '<span class="bad">BLOCK</span>')}</pre></figure>` : "";
  const repo = p.repo
    ? `<a class="btn" href="${p.repo}" target="_blank" rel="noopener">${GH} Voir le code</a>`
    : `<span class="private">Dépôt privé, démo sur demande</span>`;
  const desc = `${p.tagline} ${p.summary}`;

  write(`projets/${p.id}/index.html`, `${head({
    path: `/projets/${p.id}/`,
    title: `${p.name} | Julio Dahou`,
    description: desc.length > 300 ? desc.slice(0, 297).replace(/\s+\S*$/, "") + "…" : desc,
    image: `/og/projet-${p.id}.png`,
    imageAlt: `${p.name} : ${p.tagline}`,
    type: "article",
    jsonld: [crumbs([["Accueil", "/"], ["Projets", "/projets/"], [p.name, `/projets/${p.id}/`]]), {
      "@context": "https://schema.org",
      "@type": p.repo ? "SoftwareSourceCode" : "CreativeWork",
      name: p.name, description: p.tagline, url: `${SITE}/projets/${p.id}/`,
      image: `${SITE}/og/projet-${p.id}.png`, inLanguage: "fr", keywords: p.stack.join(", "),
      author: { "@type": "Person", name: PROFILE.name, url: SITE + "/" },
      ...(p.repo ? { codeRepository: p.repo } : {}),
    }],
  })}
<body data-page="projet" data-project="${p.id}">
${side("projets")}

<main id="contenu">
  <article class="case" aria-labelledby="caseTitle">
    <nav class="block crumbs" aria-label="Fil d'Ariane"><a href="/">~</a>/<a href="/projets/">projets</a>/<span aria-current="page">${p.id}</span></nav>
    <header class="block case-head">
      <div class="work-meta"><span class="id">#${String(i + 1).padStart(2, "0")}</span><span class="kind">${KINDS[p.kind]}</span></div>
      <h1 class="case-title" id="caseTitle">${esc(p.name)}</h1>
      <p class="tagline">${esc(p.tagline)}</p>
      <div class="links-row">${repo}<a class="btn ghost" href="/contact/">En parler</a></div>
    </header>
    <div class="block case-media reveal">${media}</div>
    <div class="block case-cols">
      <div class="case-text">
        <p class="case-lead">${esc(p.summary)}</p>
        ${p.body.map(t => `<p>${esc(t)}</p>`).join("\n        ")}
      </div>
      <aside class="case-side" aria-label="Fiche technique">
        <dl class="case-meta">
          <div><dt>Domaine</dt><dd>${KINDS[p.kind]}</dd></div>
          <div><dt>Code</dt><dd>${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">github.com/${esc(p.repo.split("github.com/")[1])}</a>` : "Privé"}</dd></div>
          <div><dt>Technologies</dt><dd class="tags">${p.stack.map(s => `<span>${esc(s)}</span>`).join("")}</dd></div>
        </dl>
        <h2>Points clés</h2>
        <ul class="features">${p.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      </aside>
    </div>
    <nav class="block case-nav" aria-label="Autres projets">
      <a href="/projets/${prev.id}/"><small>${svg("back")} Précédent</small><b>${esc(prev.name)}</b></a>
      <a href="/projets/"><small>Retour</small><b>Tous les projets</b></a>
      <a href="/projets/${next.id}/"><small>Suivant ${svg("arrow")}</small><b>${esc(next.name)}</b></a>
    </nav>
  </article>
</main>
${foot()}`);
});

/* =================================================================== SERVICES */
const STEPS = [
  ["Cadrage", "On fixe ensemble l'objectif, le périmètre et le calendrier. Pour un test d'intrusion, rien ne commence sans autorisation écrite et sans liste précise de ce qui peut être testé."],
  ["Analyse ou construction", "Reconnaissance et tests pour un audit, développement par étapes pour une application. Tu reçois des points d'avancement réguliers, pas un silence de trois semaines."],
  ["Rapport", "Chaque constat arrive avec sa gravité, la preuve qui le démontre et la correction proposée, classés du plus urgent au moins urgent. Pour un développement : le code, sa documentation et la mise en ligne."],
  ["Suivi", "Je vérifie que les correctifs ferment bien les failles signalées, ou j'accompagne les premières semaines de l'application en production."],
];

write("services/index.html", `${head({
  path: "/services/",
  title: "Services | Julio Dahou",
  description: "Test d'intrusion, revue de sécurité du code, développement web sécurisé, outils Python sur mesure et sensibilisation au phishing. Julio Dahou, Cotonou, en remote ou sur place.",
  image: "/og/services.png",
  imageAlt: "Services de Julio Dahou : test d'intrusion, revue de code, développement web.",
  jsonld: [crumbs([["Accueil", "/"], ["Services", "/services/"]]), {
    "@context": "https://schema.org", "@type": "ProfessionalService", name: "Julio Dahou, cybersécurité et développement",
    url: SITE + "/services/", areaServed: "Remote", address: PERSON.address, email: PROFILE.email, telephone: PROFILE.phone,
    hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: SERVICES.map(s => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })) },
  }],
})}
<body data-page="services">
${side("services")}

<main id="contenu">
${pageHead({
  path: "services",
  title: "Ce que je <em>peux faire pour toi</em>",
  lede: "Auditer une application qui existe déjà, en construire une nouvelle qui tient la route, ou écrire les outils qui automatisent le travail de sécurité. Je travaille depuis Cotonou, en remote ou sur place.",
})}
  <section class="block tight" aria-labelledby="servTitle">
    <div class="block-head">
      <h2 id="servTitle" class="sr-only">Les services</h2>
      <p class="intro-text">Choisis une commande : la console te répond.</p>
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
    <p class="path">~/services/methode</p>
    <h2 id="methodTitle">Comment <em>je travaille</em></h2>
    <ol class="steps">
${STEPS.map(([t, d], k) => `      <li class="reveal" style="--d:${k * 0.07}s"><span class="step-n">${String(k + 1).padStart(2, "0")}</span><h3>${t}</h3><p>${d}</p></li>`).join("\n")}
    </ol>
  </section>

  <section class="block" aria-labelledby="proofTitle">
    <p class="path">~/services/preuves</p>
    <h2 id="proofTitle">Ce que <em>ça donne en vrai</em></h2>
    <ul class="proofs">
      <li class="reveal"><a href="/projets/phishing/"><span>Analyse de menaces</span><b>Phishing &amp; Threat Detector</b><em>Un score de risque et un rapport HTML qui ne peut pas piéger l'analyste qui l'ouvre.</em></a></li>
      <li class="reveal" style="--d:.06s"><a href="/projets/safe-install/"><span>Sécurité de la chaîne d'approvisionnement</span><b>safe-install</b><em>Un paquet npm ou PyPI piégé est bloqué avant de s'installer.</em></a></li>
      <li class="reveal" style="--d:.12s"><a href="/projets/synergy/"><span>Développement web sécurisé</span><b>SynergyCraft</b><em>Les règles d'accès vivent dans la base de données, le paiement est vérifié par signature.</em></a></li>
    </ul>
  </section>
${nextBand("a-propos", "Qui est derrière ces services : formation, parcours et compétences.")}
</main>
${foot()}`);

/* =================================================================== À PROPOS */
write("a-propos/index.html", `${head({
  path: "/a-propos/",
  title: "À propos | Julio Dahou",
  description: "Julio Dahou, étudiant en cybersécurité et expertise informatique (ESGIS Bénin et Epitech Bénin) à Cotonou. Parcours, formation et compétences : C, Python, pentest, analyse SOC, web.",
  image: "/og/a-propos.png",
  imageAlt: "À propos de Julio Dahou : parcours et compétences.",
  type: "profile",
  jsonld: [crumbs([["Accueil", "/"], ["À propos", "/a-propos/"]]), { "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: PERSON }],
})}
<body data-page="a-propos">
${side("a-propos")}

<main id="contenu">
${pageHead({
  path: "a-propos",
  title: "Derrière <em>le terminal</em>",
  lede: "Julio Dahou, étudiant en cybersécurité et expertise informatique à Cotonou. J'apprends à attaquer les systèmes pour savoir les défendre, et je construis les outils dont j'ai besoin en chemin.",
})}
  <section class="block tight bio" aria-label="Présentation">
    <div class="bio-text">
      <p>Tout a commencé par l'électronique : un baccalauréat F2 au Lycée Don Bosco, des circuits et des systèmes industriels. Comprendre une machine de l'intérieur m'a mené vers l'informatique, puis vers sa sécurité.</p>
      <p>En stage chez Accompli Technologie et Services, à Cotonou, j'ai maintenu un parc informatique, géré des réseaux et monté des projets embarqués sur Arduino. Aujourd'hui je me forme à la sécurité offensive, aux systèmes et à la programmation en C à ESGIS Bénin et Epitech Bénin.</p>
      <p>Mes projets suivent une même logique. Chaque outil part d'une attaque réelle : phishing, paquet piégé, reconnaissance réseau. Et chaque application que je construis applique ce que ces outils m'ont appris : entrées validées, rapports échappés, règles d'accès gravées dans la base de données.</p>
    </div>
    <dl class="facts reveal">
      <div><dt>Basé à</dt><dd>Cotonou, Bénin</dd></div>
      <div><dt>Heure locale</dt><dd><b data-clock>--:--</b> (UTC+1)</dd></div>
      <div><dt>Travail</dt><dd>Remote ou sur place</dd></div>
      <div><dt>Formation</dt><dd>ESGIS Bénin, Epitech Bénin</dd></div>
      <div><dt>Langages</dt><dd>${STACK[0].items.slice(0, 3).join(", ")}</dd></div>
      <div><dt>Code</dt><dd><a href="${PROFILE.github}" target="_blank" rel="noopener">github.com/${PROFILE.handle}</a></dd></div>
    </dl>
  </section>

  <section class="block" id="parcours" aria-labelledby="pathTitle">
    <p class="path">~/a-propos/parcours</p>
    <h2 id="pathTitle">D'où <em>je viens</em></h2>
    <div class="timeline" id="timeline"><span class="tl-track" aria-hidden="true"><span class="tl-fill"></span></span></div>
  </section>

  <section class="block" id="competences" aria-labelledby="skillTitle">
    <p class="path">~/a-propos/competences</p>
    <div class="block-head">
      <h2 id="skillTitle">Scan de <em>mes compétences</em></h2>
      <p class="intro-text">Tous les ports sont ouverts. Survole une ligne.</p>
    </div>
    <div class="scan" id="scan"></div>
  </section>
${nextBand("contact", "Un audit, un projet, un stage : établissons la connexion.")}
</main>
${foot()}`);

/* =================================================================== CONTACT */
write("contact/index.html", `${head({
  path: "/contact/",
  title: "Contact | Julio Dahou",
  description: `Écrire à Julio Dahou pour un audit, un projet web ou un stage : ${PROFILE.email}. Basé à Cotonou, ouvert au remote.`,
  image: "/og/contact.png",
  imageAlt: "Contacter Julio Dahou.",
  jsonld: [crumbs([["Accueil", "/"], ["Contact", "/contact/"]]), { "@context": "https://schema.org", "@type": "ContactPage", mainEntity: PERSON }],
})}
<body data-page="contact">
${side("contact")}

<main id="contenu">
${pageHead({
  path: "contact",
  title: "Établissons <em>la connexion</em>",
  lede: "Un audit, un projet, un stage ou une simple question : écris-moi, je réponds vite.",
})}
  <section class="block tight contact" aria-label="Coordonnées">
    <div class="handshake" id="handshake" aria-hidden="true">
      <div class="hs-row"><span>toi</span><i class="hs-line"><b></b></i><span>julio</span><code>SYN</code></div>
      <div class="hs-row back"><span>toi</span><i class="hs-line"><b></b></i><span>julio</span><code>SYN-ACK</code></div>
      <div class="hs-row"><span>toi</span><i class="hs-line"><b></b></i><span>julio</span><code>ACK</code></div>
    </div>
    <a class="mail" id="mailLink" href="mailto:${PROFILE.email}">${PROFILE.email}</a>
    <div class="contact-actions">
      <button class="btn" id="copyMail" type="button">Copier l'adresse</button>
      <a class="btn ghost" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
      <a class="btn ghost" href="${PROFILE.phoneHref}">${PROFILE.phone}</a>
    </div>
  </section>

  <section class="block contact-grid" aria-label="Avant d'écrire">
    <div class="reveal">
      <h2 class="mini">Pour une réponse rapide, précise</h2>
      <ul class="checklist">
        <li>Ce que tu veux : un audit, une application, un outil, un stage</li>
        <li>Le contexte : site, API, réseau ou application à construire</li>
        <li>Le délai que tu vises</li>
        <li>Pour un test d'intrusion : le périmètre que tu es en droit de faire tester</li>
      </ul>
    </div>
    <dl class="facts reveal" style="--d:.08s">
      <div><dt>Email</dt><dd><a href="mailto:${PROFILE.email}">${PROFILE.email}</a></dd></div>
      <div><dt>Téléphone</dt><dd><a href="${PROFILE.phoneHref}">${PROFILE.phone}</a></dd></div>
      <div><dt>GitHub</dt><dd><a href="${PROFILE.github}" target="_blank" rel="noopener">github.com/${PROFILE.handle}</a></dd></div>
      <div><dt>Ville</dt><dd>Cotonou, Bénin</dd></div>
      <div><dt>Heure locale</dt><dd><b data-clock>--:--</b> (UTC+1)</dd></div>
    </dl>
  </section>
</main>
${foot()}`);

/* =================================================================== 404 */
write("404.html", `${head({
  path: "/404.html",
  title: "Page introuvable | Julio Dahou",
  description: "Cette page n'existe pas. Retour au portfolio de Julio Dahou.",
  image: "/og/accueil.png",
  imageAlt: "Julio Dahou, cybersécurité et développement.",
  noindex: true,
})}
<body data-page="404">
${side("")}

<main id="contenu">
${pageHead({
  path: "404",
  title: "Cette page <em>n'existe pas</em>",
  lede: "Le lien est peut-être ancien, ou mal recopié. Tout le reste est à sa place :",
})}
  <section class="block tight" aria-label="Pages disponibles">
    <pre class="codeshot err-shot"><span class="dim">$</span> cd <span data-missing>/cette-page</span>
<span class="bad">cd: aucun fichier ou dossier de ce nom</span>
<span class="dim">$</span> ls ~/</pre>
    <ul class="dirlist">
${NAV.map(n => `      <li><a href="${n.href}"><span class="perm">drwxr-xr-x</span><b>${n.href === "/" ? "~/" : n.href.slice(1)}</b><span class="dir-d">${n.label}</span><span class="dir-n">${svg("arrow")}</span></a></li>`).join("\n")}
    </ul>
  </section>
</main>
${foot()}`);

/* =================================================================== sitemap + robots */
const urls = ["/", "/projets/", ...PROJECTS.map(p => `/projets/${p.id}/`), "/services/", "/a-propos/", "/contact/"];
write("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}
</urlset>
`);
write("public/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`pages : ${urls.length + 1} fichiers HTML générés`);

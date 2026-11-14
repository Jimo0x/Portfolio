/* Liste des projets (filtres + aperçu qui suit le curseur) et page projet (#projet-<id>). */

import { PROJECTS, KINDS, imageUrl } from "./data.js";

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ARROW = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const GH_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>`;

export function initProjects() {
  renderFilters();
  renderList();
  initSheet();
}

/* ---------------- filtres ---------------- */
function renderFilters() {
  const counts = { all: PROJECTS.length };
  PROJECTS.forEach(p => (counts[p.kind] = (counts[p.kind] || 0) + 1));
  const opts = [["all", "Tous"], ...Object.entries(KINDS).filter(([k]) => counts[k])];
  const box = $("filters");
  box.innerHTML = opts.map(([k, label], i) =>
    `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${label}<sup>${counts[k]}</sup></button>`).join("");
  box.addEventListener("click", e => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    box.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    const f = b.dataset.filter;
    const rows = [...document.querySelectorAll(".work")];
    // FLIP : les tuiles restantes glissent à leur nouvelle place
    const before = new Map(rows.map(r => { const b = r.getBoundingClientRect(); return [r, { x: b.left, y: b.top, shown: !r.hidden }]; }));
    $("projectList").classList.toggle("filtered", f !== "all");
    rows.forEach(r => (r.hidden = f !== "all" && r.dataset.kind !== f));
    rows.filter(r => !r.hidden).forEach((r, i) => {
      const b = r.getBoundingClientRect(), old = before.get(r);
      const from = old.shown ? `translate(${old.x - b.left}px, ${old.y - b.top}px)` : "translateY(30px) scale(.96)";
      r.animate([{ transform: from, opacity: old.shown ? 1 : 0 }, { transform: "none", opacity: 1 }],
        { duration: 600, easing: "cubic-bezier(.22,1,.36,1)", delay: i * 40 });
    });
  });
}

/* ---------------- projets : captures dans des fenêtres ---------------- */
function windowView(p) {
  if (p.images[0]) return `<img src="${imageUrl(p.images[0])}" alt="Capture de ${esc(p.name)}" loading="lazy">`;
  return `<pre>${esc(p.code || p.name).replace(/BLOCK/, "<b>BLOCK</b>")}</pre>`;
}

function renderList() {
  $("projectList").innerHTML = PROJECTS.map((p, i) => `
    <article class="work reveal ${i === 0 ? "featured" : ""}" data-kind="${p.kind}" data-id="${p.id}" style="--d:${(i % 2) * 0.08}s">
      <a class="cover" href="#projet-${p.id}" aria-label="Voir le projet ${esc(p.name)}"></a>
      <div class="window"><div class="win">
        <div class="win-bar"><i></i><i></i><i></i><span>~/projets/${p.id}</span></div>
        <div class="win-view">${windowView(p)}</div>
      </div></div>
      <div class="work-info">
        <div class="work-meta"><span class="id">#${String(i + 1).padStart(2, "0")}</span><span class="kind">${KINDS[p.kind]}</span></div>
        <h3>${esc(p.name)}<span class="arrow" aria-hidden="true">${ARROW}</span></h3>
        <p>${esc(i === 0 ? p.summary : p.tagline)}</p>
        <div class="stack">${p.stack.slice(0, 5).map(t => `<span>${esc(t)}</span>`).join("")}</div>
      </div>
    </article>`).join("");
  initTilt();
}

/* La fenêtre s'incline légèrement vers le curseur. */
function initTilt() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches) return;
  document.querySelectorAll(".work").forEach(w => {
    const win = w.querySelector(".win");
    w.addEventListener("pointermove", e => {
      const r = win.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      win.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
      win.style.setProperty("--rx", (-y * 6).toFixed(2) + "deg");
    });
    w.addEventListener("pointerleave", () => { win.style.setProperty("--ry", "0deg"); win.style.setProperty("--rx", "0deg"); });
  });
}

/* ---------------- page projet ---------------- */
let lastFocus = null;

function sheetHTML(p) {
  const i = PROJECTS.indexOf(p);
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const media = p.images.length
    ? `<div class="gallery ${p.images.length > 1 ? "many" : ""}">${p.images.map((img, k) =>
        `<img src="${imageUrl(img)}" alt="Capture ${k + 1} de ${esc(p.name)}" loading="lazy">`).join("")}</div>`
    : p.code ? `<pre class="codeshot">${esc(p.code).replace(/BLOCK/, '<span class="bad">BLOCK</span>')}</pre>` : "";
  const repo = p.repo
    ? `<a class="btn primary" href="${p.repo}" target="_blank" rel="noopener">${GH_ICON} Voir le code</a>`
    : `<span class="private">Dépôt privé, démo sur demande</span>`;
  return `
    <p class="kind">${KINDS[p.kind]}</p>
    <h2 id="sheetTitle">${esc(p.name)}</h2>
    <p class="tagline">${esc(p.tagline)}</p>
    <div class="links-row">${repo}<a class="btn" href="#contact" data-close-to="contact">En parler</a></div>
    ${media}
    <div class="sheet-cols">
      <div>${p.body.map(t => `<p>${esc(t)}</p>`).join("")}</div>
      <div>
        <h3>Points clés</h3>
        <ul class="features">${p.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
        <h3>Technologies</h3>
        <div class="tags">${p.stack.map(s => `<span>${esc(s)}</span>`).join("")}</div>
      </div>
    </div>
    <nav class="sheet-nav" aria-label="Autres projets">
      <a href="#projet-${prev.id}"><small>Précédent</small><b>${esc(prev.name)}</b></a>
      <a href="#projet-${next.id}"><small>Suivant</small><b>${esc(next.name)}</b></a>
    </nav>`;
}

export function openProject(id) {
  if (location.hash !== "#projet-" + id) location.hash = "projet-" + id; // le routeur fait le reste
  else showSheet(id);
}

function showSheet(id) {
  const p = PROJECTS.find(q => q.id === id);
  if (!p) return;
  const sheet = $("sheet"), panel = sheet.querySelector(".sheet-panel");
  if (sheet.hidden) lastFocus = document.activeElement;
  $("sheetBody").innerHTML = sheetHTML(p);
  sheet.classList.remove("closing");
  sheet.hidden = false;
  document.body.style.overflow = "hidden";
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
  document.title = `${p.name}, Julio Dahou`;
}

function hideSheet(after) {
  const sheet = $("sheet");
  if (sheet.hidden) return;
  sheet.classList.add("closing");
  setTimeout(() => {
    sheet.hidden = true; sheet.classList.remove("closing");
    document.body.style.overflow = "";
    document.title = "Julio Dahou, cybersécurité et développement";
    if (after) document.getElementById(after)?.scrollIntoView({ behavior: "smooth" });
    else lastFocus?.focus?.({ preventScroll: true });
  }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320);
}

function closeSheet(after) {
  if (location.hash.startsWith("#projet-")) history.pushState(null, "", location.pathname + location.search);
  hideSheet(after);
}

function route() {
  const m = location.hash.match(/^#projet-([\w-]+)$/);
  if (m) showSheet(m[1]); else hideSheet();
}

function initSheet() {
  const sheet = $("sheet");
  sheet.addEventListener("click", e => {
    const to = e.target.closest("[data-close-to]");
    if (to) { e.preventDefault(); closeSheet(to.dataset.closeTo); return; }
    if (e.target.closest("[data-close]")) closeSheet();
  });
  document.addEventListener("keydown", e => {
    if (sheet.hidden) return;
    if (e.key === "Escape") closeSheet();
    if (e.key === "Tab") { // garde le focus dans la feuille
      const f = [...sheet.querySelectorAll("a[href], button")].filter(el => el.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  route();
}

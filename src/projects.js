/* Liste des projets (filtres, fenêtres inclinées). Chaque projet a sa propre page : /projets/<id>/. */

import { PROJECTS, KINDS, imageUrl } from "./data.js";

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ARROW = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

export function initProjects() {
  if ($("filters")) renderFilters();
  renderList();
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
  const box = $("projectList");
  // l'accueil n'affiche qu'une sélection (data-ids), la page Projets affiche tout
  const ids = box.dataset.ids?.split(",");
  const list = ids ? ids.map(id => PROJECTS.find(p => p.id === id)).filter(Boolean) : PROJECTS;
  box.innerHTML = list.map((p, k) => { const i = PROJECTS.indexOf(p); return `
    <article class="work reveal ${k === 0 ? "featured" : ""}" data-kind="${p.kind}" data-id="${p.id}" style="--d:${(k % 2) * 0.08}s">
      <a class="cover" href="/projets/${p.id}/" aria-label="Voir le projet ${esc(p.name)}"></a>
      <div class="window"><div class="win">
        <div class="win-bar"><i></i><i></i><i></i><span>~/projets/${p.id}</span></div>
        <div class="win-view">${windowView(p)}</div>
      </div></div>
      <div class="work-info">
        <div class="work-meta"><span class="id">#${String(i + 1).padStart(2, "0")}</span><span class="kind">${KINDS[p.kind]}</span></div>
        <h3>${esc(p.name)}<span class="arrow" aria-hidden="true">${ARROW}</span></h3>
        <p>${esc(k === 0 ? p.summary : p.tagline)}</p>
        <div class="stack">${p.stack.slice(0, 5).map(t => `<span>${esc(t)}</span>`).join("")}</div>
      </div>
    </article>`; }).join("");
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

/* ---------------- pages projet ---------------- */
export const projectUrl = id => `/projets/${id}/`;
export function openProject(id) {
  if (PROJECTS.some(p => p.id === id)) location.href = projectUrl(id);
}

/* Effets et petites interactions : décodage du titre, apparitions, barre de navigation,
   parcours tracé au scroll, copie de l'email, raccourcis. */

import { TIMELINE, STACK, PROFILE, STATS, SERVICES } from "./data.js";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* Le titre se « déchiffre » de gauche à droite au chargement, morceau par morceau. */
export async function decodeTitle(root) {
  if (REDUCED || !root) return;
  root.setAttribute("aria-label", root.textContent.trim());
  for (const el of root.querySelectorAll(".decode")) await decode(el);
}
function decode(el) {
  const final = el.textContent;
  const glyphs = "!<>-_\\/[]{}=+*^?#01";
  const start = performance.now(), dur = 40 * final.length + 300;
  return new Promise(resolve => {
    const frame = now => {
      const p = Math.min(1, (now - start) / dur);
      const solved = Math.floor(final.length * p);
      let html = esc(final.slice(0, solved));
      for (let i = solved; i < Math.min(final.length, solved + 10); i++)
        html += final[i] === " " ? " " : `<span class="glyph">${glyphs[(Math.random() * glyphs.length) | 0]}</span>`;
      el.innerHTML = html;
      if (p < 1) requestAnimationFrame(frame); else { el.textContent = final; resolve(); }
    };
    requestAnimationFrame(frame);
  });
}

export function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (REDUCED || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach(e => io.observe(e));
}

export function initNav() {
  const bar = document.getElementById("topbar");
  const onScroll = () => bar.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const links = [...document.querySelectorAll("#rail a")];
  const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const update = () => {
    const y = innerHeight * 0.4;
    let active = links[0];
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top < y) active = links[i]; });
    links.forEach(a => a.classList.toggle("active", a === active));
  };
  addEventListener("scroll", update, { passive: true }); update();
}

/* Chiffres clés : comptent jusqu'à leur valeur quand ils entrent à l'écran. */
export function renderStats() {
  const box = document.getElementById("stats");
  box.innerHTML = STATS.map((s, i) => `
    <div class="stat reveal" style="--d:${i * 0.08}s"><b data-to="${s.value}" data-suffix="${s.suffix}">${REDUCED ? s.value + s.suffix : "0"}</b><span>${esc(s.label)}</span></div>`).join("");
  if (REDUCED) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const b = e.target.querySelector("b"), to = +b.dataset.to, suf = b.dataset.suffix;
    const start = performance.now(), dur = 1400 + to * 6;
    const frame = now => {
      const p = Math.min(1, (now - start) / dur), k = 1 - Math.pow(1 - p, 4);
      b.textContent = Math.round(to * k) + suf;
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }), { threshold: 0.6 });
  box.querySelectorAll(".stat").forEach(s => io.observe(s));
}

/* Services : carrousel une carte à la fois. */
const ICONS = [
  '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/><circle cx="12" cy="12" r="1.6"/>',
  '<rect x="3" y="4" width="18" height="14"/><path d="M3 8h18M8 21h8"/>',
  '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  '<path d="M4 6h16v10H8l-4 4z"/><path d="M8 10h8M8 13h5"/>',
];
export function initServices() {
  const stage = document.getElementById("slideStage"), count = document.getElementById("slideCount");
  const dots = document.createElement("div"); dots.className = "slide-dots";
  dots.innerHTML = SERVICES.map(() => "<i></i>").join("");
  document.getElementById("slider").appendChild(dots);
  let i = 0, timer = 0;
  const pad = n => String(n).padStart(2, "0");
  const show = (n, dir = 1) => {
    i = (n + SERVICES.length) % SERVICES.length;
    const s = SERVICES[i];
    const old = stage.querySelector(".slide:not(.leave)");
    if (old) { old.classList.add("leave"); setTimeout(() => old.remove(), 500); }
    const el = document.createElement("div");
    el.className = "slide enter";
    if (dir < 0) el.style.animationDirection = "normal";
    el.innerHTML = `<div class="slide-top"><span class="slide-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[i % ICONS.length]}</svg></span><span class="slide-num">${pad(i + 1)} / ${pad(SERVICES.length)}</span></div>
      <h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>`;
    stage.appendChild(el);
    count.textContent = `${pad(i + 1)} / ${pad(SERVICES.length)}`;
    dots.querySelectorAll("i").forEach((d, k) => d.classList.toggle("on", k === i));
  };
  const auto = () => { clearInterval(timer); if (!REDUCED) timer = setInterval(() => show(i + 1), 6000); };
  document.getElementById("nextService").addEventListener("click", () => { show(i + 1); auto(); });
  document.getElementById("prevService").addEventListener("click", () => { show(i - 1, -1); auto(); });
  stage.addEventListener("pointerenter", () => clearInterval(timer));
  stage.addEventListener("pointerleave", auto);
  show(0); auto();
}

export function renderTimeline() {
  const box = document.getElementById("timeline");
  box.insertAdjacentHTML("beforeend", TIMELINE.map((t, i) => `
    <div class="tl-item reveal" style="--d:${i * 0.08}s">
      <p class="when">${esc(t.when)}</p>
      <h3>${esc(t.title)}</h3>
      <p class="place">${esc(t.place)}</p>
      <p>${esc(t.text)}</p>
    </div>`).join(""));
  const fill = box.querySelector(".tl-fill");
  const items = [...box.querySelectorAll(".tl-item")];
  const update = () => {
    const r = box.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    fill.style.setProperty("--p", p);
    items.forEach(it => it.classList.toggle("lit", it.getBoundingClientRect().top < innerHeight * 0.6));
  };
  addEventListener("scroll", update, { passive: true }); update();
}

export function renderStack() {
  document.getElementById("stackGrid").innerHTML = STACK.map((s, i) => `
    <div class="grp reveal" style="--d:${i * 0.06}s"><h3>${esc(s.group)}</h3><p>${s.items.map(esc).join(", ")}</p></div>`).join("");
}

let toastTimer = 0;
export function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

export async function copyEmail() {
  try { await navigator.clipboard.writeText(PROFILE.email); toast("Adresse copiée : " + PROFILE.email); }
  catch { toast("Copie impossible ici. L'adresse : " + PROFILE.email); }
}

/* ↑ ↑ ↓ ↓ ← → ← → B A */
export function onKonami(cb) {
  const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let i = 0;
  addEventListener("keydown", e => {
    i = e.key === seq[i] ? i + 1 : (e.key === seq[0] ? 1 : 0);
    if (i === seq.length) { i = 0; cb(); }
  });
}

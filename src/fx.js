/* Effets et petites interactions : décodage du titre, apparitions, barre de navigation,
   parcours tracé au scroll, copie de l'email, raccourcis. */

import { TIMELINE, STACK, PROFILE } from "./data.js";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* Le titre se « déchiffre » de gauche à droite au chargement : le seul effet non déclenché. */
export function decodeTitle(el) {
  if (REDUCED || !el) return;
  const final = el.textContent;
  const glyphs = "!<>-_\\/[]{}=+*^?#01";
  const start = performance.now(), dur = 1300;
  el.setAttribute("aria-label", final);
  const frame = now => {
    const p = Math.min(1, (now - start) / dur);
    const solved = Math.floor(final.length * p);
    let html = esc(final.slice(0, solved));
    for (let i = solved; i < Math.min(final.length, solved + 12); i++) {
      const c = final[i];
      html += c === " " ? " " : `<span class="glyph">${glyphs[(Math.random() * glyphs.length) | 0]}</span>`;
    }
    el.innerHTML = html;
    if (p < 1) requestAnimationFrame(frame); else el.textContent = final;
  };
  requestAnimationFrame(frame);
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
  const links = [...document.querySelectorAll(".links a")];
  const ink = document.querySelector(".nav-ink");
  const onScroll = () => bar.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const moveInk = a => {
    if (!a) { ink.style.opacity = 0; return; }
    ink.style.opacity = 1; ink.style.width = a.offsetWidth + "px"; ink.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  const sections = links.map(a => document.querySelector(a.getAttribute("href")));
  const io = new IntersectionObserver(() => {
    const y = innerHeight * 0.35;
    let active = null;
    sections.forEach((s, i) => { const r = s.getBoundingClientRect(); if (r.top < y && r.bottom > y) active = links[i]; });
    links.forEach(a => a.classList.toggle("active", a === active));
    moveInk(active);
  }, { threshold: [0, .2, .4, .6, .8, 1] });
  sections.forEach(s => io.observe(s));
  addEventListener("resize", () => moveInk(links.find(a => a.classList.contains("active"))));
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
    <div class="stack-col reveal" style="--d:${i * 0.06}s">
      <h3>${esc(s.group)}</h3>
      <ul>${s.items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>`).join("");
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

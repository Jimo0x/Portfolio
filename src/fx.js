/* Effets et petites interactions : décodage du titre, apparitions, barre de navigation,
   parcours tracé au scroll, copie de l'email, raccourcis. */

import { TIMELINE, STACK, PROFILE, STATS, SERVICES } from "./data.js";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* Le titre se « déchiffre » de gauche à droite au chargement, morceau par morceau. */
export async function decodeTitle(root) {
  if (!root) return;
  if (REDUCED) { root.classList.add("declassified"); return; }
  root.setAttribute("aria-label", root.textContent.trim());
  for (const el of root.querySelectorAll(".decode")) await decode(el);
  root.classList.add("declassified");
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
  const links = [...document.querySelectorAll(".side-nav a")];
  const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const pct = document.getElementById("stScroll"), meter = document.getElementById("sideMeter");
  const update = () => {
    bar?.classList.toggle("scrolled", scrollY > 30);
    const y = innerHeight * 0.4;
    let active = links[0];
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top < y) active = links[i]; });
    links.forEach(a => a.classList.toggle("active", a === active));
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    pct.textContent = Math.round(p * 100) + "%";
    meter.style.transform = `scaleX(${p})`;
  };
  addEventListener("scroll", update, { passive: true }); update();

  // heure locale de Cotonou (UTC+1)
  const clock = document.getElementById("stClock");
  const fmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Porto-Novo" });
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 15000);
}

/* Barre latérale : repliée par défaut, dépliable. Le choix est mémorisé sur grand écran. */
export function initSide() {
  const body = document.body;
  const toggles = document.querySelectorAll("[data-side-toggle]");
  const wide = () => innerWidth >= 1200;
  const set = open => {
    body.classList.toggle("side-open", open);
    toggles.forEach(t => { t.setAttribute("aria-expanded", String(open)); t.setAttribute("aria-label", open ? "Replier le menu" : "Déplier le menu"); });
    if (wide()) { try { localStorage.setItem("side", open ? "1" : "0"); } catch (e) {} }
  };
  let saved = null;
  try { saved = localStorage.getItem("side"); } catch (e) {}
  set(wide() && saved === "1");
  toggles.forEach(t => t.addEventListener("click", () => set(!body.classList.contains("side-open"))));
  document.querySelector("[data-side-close]")?.addEventListener("click", () => set(false));
  // sur petit écran, choisir une section referme le menu
  document.querySelectorAll(".side-nav a, .side-tools a, .side-tools button").forEach(a =>
    a.addEventListener("click", () => { if (!wide()) set(false); }));
  addEventListener("keydown", e => {
    if (e.key === "Escape" && body.classList.contains("side-open") && !wide()) set(false);
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
    if (!typing && e.key === "[" ) set(!body.classList.contains("side-open"));
  });
  // le carte réseau du héro dépend de la largeur : on la prévient
  body.addEventListener("transitionend", e => { if (e.propertyName === "padding-left") dispatchEvent(new Event("resize")); });
}

/* Chiffres clés : un rapport de scan, chaque ligne compte et sa barre se remplit. */
export function renderStats() {
  const box = document.getElementById("stats");
  const max = Math.max(...STATS.map(s => s.value));
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date());
  box.innerHTML = `<div class="report-head"><span>rapport généré le ${date}</span><b>4 éléments</b></div>` +
    STATS.map((s, i) => `
    <div class="r-line" role="listitem" style="--w:${Math.max(6, (s.value / max) * 100)}%">
      <span class="r-label">${esc(s.label)}</span>
      <b class="r-val" data-to="${s.value}" data-suffix="${s.suffix}">${REDUCED ? s.value + s.suffix : "0"}</b>
      <span class="r-bar"><i></i></span>
    </div>`).join("");
  const lines = box.querySelectorAll(".r-line");
  if (REDUCED) { lines.forEach(l => l.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const line = e.target, b = line.querySelector(".r-val"), to = +b.dataset.to, suf = b.dataset.suffix;
    const delay = [...lines].indexOf(line) * 160;
    setTimeout(() => {
      line.classList.add("in");
      const start = performance.now(), dur = 1300 + to * 6;
      const frame = now => {
        const p = Math.min(1, (now - start) / dur), k = 1 - Math.pow(1 - p, 4);
        b.textContent = Math.round(to * k) + suf;
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
  }), { threshold: 0.8 });
  lines.forEach(l => io.observe(l));
}

/* Services : une console. On choisit une commande, la réponse s'écrit. */
const slug = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function initServices() {
  const list = document.getElementById("serviceList"), out = document.getElementById("serviceOut");
  list.innerHTML = SERVICES.map((s, i) => `<li><button type="button" role="tab" id="svc-${i}" aria-selected="false" aria-controls="serviceOut">${slug(s.title)}</button></li>`).join("");
  const btns = [...list.querySelectorAll("button")];
  let typing = 0, auto = 0, current = -1;
  const show = i => {
    current = i;
    btns.forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    out.setAttribute("aria-labelledby", btns[i].id);
    const s = SERVICES[i];
    cancelAnimationFrame(typing);
    out.innerHTML = `<div class="cmd">$ ./services.sh --${slug(s.title)}</div><h3></h3><p></p><div class="ok"></div>`;
    const h = out.querySelector("h3"), p = out.querySelector("p"), ok = out.querySelector(".ok");
    if (REDUCED) { h.textContent = s.title; p.textContent = s.text; ok.textContent = "[ok] disponible"; return; }
    const full = s.title + "\n" + s.text;
    const start = performance.now();
    const frame = now => {
      const n = Math.min(full.length, Math.floor((now - start) / 9));
      h.textContent = full.slice(0, Math.min(n, s.title.length));
      p.textContent = n > s.title.length ? full.slice(s.title.length + 1, n) : "";
      if (n < full.length) typing = requestAnimationFrame(frame); else ok.textContent = "[ok] disponible";
    };
    typing = requestAnimationFrame(frame);
  };
  const restart = () => { clearInterval(auto); if (!REDUCED) auto = setInterval(() => show((current + 1) % SERVICES.length), 7000); };
  btns.forEach((b, i) => b.addEventListener("click", () => { show(i); restart(); }));
  list.addEventListener("keydown", e => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const n = (current + d + SERVICES.length) % SERVICES.length;
    show(n); btns[n].focus(); restart();
  });
  const con = document.getElementById("console");
  con.addEventListener("pointerenter", () => clearInterval(auto));
  con.addEventListener("pointerleave", restart);
  // la console démarre quand elle arrive à l'écran
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); show(0); restart(); } }, { threshold: 0.4 });
  io.observe(con);
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

/* Compétences : la sortie d'un scan de ports. Les numéros de port sont décoratifs. */
export function renderStack() {
  const box = document.getElementById("scan");
  let port = 1336, i = 0;
  const rows = STACK.flatMap(g => g.items.map(item => {
    port += 7 + ((item.length * 13) % 31);
    return `<tr class="row" style="--i:${i++}"><td>${port}/tcp</td><td class="open-state">ouvert</td><td class="svc">${esc(item)}</td><td class="grp">${esc(g.group.toLowerCase())}</td></tr>`;
  }));
  box.innerHTML = `<div class="scan-cmd">$ <b>scan</b> --cible julio-dahou --tous-les-ports</div>
    <table><thead><tr><th>PORT</th><th>ÉTAT</th><th>COMPÉTENCE</th><th>FAMILLE</th></tr></thead><tbody>${rows.join("")}</tbody></table>
    <div class="scan-foot">${i} ports ouverts, 0 filtré. Scan terminé.</div>`;
  if (REDUCED) { box.classList.add("in"); return; }
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { box.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 });
  io.observe(box);
}

/* Contact : la poignée de main TCP se joue quand la section arrive. */
export function initHandshake() {
  const hs = document.getElementById("handshake");
  if (!hs) return;
  if (REDUCED) { hs.classList.add("done"); return; }
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    hs.classList.add("run");
    setTimeout(() => hs.classList.add("done"), 2800);
  }, { threshold: 0.6 });
  io.observe(hs);
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

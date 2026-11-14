/* Animations « haut de gamme » : ouverture, curseur, boutons magnétiques, bandeau défilant,
   titres masqués, aura qui suit la souris, barre de progression, email qui se brouille,
   signature géante en pied de page. Tout respecte prefers-reduced-motion. */

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(pointer: fine)").matches;

/* ---------- Ouverture (une fois par session) ---------- */
export function playIntro() {
  const el = document.getElementById("intro");
  let seen = false;
  try { seen = sessionStorage.getItem("intro") === "1"; sessionStorage.setItem("intro", "1"); } catch (e) {}
  if (!el) return Promise.resolve(0);
  // pas d'ouverture quand on arrive directement sur une page projet partagée
  if (REDUCED || seen || location.hash.startsWith("#projet-")) { el.remove(); return Promise.resolve(0); }
  document.documentElement.classList.add("intro-on");
  const boot = document.getElementById("boot");
  const lines = [
    ["chargement du noyau", "ok"],
    ["montage de ~/projets", "ok"],
    ["connexion au réseau", "ok"],
    ["vérification des accès", "autorisé"],
  ];
  return new Promise(resolve => {
    let i = 0;
    const next = () => {
      if (i < lines.length) {
        const [txt, st] = lines[i++];
        boot.insertAdjacentHTML("beforeend", `<span>[ <span class="ok">${st}</span> ] ${txt}</span>\n`);
        setTimeout(next, 190);
      } else {
        boot.insertAdjacentHTML("beforeend", `<span class="big">Julio Dahou</span>`);
        setTimeout(() => { el.classList.add("leave"); resolve(400); }, 650);
        setTimeout(() => { el.remove(); document.documentElement.classList.remove("intro-on"); }, 1500);
      }
    };
    setTimeout(next, 150);
  });
}

/* ---------- Barre de progression ---------- */
export function initProgress() {
  const bar = document.getElementById("progressBar");
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", update, { passive: true }); update();
}

/* ---------- Aura du héro qui suit la souris ---------- */
export function initAura() {
  const hero = document.querySelector(".hero");
  if (!hero || !FINE || REDUCED) return;
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
    hero.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
  });
}

/* ---------- Curseur : anneau qui suit et réagit aux éléments interactifs ---------- */
export function initCursor() {
  if (!FINE || REDUCED) return;
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  ring.innerHTML = "<span></span>";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.append(ring, dot);
  const label = ring.firstElementChild;
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, visible = false;

  const refresh = t => {
    if (!t) return;
    const row = t.closest?.(".tile");
    const hot = t.closest?.("a, button, [role=option], input");
    const node = document.querySelector(".hero")?.style.cursor === "pointer";
    ring.classList.toggle("big", !!row || node);
    ring.classList.toggle("hot", !!hot && !row);
    label.textContent = row || node ? "Ouvrir" : "";
  };
  addEventListener("pointermove", e => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    if (!visible) { visible = true; rx = x; ry = y; document.body.classList.add("has-cursor"); }
    refresh(e.target);
  }, { passive: true });
  // au défilement, l'élément sous le curseur change sans que la souris bouge
  addEventListener("scroll", () => { if (visible) refresh(document.elementFromPoint(x, y)); }, { passive: true });
  document.addEventListener("pointerleave", () => { visible = false; document.body.classList.remove("has-cursor"); });
  addEventListener("pointerdown", () => ring.classList.add("press"));
  addEventListener("pointerup", () => ring.classList.remove("press"));

  const loop = () => {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ---------- Boutons magnétiques ---------- */
export function initMagnetic(selector = ".btn, .tool, .sheet-close") {
  if (!FINE || REDUCED) return;
  document.addEventListener("pointermove", e => {
    const el = e.target.closest?.(selector);
    document.querySelectorAll(".magnet").forEach(m => { if (m !== el) { m.style.transform = ""; m.classList.remove("magnet"); } });
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.classList.add("magnet");
    el.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
  }, { passive: true });
}

/* ---------- Bandeau défilant ---------- */
export function initTicker() {
  const words = ["Analyser", "Casser", "Comprendre", "Corriger", "Documenter", "Construire", "Sécuriser"];
  const row = document.getElementById("tickerA");
  if (row) {
    const chunk = words.map(w => `<span>${w}</span><i></i>`).join("");
    row.innerHTML = `<div class="ticker-track">${chunk}${chunk}${chunk}${chunk}</div>`;
  }
  if (REDUCED) return;
  // le bandeau accélère avec la vitesse de défilement
  let last = scrollY, boost = 0;
  const tracks = document.querySelectorAll(".ticker .ticker-track");
  const tick = () => {
    const v = Math.abs(scrollY - last); last = scrollY;
    boost += (Math.min(v, 60) / 60 - boost) * 0.08;
    tracks.forEach(r => r.style.setProperty("--boost", (1 + boost * 3).toFixed(2)));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Titres de section : les mots montent depuis un masque ---------- */
export function splitTitles(selector = ".block h2") {
  const els = document.querySelectorAll(selector);
  els.forEach(h => {
    h.setAttribute("aria-label", h.textContent.trim());
    let i = 0;
    const parts = [];
    h.childNodes.forEach(node => {
      const red = node.nodeName === "EM";
      node.textContent.split(/\s+/).filter(Boolean).forEach(w =>
        parts.push(`<span class="w${red ? " red" : ""}" aria-hidden="true"><span style="--i:${i++}">${w}</span></span>`));
    });
    h.innerHTML = parts.join(" ");
    h.classList.add("split");
  });
  if (REDUCED) { els.forEach(h => h.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -10% 0px" });
  els.forEach(h => io.observe(h));
}

/* ---------- Texte qui se brouille au survol (email, liens du menu) ---------- */
export function scrambleOnHover(selector) {
  if (REDUCED) return;
  const glyphs = "!<>-_\\/[]{}=+*^?#01";
  document.querySelectorAll(selector).forEach(el => {
    const final = el.textContent;
    let raf = 0;
    el.addEventListener("pointerenter", () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const frame = now => {
        const p = Math.min(1, (now - start) / 550);
        const solved = Math.floor(final.length * p);
        el.textContent = final.slice(0, solved) + [...final.slice(solved)].map(c => (c === " " || c === "@" || c === "." ? c : glyphs[(Math.random() * glyphs.length) | 0])).join("");
        if (p < 1) raf = requestAnimationFrame(frame); else el.textContent = final;
      };
      raf = requestAnimationFrame(frame);
    });
  });
}

/* ---------- Signature géante : se dévoile en arrivant en bas de page ---------- */
export function initWordmark() {
  const el = document.getElementById("wordmark");
  if (!el) return;
  const update = () => {
    // 0 quand la signature entre à l'écran, 1 tout en bas de la page
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = Math.min(1, Math.max(0, 1 - (max - scrollY) / (innerHeight * 0.55)));
    el.style.setProperty("--p", p.toFixed(3));
  };
  if (REDUCED) { el.style.setProperty("--p", 1); return; }
  addEventListener("scroll", update, { passive: true }); update();
}


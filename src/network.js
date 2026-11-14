/* Carte réseau du héro : chaque projet est un hôte relié à « julio ».
   Des paquets circulent sur les liens ; survoler un nœud l'isole, cliquer ouvre le projet. */

import { KINDS } from "./data.js";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initNetwork(canvas, projects, { onOpen, hint, list }) {
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, DPR = 1, mobile = false;
  let colors = readColors();
  let nodes = [], edges = [], packets = [];
  let hover = null, mouse = { x: -9999, y: -9999 };
  let t0 = performance.now(), running = true, raf = 0;

  // liens accessibles au clavier pour chaque nœud
  list.innerHTML = projects.map(p => `<li><a href="#projet-${p.id}">${p.name}</a></li>`).join("");

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    const v = n => s.getPropertyValue(n).trim();
    return { ink: v("--ink"), muted: v("--muted"), line: v("--line"), accent: v("--accent"), signal: v("--signal"), bg: v("--bg"), surface: v("--surface") };
  }

  // pseudo-aléatoire stable : la carte a toujours la même forme
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function layout() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height; DPR = Math.min(2, devicePixelRatio || 1);
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    mobile = W < 760;
    seed = 7;

    // sur grand écran, la carte occupe la colonne de droite sans passer sous le texte
    const textRight = mobile ? 0 : (document.querySelector(".hero-copy")?.getBoundingClientRect().right || W * 0.5);
    const cx = mobile ? W * 0.5 : (textRight + W) / 2 + 10;
    const cy = mobile ? H * 0.27 : H * 0.53;
    const rx = mobile ? W * 0.36 : Math.min((W - textRight) / 2 - 130, 330);
    const ry = mobile ? H * 0.13 : Math.min(H * 0.32, 300);

    const center = { id: "julio", label: "julio", x: cx, y: cy, r: 9, kind: "self", born: 0, phase: 0 };
    nodes = [center];
    projects.forEach((p, i) => {
      const a = -Math.PI / 2 + (i / projects.length) * Math.PI * 2 + 0.25;
      const j = 0.82 + rnd() * 0.3;
      nodes.push({
        id: p.id, label: p.name, kind: p.kind, project: p,
        x: cx + Math.cos(a) * rx * j, y: cy + Math.sin(a) * ry * j,
        r: 7, born: 0.35 + i * 0.09, phase: rnd() * 6.28,
      });
    });
    // hôtes de décor, plus discrets
    const decor = mobile ? 10 : 26;
    for (let i = 0; i < decor; i++) {
      const x = mobile ? rnd() * W : textRight + 20 + rnd() * (W - textRight - 20);
      const y = mobile ? 76 + rnd() * H * 0.3 : 80 + rnd() * (H - 140);
      nodes.push({ id: "d" + i, x, y, r: 2.2 + rnd() * 1.6, kind: "decor", born: 0.2 + rnd() * 0.9, phase: rnd() * 6.28 });
    }
    nodes.forEach(n => { n.bx = n.x; n.by = n.y; });

    edges = [];
    nodes.filter(n => n.project).forEach(n => edges.push({ a: center, b: n, main: true }));
    // chaque hôte de décor se relie à ses deux voisins les plus proches
    nodes.filter(n => n.kind === "decor").forEach(n => {
      nodes.filter(m => m !== n && m.kind !== "self")
        .map(m => [m, Math.hypot(m.bx - n.bx, m.by - n.by)])
        .sort((p, q) => p[1] - q[1]).slice(0, 2)
        .forEach(([m]) => { if (!edges.some(e => (e.a === m && e.b === n))) edges.push({ a: n, b: m, main: false }); });
    });
    packets = [];
  }

  function spawnPacket() {
    const main = edges.filter(e => e.main);
    const pool = hover && hover.project ? main.filter(e => e.b === hover) : (Math.random() < 0.7 ? main : edges);
    const e = pool[(Math.random() * pool.length) | 0];
    if (e) packets.push({ e, t: 0, dir: Math.random() < 0.5 ? 1 : -1, speed: 0.006 + Math.random() * 0.01 });
  }

  const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

  function draw(now) {
    const time = (now - t0) / 1000;
    const intro = REDUCED ? 10 : time / 1.6; // la séquence d'ouverture dure ~1,6 s
    ctx.clearRect(0, 0, W, H);

    // légère dérive + répulsion du curseur
    for (const n of nodes) {
      const drift = REDUCED || n.kind === "self" ? 0 : (n.kind === "decor" ? 5 : 3);
      let x = n.bx + Math.sin(time * 0.6 + n.phase) * drift;
      let y = n.by + Math.cos(time * 0.5 + n.phase) * drift;
      if (n.kind === "decor") {
        const d = Math.hypot(mouse.x - x, mouse.y - y);
        if (d < 120) { const k = (1 - d / 120) * 18; x -= (mouse.x - x) / d * k; y -= (mouse.y - y) / d * k; }
      }
      n.x += (x - n.x) * 0.12; n.y += (y - n.y) * 0.12;
    }

    // liens (tracés progressivement pendant l'ouverture)
    for (const e of edges) {
      const p = ease((intro - Math.max(e.a.born, e.b.born)) * 2.2);
      if (p <= 0) continue;
      const lit = hover && (e.a === hover || e.b === hover);
      const dim = hover && !lit;
      ctx.beginPath();
      ctx.moveTo(e.a.x, e.a.y);
      ctx.lineTo(e.a.x + (e.b.x - e.a.x) * p, e.a.y + (e.b.y - e.a.y) * p);
      ctx.strokeStyle = lit ? colors.signal : colors.line;
      ctx.globalAlpha = dim ? 0.25 : e.main ? 1 : 0.7;
      ctx.lineWidth = lit ? 2 : e.main ? 1.4 : 1;
      if (!e.main) ctx.setLineDash([3, 5]);
      ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;

    // paquets
    if (!REDUCED && intro > 1) {
      if (Math.random() < (hover ? 0.18 : 0.06)) spawnPacket();
      packets = packets.filter(p => (p.t += p.speed) < 1);
      for (const p of packets) {
        const t = p.dir > 0 ? p.t : 1 - p.t;
        const x = p.e.a.x + (p.e.b.x - p.e.a.x) * t, y = p.e.a.y + (p.e.b.y - p.e.a.y) * t;
        ctx.fillStyle = colors.signal;
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }

    // nœuds
    ctx.textBaseline = "middle";
    for (const n of nodes) {
      const p = ease((intro - n.born) * 3);
      if (p <= 0) continue;
      const isHover = n === hover;
      const dim = hover && !isHover && n.kind !== "self" && !edges.some(e => (e.a === hover && e.b === n) || (e.b === hover && e.a === n));
      ctx.globalAlpha = (dim ? 0.35 : 1) * p;

      if (n.kind === "decor") {
        ctx.fillStyle = colors.muted;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * p, 0, 7); ctx.fill();
        continue;
      }
      const r = (isHover ? n.r * 1.7 : n.r) * p;
      if (n.kind === "self") {
        ctx.fillStyle = colors.signal;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 7); ctx.fill();
        // onde qui part du centre
        if (!REDUCED) {
          const w = (time % 2.4) / 2.4;
          ctx.strokeStyle = colors.signal; ctx.globalAlpha = (1 - w) * 0.6 * p; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(n.x, n.y, r + w * 46, 0, 7); ctx.stroke();
        }
      } else {
        ctx.fillStyle = colors.bg;
        ctx.strokeStyle = n.kind === "web" ? colors.accent : colors.signal;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        if (n.kind === "jeu") { ctx.rect(n.x - r, n.y - r, r * 2, r * 2); }
        else ctx.arc(n.x, n.y, r, 0, 7);
        ctx.fill(); ctx.stroke();
        if (isHover) { ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(n.x, n.y, r * 0.42, 0, 7); ctx.fill(); }
      }

      // étiquette
      ctx.font = `${isHover ? 650 : 500} ${isHover ? 16 : (mobile ? 12 : 13.5)}px "Bricolage Grotesque", system-ui, sans-serif`;
      // étiquette du côté extérieur, sauf si elle sortirait de l'écran
      const lw = ctx.measureText(n.label).width;
      let right = n.x >= nodes[0].x ? 1 : -1;
      if (right > 0 && n.x + r + 10 + lw > W - 12) right = -1;
      if (right < 0 && n.x - r - 10 - lw < 12) right = 1;
      const tx = n.x + right * (r + (n.kind === "self" ? 22 : 10));
      ctx.textAlign = right > 0 ? "left" : "right";
      ctx.fillStyle = n.kind === "self" ? colors.signal : colors.ink;
      const label = n.label;
      // halo pour rester lisible sur la grille
      ctx.lineWidth = 4; ctx.strokeStyle = colors.bg; ctx.strokeText(label, tx, n.y);
      ctx.fillText(label, tx, n.y);
      if (isHover && n.project) {
        ctx.font = `400 12px "JetBrains Mono", monospace`;
        ctx.fillStyle = colors.muted;
        const sub = KINDS[n.kind];
        ctx.strokeText(sub, tx, n.y + 18); ctx.fillText(sub, tx, n.y + 18);
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    if (!running) return;
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  function pick(x, y) {
    let best = null, bd = mobile ? 34 : 26;
    for (const n of nodes) {
      if (!n.project) continue;
      const d = Math.hypot(n.x - x, n.y - y);
      if (d < bd) { bd = d; best = n; }
    }
    return best;
  }
  function local(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

  // la carte est sous le texte : on écoute sur la section entière
  const host = canvas.parentElement;
  host.addEventListener("pointermove", e => {
    mouse = local(e);
    const h = e.target.closest("a, button") ? null : pick(mouse.x, mouse.y);
    if (h !== hover) {
      hover = h;
      host.style.cursor = h ? "pointer" : "";
      if (hint) hint.style.opacity = h ? 0 : 1;
    }
  });
  host.addEventListener("pointerleave", () => { hover = null; mouse = { x: -9999, y: -9999 }; host.style.cursor = ""; });
  host.addEventListener("click", e => {
    if (e.target.closest("a, button")) return;
    const n = pick(...Object.values(local(e)));
    if (n) onOpen(n.project.id);
  });

  window.addEventListener("themechange", () => { colors = readColors(); if (REDUCED) draw(performance.now()); });
  new ResizeObserver(() => { layout(); if (!running || REDUCED) draw(performance.now()); }).observe(canvas);

  // ne consomme rien quand le héro est hors écran
  new IntersectionObserver(([en]) => {
    const vis = en.isIntersecting && !REDUCED;
    if (vis && !running) { running = true; raf = requestAnimationFrame(loop); }
    if (!vis) { running = false; cancelAnimationFrame(raf); }
  }).observe(canvas);

  layout();
  if (REDUCED) { running = false; draw(performance.now()); } else raf = requestAnimationFrame(loop);

  // les polices arrivent après : on redessine les étiquettes
  document.fonts?.ready.then(() => { colors = readColors(); if (REDUCED) draw(performance.now()); });
}

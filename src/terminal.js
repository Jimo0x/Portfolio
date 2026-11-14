/* Mode terminal : explorer le portfolio en ligne de commande.
   Ouverture : bouton du haut ou touche ` (backtick). */

import { PROJECTS, KINDS, PROFILE, STACK } from "./data.js";
import { THEMES, setTheme, currentTheme } from "./theme.js";

const L = (text, cls, href) => ({ text, cls, href });

function find(q) {
  if (!q) return null;
  return PROJECTS.find(p => p.id === q) || PROJECTS.find(p => p.name.toLowerCase().includes(q));
}

/* Interprète une commande. Renvoie des lignes ou { action, ... }. */
export function run(input) {
  const [cmd, ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();
  switch ((cmd || "").toLowerCase()) {
    case "": return [];
    case "help": case "aide":
      return [
        L("Commandes :", "accent"),
        L("  whoami            qui je suis"),
        L("  ls                lister les projets"),
        L("  cat <projet>      résumé d'un projet (ex: cat breach)"),
        L("  open <projet>     ouvrir la page du projet"),
        L("  repo <projet>     ouvrir le code sur GitHub"),
        L("  theme [nom]       changer de thème (plan, nuit, phosphore, ambre)"),
        L("  skills            compétences"),
        L("  contact           me contacter"),
        L("  goto <section>    projets, parcours, stack, contact"),
        L("  clear / exit"),
      ];
    case "whoami":
      return [L(`${PROFILE.name}, ${PROFILE.role.toLowerCase()}`, "accent"), L(`${PROFILE.city}, ouvert au remote`)];
    case "ls":
      return PROJECTS.map(p => L(`  ${p.id.padEnd(14)}${KINDS[p.kind].padEnd(16)}${p.name}`));
    case "cat": {
      const p = find(arg);
      if (!p) return [L(`cat: ${arg || "?"}: projet introuvable (tape ls)`, "err")];
      return [L(p.name, "accent"), L(p.tagline), L(p.summary, "dim"), L(`stack : ${p.stack.join(", ")}`, "dim")];
    }
    case "open": {
      const p = find(arg);
      if (!p) return [L(`open: ${arg || "?"}: projet introuvable`, "err")];
      return { action: "project", id: p.id, lines: [] };
    }
    case "repo": {
      const p = find(arg);
      if (!p) return [L(`repo: ${arg || "?"}: projet introuvable`, "err")];
      if (!p.repo) return [L(`${p.name} est un dépôt privé.`, "dim")];
      return { action: "url", url: p.repo, lines: [L(`Ouverture de ${p.repo}`, "dim")] };
    }
    case "theme": {
      if (!arg) return [L(`thème actuel : ${currentTheme()}`), L(`disponibles : ${THEMES.map(t => t.id).join(", ")}`, "dim")];
      const t = THEMES.find(x => x.id === arg || x.name.toLowerCase() === arg);
      if (!t) return [L(`theme: ${arg}: inconnu. Choix : ${THEMES.map(x => x.id).join(", ")}`, "err")];
      return { action: "theme", id: t.id, lines: [L(`Thème ${t.name} appliqué.`, "dim")] };
    }
    case "skills":
      return STACK.map(s => L(`  ${s.group.padEnd(18)}${s.items.join(", ")}`));
    case "contact":
      return [L(`  email   ${PROFILE.email}`, "link", `mailto:${PROFILE.email}`), L(`  github  ${PROFILE.github}`, "link", PROFILE.github)];
    case "goto": {
      const ok = { projets: "projets", parcours: "parcours", stack: "stack", competences: "stack", contact: "contact" };
      if (!ok[arg]) return [L(`goto: section inconnue. Choix : projets, parcours, stack, contact`, "err")];
      return { action: "goto", id: ok[arg], lines: [] };
    }
    case "clear": return { action: "clear", lines: [] };
    case "exit": case "quit": return { action: "close", lines: [] };
    case "sudo": return [L("Bien essayé. Cet incident sera signalé.", "err")];
    case "rm": return [L(/-rf/.test(arg) ? "Non." : "rm: permission refusée", "err")];
    default: return [L(`${cmd}: commande introuvable. Tape help.`, "err")];
  }
}

export function complete(input) {
  const words = ["help", "whoami", "ls", "cat", "open", "repo", "theme", "skills", "contact", "goto", "clear", "exit"];
  const parts = input.split(" ");
  const pick = (list, w) => { const m = list.filter(x => x.startsWith(w.toLowerCase())); return m.length === 1 ? m[0] : null; };
  if (parts.length === 1) { const m = pick(words, parts[0]); return m ? m + " " : input; }
  if (["cat", "open", "repo"].includes(parts[0])) { const m = pick(PROJECTS.map(p => p.id), parts[1]); return m ? `${parts[0]} ${m}` : input; }
  if (parts[0] === "theme") { const m = pick(THEMES.map(t => t.id), parts[1]); return m ? `theme ${m}` : input; }
  return input;
}

export function initTerminal({ openProject }) {
  const root = document.createElement("div");
  root.className = "term-overlay";
  root.hidden = true;
  root.innerHTML = `
    <div class="term-win" role="dialog" aria-modal="true" aria-label="Terminal du portfolio">
      <div class="term-bar"><i></i><i></i><i></i><span>julio@portfolio: ~</span>
        <button class="term-x" type="button" aria-label="Fermer">×</button></div>
      <div class="term-out" aria-live="polite"></div>
      <form class="term-line"><span class="term-ps">julio@portfolio:~$</span>
        <input class="term-in" autocomplete="off" spellcheck="false" aria-label="Commande"></form>
    </div>`;
  document.body.appendChild(root);
  const out = root.querySelector(".term-out");
  const field = root.querySelector(".term-in");
  const history = [];
  let hIndex = 0, lastFocus = null;

  function print(lines) {
    for (const l of lines) {
      const el = document.createElement(l.href ? "a" : "div");
      el.textContent = l.text;
      if (l.cls) el.className = l.cls;
      if (l.href) { el.href = l.href; el.target = "_blank"; el.rel = "noopener"; el.style.display = "block"; }
      out.appendChild(el);
    }
    out.scrollTop = out.scrollHeight;
  }
  function open() {
    if (!root.hidden) return;
    lastFocus = document.activeElement;
    root.hidden = false;
    if (!out.childElementCount) print([L("Bienvenue. Tape help pour la liste des commandes.", "accent"), L("Tab complète, ↑ ↓ parcourt l'historique, Échap ferme.", "dim")]);
    field.focus();
  }
  function close(restore = true) { root.hidden = true; if (restore) lastFocus?.focus?.(); }

  root.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    const value = field.value; field.value = "";
    if (value.trim()) { history.push(value); hIndex = history.length; }
    print([L(`$ ${value}`, "cmd")]);
    const res = run(value);
    if (Array.isArray(res)) { print(res); return; }
    print(res.lines || []);
    if (res.action === "clear") out.textContent = "";
    if (res.action === "close") close();
    if (res.action === "url") window.open(res.url, "_blank", "noopener");
    if (res.action === "theme") setTheme(res.id);
    if (res.action === "project") { close(false); openProject(res.id); }
    if (res.action === "goto") { close(false); document.getElementById(res.id)?.scrollIntoView({ behavior: "smooth" }); }
  });
  field.addEventListener("keydown", e => {
    if (e.key === "Tab") { e.preventDefault(); field.value = complete(field.value); }
    else if (e.key === "ArrowUp" && history.length) { e.preventDefault(); hIndex = Math.max(0, hIndex - 1); field.value = history[hIndex]; }
    else if (e.key === "ArrowDown" && history.length) { e.preventDefault(); hIndex = Math.min(history.length, hIndex + 1); field.value = history[hIndex] || ""; }
  });
  root.addEventListener("mousedown", e => { if (e.target === root) close(); });
  root.querySelector(".term-x").addEventListener("click", () => close());
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !root.hidden) { close(); return; }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
    if (e.key === "`" && !typing) { e.preventDefault(); root.hidden ? open() : close(); }
  });
  document.querySelectorAll("[data-terminal]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); open(); }));
  return { open, close };
}

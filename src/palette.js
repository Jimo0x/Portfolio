/* Palette de commandes (Ctrl+K) : projets, sections, thèmes et actions au clavier. */

import { PROJECTS, KINDS, PROFILE } from "./data.js";

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function initPalette({ openProject, openTerminal, copyEmail }) {
  const root = document.getElementById("palette");
  const input = document.getElementById("paletteInput");
  const list = document.getElementById("paletteList");
  let items = [], sel = 0, lastFocus = null;

  const goto = id => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const ALL = [
    ...PROJECTS.map(p => ({ label: p.name, hint: "Projet, " + KINDS[p.kind].toLowerCase(), keys: p.tagline, run: () => openProject(p.id) })),
    { label: "Projets", hint: "Section", run: goto("projets") },
    { label: "Rapport (chiffres clés)", hint: "Section", run: goto("chiffres") },
    { label: "Services", hint: "Section", run: goto("services") },
    { label: "Compétences", hint: "Section", run: goto("competences") },
    { label: "Parcours", hint: "Section", run: goto("parcours") },
    { label: "Contact", hint: "Section", run: goto("contact") },
    { label: "Copier l'adresse email", hint: PROFILE.email, keys: "mail contact", run: copyEmail },
    { label: "Ouvrir le terminal", hint: "Raccourci `", keys: "console shell", run: openTerminal },
    { label: "Profil GitHub", hint: "github.com/" + PROFILE.handle, keys: "code", run: () => window.open(PROFILE.github, "_blank", "noopener") },
  ];

  function render() {
    const q = norm(input.value.trim());
    items = q ? ALL.filter(i => norm(`${i.label} ${i.hint} ${i.keys || ""}`).includes(q)) : ALL;
    sel = Math.min(sel, Math.max(0, items.length - 1));
    list.innerHTML = items.length
      ? items.map((i, k) => `<li role="option" id="pal-${k}" aria-selected="${k === sel}" data-k="${k}"><span>${i.label}</span><small>${i.hint}</small></li>`).join("")
      : `<li class="empty">Aucun résultat pour « ${input.value.replace(/[<>&]/g, "")} ». Essaie un nom de projet ou « thème ».</li>`;
    input.setAttribute("aria-activedescendant", items.length ? "pal-" + sel : "");
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }
  function open() {
    lastFocus = document.activeElement;
    root.hidden = false; input.value = ""; sel = 0; render(); input.focus();
  }
  function close(restore = true) { root.hidden = true; if (restore) lastFocus?.focus?.(); }
  function run(k) { const it = items[k]; if (!it) return; close(false); it.run(); }

  input.addEventListener("input", () => { sel = 0; render(); });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, items.length); render(); }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + items.length) % Math.max(1, items.length); render(); }
    if (e.key === "Enter") { e.preventDefault(); run(sel); }
    if (e.key === "Escape") close();
  });
  list.addEventListener("click", e => { const li = e.target.closest("[data-k]"); if (li) run(+li.dataset.k); });
  list.addEventListener("pointermove", e => { const li = e.target.closest("[data-k]"); if (li && +li.dataset.k !== sel) { sel = +li.dataset.k; render(); } });
  root.addEventListener("mousedown", e => { if (e.target === root) close(); });
  document.getElementById("paletteBtn").addEventListener("click", open);
  document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); root.hidden ? open() : close(); }
  });
  return { open, close };
}

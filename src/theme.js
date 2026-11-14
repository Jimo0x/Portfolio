/* Thèmes : changement animé (cercle qui s'ouvre depuis le clic) et mémorisé. */

export const THEMES = [
  { id: "plan", name: "Plan", desc: "Clair, schéma d'ingénieur", bg: "#eef2f5", a: "#0f2238", b: "#e5484d" },
  { id: "nuit", name: "Nuit", desc: "Sombre, bleu glacier", bg: "#0a1322", a: "#7cc4ff", b: "#ff6b6b" },
  { id: "phosphore", name: "Phosphore", desc: "Écran CRT vert", bg: "#030805", a: "#39ff88", b: "#ffd84d" },
  { id: "ambre", name: "Ambre", desc: "Terminal ambré des années 80", bg: "#130c03", a: "#ffb000", b: "#ff5f3d" },
];

const root = document.documentElement;
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

export const currentTheme = () => root.dataset.theme || "plan";

export function setTheme(id, origin) {
  const theme = THEMES.find(t => t.id === id);
  if (!theme || id === currentTheme()) return false;
  const swap = () => {
    root.dataset.theme = id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.bg);
    try { localStorage.setItem("theme", id); } catch (e) { /* stockage indisponible : le thème reste pour la session */ }
    window.dispatchEvent(new CustomEvent("themechange", { detail: id }));
  };
  if (!document.startViewTransition || REDUCED) { swap(); return true; }

  const x = origin?.x ?? innerWidth - 40, y = origin?.y ?? 30;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(swap);
  vt.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" },
    );
  }).catch(() => {});
  return true;
}

export function cycleTheme(origin) {
  const i = THEMES.findIndex(t => t.id === currentTheme());
  const next = THEMES[(i + 1) % THEMES.length];
  setTheme(next.id, origin);
  return next;
}

export function initThemeMenu() {
  const btn = document.getElementById("themeBtn");
  const menu = document.getElementById("themeMenu");
  menu.innerHTML = THEMES.map(t => `
    <button type="button" role="menuitemradio" data-theme-id="${t.id}">
      <span class="chip" style="background:${t.bg};box-shadow:inset 0 0 0 1px ${t.a}33">
        <i style="background:${t.a};box-shadow:7px 0 0 ${t.b}"></i>
      </span>
      <span><b>${t.name}</b><small>${t.desc}</small></span>
    </button>`).join("");

  const sync = () => menu.querySelectorAll("[data-theme-id]").forEach(b =>
    b.setAttribute("aria-checked", String(b.dataset.themeId === currentTheme())));
  const open = () => { sync(); menu.hidden = false; btn.setAttribute("aria-expanded", "true"); menu.querySelector('[aria-checked="true"]')?.focus(); };
  const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };

  btn.addEventListener("click", () => (menu.hidden ? open() : close()));
  menu.addEventListener("click", e => {
    const b = e.target.closest("[data-theme-id]");
    if (!b) return;
    const r = btn.getBoundingClientRect();
    setTheme(b.dataset.themeId, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    close(); btn.focus();
  });
  menu.addEventListener("keydown", e => {
    const items = [...menu.querySelectorAll("button")];
    const i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === "Escape") { close(); btn.focus(); }
  });
  document.addEventListener("click", e => { if (!e.target.closest(".theme-pick")) close(); });
  window.addEventListener("themechange", sync);
}

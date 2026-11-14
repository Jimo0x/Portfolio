import { PROJECTS } from "./data.js";
import { initThemeMenu, cycleTheme, setTheme } from "./theme.js";
import { initNetwork } from "./network.js";
import { initProjects, openProject } from "./projects.js";
import { initPalette } from "./palette.js";
import { initTerminal } from "./terminal.js";
import { decodeTitle, initReveal, initNav, renderTimeline, renderStack, copyEmail, toast, onKonami } from "./fx.js";
import { playIntro, initProgress, initAura, initCursor, initMagnetic, initTicker, splitTitles, scrambleOnHover, initWordmark, tiltPeek } from "./motion.js";

const introDone = playIntro();

renderTimeline();
renderStack();
initProjects();
initThemeMenu();
initNav();
initTicker();
splitTitles();
initReveal();
initProgress();
initAura();
initCursor();
initMagnetic();
initWordmark();
tiltPeek();
scrambleOnHover(".mail, .links a");

const terminal = initTerminal({ openProject });
initPalette({ openProject, openTerminal: terminal.open, copyEmail });

// la carte et le titre démarrent quand le rideau d'ouverture se lève
initNetwork(document.getElementById("netmap"), PROJECTS, {
  onOpen: openProject,
  hint: document.getElementById("mapHint"),
  list: document.getElementById("nodeList"),
  delay: document.documentElement.classList.contains("intro-on") ? 1650 : 0,
});
introDone.then(() => decodeTitle(document.getElementById("heroTitle")));

document.getElementById("copyMail").addEventListener("click", copyEmail);

// T : thème suivant (hors champ de saisie)
addEventListener("keydown", e => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "t" || e.key === "T") {
    const b = document.getElementById("themeBtn").getBoundingClientRect();
    const next = cycleTheme({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
    toast("Thème " + next.name);
  }
});

onKonami(() => { setTheme("phosphore"); toast("Mode hacker activé. Tape ` pour le terminal."); });

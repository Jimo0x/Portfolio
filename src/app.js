import { PROJECTS } from "./data.js";
import { initNetwork } from "./network.js";
import { initProjects, openProject } from "./projects.js";
import { initPalette } from "./palette.js";
import { initTerminal } from "./terminal.js";
import { decodeTitle, initReveal, initNav, renderTimeline, renderStack, renderStats, initServices, initHandshake, initSide, copyEmail, toast, onKonami } from "./fx.js";
import { playIntro, initProgress, initAura, initCursor, initMagnetic, splitTitles, scrambleOnHover, initWordmark } from "./motion.js";

const introDone = playIntro();

renderStats();
renderTimeline();
renderStack();
initProjects();
initServices();
initHandshake();
initSide();
initNav();
splitTitles();
initReveal();
initProgress();
initAura();
initCursor();
initMagnetic(".btn, .cmd-btn, .side-toggle, .sheet-close");
initWordmark();
scrambleOnHover(".mail, .cmd-text");

const terminal = initTerminal({ openProject });
initPalette({ openProject, openTerminal: terminal.open, copyEmail });

// la carte et le titre démarrent quand l'écran de démarrage se lève
initNetwork(document.getElementById("netmap"), PROJECTS, {
  onOpen: openProject,
  hint: document.getElementById("mapHint"),
  list: document.getElementById("nodeList"),
  delay: document.documentElement.classList.contains("intro-on") ? 1800 : 0,
});
introDone.then(() => decodeTitle(document.getElementById("heroTitle")));

document.getElementById("copyMail").addEventListener("click", copyEmail);

onKonami(() => { terminal.open(); toast("Accès root accordé. Bienvenue."); });

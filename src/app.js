import { PROJECTS, STACK } from "./data.js";
import { initNetwork } from "./network.js";
import { initProjects, openProject } from "./projects.js";
import { initPalette } from "./palette.js";
import { initTerminal } from "./terminal.js";
import { decodeTitle, initReveal, initNav, renderTimeline, renderStack, renderStats, initServices, copyEmail, toast, onKonami } from "./fx.js";
import { playIntro, initProgress, initAura, initCursor, initMagnetic, initTicker, initSkillsMarquee, splitTitles, scrambleOnHover, initWordmark, initStars } from "./motion.js";

const introDone = playIntro();

renderStats();
renderTimeline();
renderStack();
initSkillsMarquee(STACK);
initProjects();
initServices();
initNav();
initTicker();
splitTitles();
initReveal();
initProgress();
initAura();
initStars();
initCursor();
initMagnetic();
initWordmark();
scrambleOnHover(".mail");

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

onKonami(() => { terminal.open(); toast("Accès root accordé. Bienvenue."); });

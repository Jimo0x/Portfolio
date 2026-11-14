/* Point d'entrée commun à toutes les pages. Chaque module ne démarre que si
   les éléments dont il a besoin sont présents sur la page. */

import { PROJECTS } from "./data.js";
import { initNetwork } from "./network.js";
import { initProjects, openProject } from "./projects.js";
import { initPalette } from "./palette.js";
import { initTerminal } from "./terminal.js";
import { decodeTitle, initReveal, initNav, renderTimeline, renderStack, renderStats, initServices, initHandshake, initSide, copyEmail, toast, onKonami } from "./fx.js";
import { playIntro, initProgress, initAura, initCursor, initMagnetic, splitTitles, scrambleOnHover, initWordmark } from "./motion.js";

const $ = id => document.getElementById(id);
const introDone = playIntro();

if ($("stats")) renderStats();
if ($("timeline")) renderTimeline();
if ($("scan")) renderStack();
if ($("projectList")) initProjects();
if ($("console")) initServices();
initHandshake();
initSide();
initNav();
splitTitles(".block h2:not(.mini):not(.sr-only), .page-title");
initReveal();
initProgress();
initAura();
initCursor();
initMagnetic(".btn, .cmd-btn, .side-toggle, .more");
initWordmark();
scrambleOnHover(".mail, .cmd-text");

const terminal = initTerminal({ openProject });
initPalette({ openProject, openTerminal: terminal.open, copyEmail });

const map = $("netmap");
if (map) {
  // la carte et le titre démarrent quand l'écran de démarrage se lève
  initNetwork(map, PROJECTS, {
    onOpen: openProject,
    hint: $("mapHint"),
    list: $("nodeList"),
    delay: document.documentElement.classList.contains("intro-on") ? 1800 : 0,
  });
  introDone.then(() => decodeTitle($("heroTitle")));
}

$("copyMail")?.addEventListener("click", copyEmail);

// sur la page 404, la commande affiche le chemin réellement demandé
const missing = document.querySelector("[data-missing]");
if (missing) { try { missing.textContent = decodeURI(location.pathname); } catch { missing.textContent = location.pathname; } }

onKonami(() => { terminal.open(); toast("Accès root accordé. Bienvenue."); });

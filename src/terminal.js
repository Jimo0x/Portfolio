/* Mode terminal : une console interactive pour explorer le portfolio.
   Ouverture : bouton ">_" du dock, ou touche ` (backtick) / Ctrl+K. */

const GH = "https://github.com/Jimo0x";

export const PROJECTS = [
  { id: "frixx", name: "FrixX", tag: "Marketplace", desc: "Marketplace freelance : Next.js, Supabase, PostgreSQL et politiques RLS.", repo: `${GH}/Project_Synergy` },
  { id: "phishing", name: "Phishing & Threat Detector", tag: "SOC", desc: "Score de risque d'URL, de fichiers et d'images suspects, avec rapport HTML.", repo: `${GH}/Phishing-Page-Detector` },
  { id: "scraper", name: "SE Contact Scraper", tag: "OSINT", desc: "Collecte de contacts publics pour l'OSINT, export CSV/JSON/HTML.", repo: `${GH}/SE-contact-scraper` },
  { id: "recon", name: "Basic Network Recon Tool", tag: "Réseau", desc: "Ping sweep, ARP, scan de ports, bannières, DNS et sous-domaines.", repo: `${GH}/Basic-Network-Recon-Tool` },
  { id: "safe-install", name: "safe-install", tag: "Supply chain", desc: "Analyse un paquet npm/PyPI avant installation : typosquatting, scripts post-install, code suspect.", repo: `${GH}/safe-install` },
  { id: "breach", name: "BREACH", tag: "Jeu", desc: "Metroidvania jouable dans le navigateur : chaque pouvoir se gagne en résolvant un défi de sécurité.", repo: `${GH}/breach` },
  { id: "synergy", name: "Synergy Craft", tag: "Web 3D", desc: "Plateforme freelance dual-side avec rendu 3D temps réel (Three.js).", repo: null },
];

const ABOUT = [
  "Julio Dahou — Cybersecurity Specialist & Software Engineer",
  "Cotonou, Bénin · ouvert au remote",
  "Pentest, low-level C, Python, défense SOC. J'analyse, je casse, je corrige, je documente.",
];
const SKILLS = {
  langages: ["C", "Python", "JavaScript", "PHP", "Java", "SQL"],
  cyber: ["Pentest", "Vulnerability Assessment", "SOC junior", "Kali Linux", "OSINT"],
  web: ["Django", "Next.js", "Node.js", "Supabase", "PostgreSQL", "MySQL"],
  outils: ["Linux", "Docker", "Git"],
};
const CONTACT = { email: "juliodh2006@gmail.com", github: "github.com/Jimo0x" };

/* Interprète une commande et renvoie des lignes [{text, cls?, href?}] ou une action. */
export function run(input) {
  const [cmd, ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();
  const L = (text, cls, href) => ({ text, cls, href });

  switch ((cmd || "").toLowerCase()) {
    case "":
      return [];
    case "help":
    case "aide":
      return [
        L("Commandes disponibles :", "accent"),
        L("  whoami            qui suis-je"),
        L("  ls                lister les projets"),
        L("  cat <projet>      détails d'un projet (ex: cat breach)"),
        L("  open <projet>     ouvrir le dépôt GitHub"),
        L("  skills            compétences"),
        L("  contact           me contacter"),
        L("  goto <section>    aller à : accueil, projets, parcours, stack, contact"),
        L("  clear             effacer l'écran"),
        L("  exit              fermer le terminal"),
      ];
    case "whoami":
      return ABOUT.map((t, i) => L(t, i === 0 ? "accent" : ""));
    case "ls":
      return PROJECTS.map(p => L(`  ${p.id.padEnd(14)} ${p.tag.padEnd(13)} ${p.name}`));
    case "cat": {
      const p = find(arg);
      if (!p) return [L(`cat: ${arg || "?"}: projet introuvable (tape ls)`, "err")];
      return [
        L(p.name, "accent"),
        L(p.desc),
        p.repo ? L(`→ ${p.repo}`, "link", p.repo) : L("→ dépôt privé", "dim"),
      ];
    }
    case "open": {
      const p = find(arg);
      if (!p) return [L(`open: ${arg || "?"}: projet introuvable`, "err")];
      if (!p.repo) return [L(`${p.name} est un dépôt privé.`, "dim")];
      return { action: "open", url: p.repo, lines: [L(`Ouverture de ${p.repo} …`, "dim")] };
    }
    case "skills":
      return Object.entries(SKILLS).map(([k, v]) => L(`  ${k.padEnd(10)} ${v.join(" · ")}`));
    case "contact":
      return [
        L(`  email   ${CONTACT.email}`, "link", `mailto:${CONTACT.email}`),
        L(`  github  ${CONTACT.github}`, "link", `https://${CONTACT.github}`),
      ];
    case "goto": {
      const ok = ["accueil", "projets", "parcours", "stack", "contact"];
      if (!ok.includes(arg)) return [L(`goto: section inconnue. Choix : ${ok.join(", ")}`, "err")];
      return { action: "goto", id: arg, lines: [] };
    }
    case "clear":
      return { action: "clear", lines: [] };
    case "exit":
    case "quit":
      return { action: "close", lines: [] };
    case "sudo":
      return [L("Bien essayé. Cet incident sera signalé. 🙂", "err")];
    case "rm":
      if (/-rf/.test(arg)) return [L("Non. Les sauvegardes, ça existe, mais quand même.", "err")];
      return [L("rm: permission refusée", "err")];
    default:
      return [L(`${cmd}: commande introuvable. Tape help.`, "err")];
  }
}

function find(q) {
  if (!q) return null;
  return PROJECTS.find(p => p.id === q) || PROJECTS.find(p => p.name.toLowerCase().includes(q));
}

export function complete(input) {
  const words = ["help", "whoami", "ls", "cat", "open", "skills", "contact", "goto", "clear", "exit"];
  const parts = input.split(" ");
  if (parts.length === 1) {
    const m = words.filter(w => w.startsWith(parts[0].toLowerCase()));
    return m.length === 1 ? m[0] + " " : input;
  }
  if (["cat", "open"].includes(parts[0])) {
    const m = PROJECTS.map(p => p.id).filter(id => id.startsWith(parts[1].toLowerCase()));
    return m.length === 1 ? `${parts[0]} ${m[0]}` : input;
  }
  return input;
}

/* ---------- interface ---------- */
export function initTerminal() {
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
  let hIndex = 0;
  let lastFocus = null;

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
    if (!out.childElementCount) print([
      { text: "Bienvenue. Tape help pour la liste des commandes.", cls: "accent" },
      { text: "Astuce : Tab complète, ↑/↓ parcourt l'historique, Échap ferme.", cls: "dim" },
    ]);
    field.focus();
  }
  function close() {
    root.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  root.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    const value = field.value;
    field.value = "";
    if (value.trim()) { history.push(value); hIndex = history.length; }
    print([{ text: `$ ${value}`, cls: "cmd" }]);
    const res = run(value);
    if (Array.isArray(res)) { print(res); return; }
    print(res.lines || []);
    if (res.action === "clear") out.textContent = "";
    if (res.action === "close") close();
    if (res.action === "open") window.open(res.url, "_blank", "noopener");
    if (res.action === "goto") { close(); document.getElementById(res.id)?.scrollIntoView({ behavior: "smooth" }); }
  });
  field.addEventListener("keydown", e => {
    if (e.key === "Tab") { e.preventDefault(); field.value = complete(field.value); }
    else if (e.key === "ArrowUp" && history.length) { e.preventDefault(); hIndex = Math.max(0, hIndex - 1); field.value = history[hIndex]; }
    else if (e.key === "ArrowDown" && history.length) { e.preventDefault(); hIndex = Math.min(history.length, hIndex + 1); field.value = history[hIndex] || ""; }
  });
  root.addEventListener("mousedown", e => { if (e.target === root) close(); });
  root.querySelector(".term-x").addEventListener("click", close);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !root.hidden) { close(); return; }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
    if ((e.key === "`" && !typing) || (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      root.hidden ? open() : close();
    }
  });
  document.querySelectorAll("[data-terminal]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); open(); }));
}

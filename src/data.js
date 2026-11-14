/* Contenu du portfolio : tout le texte des projets, du parcours et des contacts vit ici.
   Ajouter un projet = ajouter une entrée dans PROJECTS (la carte réseau, la liste,
   la page projet, la palette de commandes et le terminal se mettent à jour seuls). */

const GH = "https://github.com/Jimo0x";

export const PROFILE = {
  name: "Julio Dahou",
  handle: "Jimo0x",
  role: "Spécialiste cybersécurité et développeur logiciel",
  city: "Cotonou, Bénin",
  remote: true,
  email: "juliodh2006@gmail.com",
  phone: "+229 01 62 25 70 04",
  phoneHref: "tel:+2290162257004",
  github: GH,
};

export const KINDS = {
  cyber: "Cybersécurité",
  web: "Web",
  jeu: "Jeu vidéo",
};

export const PROJECTS = [
  {
    id: "frixx",
    name: "FrixX",
    kind: "web",
    tagline: "Générateur de sites vitrines assisté par IA, avec export statique prêt à héberger.",
    summary: "On décrit son activité, son style et ses sections ; FrixX génère le site, l'affiche en aperçu ordinateur et mobile, puis l'exporte en fichiers statiques.",
    body: [
      "FrixX s'adresse aux petites entreprises qui n'ont ni le temps ni le budget pour un site sur mesure : un restaurant, un salon de coiffure, un cabinet, un artisan. On remplit une spécification en quatre étapes (identité, style, contenu, contact) et l'IA construit un site vitrine cohérent avec le secteur et le ton choisis.",
      "Le résultat s'affiche en direct, en vue ordinateur ou mobile, puis s'exporte en site statique optimisé : pas de serveur à maintenir, un hébergement gratuit suffit. L'application s'installe aussi comme une application (PWA).",
    ],
    features: [
      "Spécification guidée : identité, style, contenu, contact",
      "Secteurs prédéfinis et ton réglable",
      "Couleur d'accent et ambiance personnalisables",
      "Aperçu ordinateur et mobile en direct",
      "Export statique optimisé pour l'hébergement",
      "Installable comme application (PWA)",
    ],
    stack: ["IA générative", "PWA", "Export statique"],
    repo: null,
    images: ["FrixX.png"],
  },
  {
    id: "phishing",
    name: "Phishing & Threat Detector",
    kind: "cyber",
    tagline: "Donne un score de risque à une URL, un fichier ou une image suspecte.",
    summary: "Analyse d'URL, de certificat, d'en-têtes, de contenu, de WHOIS, de fichiers (magic bytes, entropie, macros) et d'images (EXIF, stéganographie LSB).",
    body: [
      "Pensé pour un analyste SOC junior : on colle une URL ou on dépose un fichier, l'outil combine une dizaine de signaux et rend un score sur 100 avec un rapport HTML.",
      "Le rapport échappe tout ce qui vient de la cible : une page piégée ne peut pas exécuter de code chez l'analyste qui l'ouvre. L'outil s'utilise en menu interactif ou en ligne de commande, avec une sortie JSON pour l'automatisation.",
    ],
    features: [
      "Détection d'usurpation de marque sans faux positifs",
      "Vrai type de fichier via magic bytes, double extension",
      "Entropie de Shannon, macros VBA, strings suspectes",
      "Mode CLI, sortie JSON, tests automatisés",
    ],
    stack: ["Python", "BeautifulSoup", "WHOIS", "SSL", "pytest"],
    repo: `${GH}/Phishing-Page-Detector`,
    images: ["Phishing et Threat Detector.png"],
  },
  {
    id: "safe-install",
    name: "safe-install",
    kind: "cyber",
    tagline: "Bloque un paquet npm ou PyPI piégé avant qu'il ne s'installe.",
    summary: "Typosquatting, scripts post-install ajoutés en douce, code qui lit les clés SSH ou exfiltre vers un webhook : l'archive est inspectée en mémoire, jamais exécutée.",
    body: [
      "Les attaques par la chaîne d'approvisionnement visent le moment où un développeur tape npm install. safe-install s'intercale avant : il télécharge l'archive du paquet, la lit en mémoire et rend un verdict OK, WARN ou BLOCK.",
      "Il compare aussi les versions entre elles : un script postinstall qui apparaît dans la dernière version alors qu'il n'existait pas avant est l'un des signaux les plus forts. Zéro dépendance, utilisable en CI grâce à ses codes de sortie.",
    ],
    features: [
      "Typosquatting par distance de Damerau-Levenshtein",
      "Scripts d'installation nouveaux dans une version",
      "Motifs d'exfiltration et d'obfuscation",
      "Protection contre les archives « bombes »",
    ],
    stack: ["Python", "Supply chain", "Analyse statique", "CI"],
    repo: `${GH}/safe-install`,
    images: [],
    code: `$ safe-install npm lodahs
lodahs@1.0.1 (npm)
  score   : 100/100
  verdict : BLOCK
  raisons :
    +40  nom très proche de : lodash
    +35  'postinstall' : curl | sh
    +35  lit des clés SSH  [index.js]
    +30  script ajouté dans cette version`,
  },
  {
    id: "breach",
    name: "BREACH",
    kind: "jeu",
    tagline: "Un metroidvania où chaque pouvoir se gagne en piratant un terminal.",
    summary: "Chiffre de César pour le dash, Base64 pour le double saut, injection SQL pour traverser le pare-feu. Jouable dans le navigateur.",
    body: [
      "BREACH reprend la boucle des metroidvania, explorer, bloquer, débloquer, en remplaçant les clés par de vraies failles. Pendant le défi d'injection SQL, la requête construite par le serveur s'affiche en direct : on voit l'apostrophe casser la requête.",
      "La progression est prouvée par des tests qui simulent la physique du jeu : le fossé est infranchissable sans dash, le mur sans double saut, le pare-feu sans injection.",
    ],
    features: [
      "4 défis de sécurité, 3 capacités",
      "Un seul fichier, Canvas 2D, zéro dépendance",
      "Niveau généré par code",
      "Tests de progression dans Node",
    ],
    stack: ["JavaScript", "Canvas 2D", "Game design"],
    repo: `${GH}/Breach`,
    images: ["BREACH.png"],
  },
  {
    id: "recon",
    name: "Basic Network Recon Tool",
    kind: "cyber",
    tagline: "La phase de reconnaissance d'un pentest, en une commande.",
    summary: "Ping sweep, ARP, scan de ports parallèle, bannières, empreinte d'OS, DNS et sous-domaines.",
    body: [
      "Un outil de reconnaissance réseau écrit avec la seule bibliothèque standard de Python. Les scans tournent sur 100 threads : un ping sweep de /24 prend quelques secondes au lieu de plusieurs minutes.",
      "Toutes les entrées sont validées avant d'atteindre une commande système, et le ping s'adapte à Windows comme à Linux.",
    ],
    features: [
      "Scan de ports et ping sweep parallèles",
      "Empreinte d'OS par TTL et nmap",
      "Énumération de sous-domaines",
      "Sous-commandes CLI et tests sur Linux et Windows",
    ],
    stack: ["Python", "Sockets", "Threads", "nmap"],
    repo: `${GH}/Basic-Network-Recon-Tool`,
    images: ["Basic Network Recon Tool.png"],
  },
  {
    id: "scraper",
    name: "SE Contact Scraper",
    kind: "cyber",
    tagline: "Collecte OSINT de contacts publics pour les audits d'ingénierie sociale.",
    summary: "Crawler multi-pages qui extrait emails, téléphones et noms, avec exports CSV, JSON et HTML.",
    body: [
      "Avant un test de sensibilisation au phishing, il faut savoir quelles informations une organisation expose publiquement. Le crawler parcourt le site, respecte robots.txt et une limite de pages, puis regroupe les contacts trouvés.",
      "Les exports sont durcis : le rapport HTML échappe le contenu collecté, et le CSV neutralise les formules qu'un site piégé pourrait glisser dans Excel.",
    ],
    features: [
      "Crawler avec profondeur, délai et limite de pages",
      "Respect de robots.txt",
      "Exports CSV, JSON et rapport HTML",
      "Protection contre l'injection de formules CSV",
    ],
    stack: ["Python", "OSINT", "BeautifulSoup", "Selenium"],
    repo: `${GH}/SE-contact-scraper`,
    images: ["SE Contact Scraper1.png", "SE Contact Scraper2.png", "SE Contact Scraper3.png"],
  },
  {
    id: "synergy",
    name: "SynergyCraft",
    kind: "web",
    tagline: "Marketplace freelance où la base de données fait respecter les règles.",
    summary: "Clients et freelances se rencontrent, commandent et paient par Mobile Money. Première version en Django avec rendu 3D, puis migration vers Next.js et Supabase.",
    body: [
      "SynergyCraft met en relation des clients et des freelances, de la commande au paiement. La première version était une application Django complète : API REST, authentification JWT, messagerie temps réel avec Channels et une interface 3D en Three.js.",
      "La version actuelle a migré vers Next.js et Supabase en déplaçant la sécurité dans PostgreSQL : les politiques Row Level Security garantissent qu'un utilisateur ne lit et n'écrit que ses propres données, et des triggers empêchent un client de marquer lui-même une commande comme payée. Le paiement FedaPay est vérifié par un webhook signé.",
    ],
    features: [
      "Espaces client et freelance séparés",
      "Paiement FedaPay avec webhook signé (HMAC et horodatage)",
      "RLS sur toutes les tables, triggers de workflow",
      "Migration de Django vers Next.js et Supabase",
    ],
    stack: ["Next.js", "Supabase", "PostgreSQL", "RLS", "Django", "Three.js", "FedaPay"],
    repo: `${GH}/Project_Synergy`,
    images: ["synergy_craftt.png"],
  },
];

export const TIMELINE = [
  {
    when: "En cours",
    title: "Cybersécurité et expertise informatique",
    place: "ESGIS Bénin et Epitech Bénin",
    text: "Sécurité offensive, systèmes et programmation en C.",
  },
  {
    when: "Stage",
    title: "Technicien systèmes et maintenance",
    place: "Accompli Technologie et Services, Cotonou",
    text: "Maintenance de parc, gestion de réseaux, dépannage matériel et projets embarqués sur Arduino. Certification réseaux obtenue sur place.",
  },
  {
    when: "Bac",
    title: "Baccalauréat F2, électronique",
    place: "Lycée Don Bosco",
    text: "Électronique, systèmes industriels et premières bases d'informatique.",
  },
];

export const STACK = [
  { group: "Langages", items: ["C", "Python", "JavaScript", "TypeScript", "PHP", "Java", "SQL"] },
  { group: "Sécurité", items: ["Pentest web et réseau", "Analyse SOC", "OSINT", "Kali Linux", "nmap"] },
  { group: "Web", items: ["Django", "Next.js", "Node.js", "Supabase", "Three.js"] },
  { group: "Données et outils", items: ["PostgreSQL", "MySQL", "MariaDB", "Docker", "Git", "Linux"] },
];

export const imageUrl = name => "/assets/" + encodeURIComponent(name);

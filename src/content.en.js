/* English content overrides. Kept separate from src/data.js (the French source of truth)
   so the French file never has to be touched to maintain the translation.
   PROJECTS_EN is keyed by project id and merged onto the French PROJECTS entries at
   runtime/build time (see src/i18n.js and scripts/pages.mjs) — only the translatable
   fields (tagline, summary, body, features, code, stack) need to be listed here. */

export const PROFILE_EN = {
  role: "Cybersecurity specialist and software developer",
  city: "Cotonou, Benin",
};

export const KINDS_EN = {
  cyber: "Cybersecurity",
  web: "Web",
  app: "Application",
  ia: "AI & data",
  outil: "System tools",
  creatif: "Creative",
  jeu: "Video game",
};

export const TIMELINE_EN = [
  {
    when: "Ongoing",
    title: "Cybersecurity and IT expertise",
    place: "ESGIS Benin and Epitech Benin",
    text: "Offensive security, systems, and C programming.",
  },
  {
    when: "Internship",
    title: "Systems and maintenance technician",
    place: "Accompli Technologie et Services, Cotonou",
    text: "Fleet maintenance, network management, hardware troubleshooting, and embedded Arduino projects. Earned a networking certification on site.",
  },
  {
    when: "High school diploma",
    title: "Baccalauréat F2, electronics",
    place: "Lycée Don Bosco",
    text: "Electronics, industrial systems, and first steps into computing.",
  },
];

export const STACK_EN = [
  { group: "Languages", items: ["C", "Python", "JavaScript", "TypeScript", "PHP", "Java", "SQL"] },
  { group: "Security", items: ["Web & network pentesting", "SOC analysis", "OSINT", "Kali Linux", "nmap"] },
  { group: "Web", items: ["Django", "Next.js", "Node.js", "Supabase", "Three.js"] },
  { group: "Data & tools", items: ["PostgreSQL", "MySQL", "MariaDB", "Docker", "Git", "Linux"] },
];

export const SERVICES_EN = [
  { title: "Penetration testing", text: "Reconnaissance, vulnerability research, and controlled exploitation on a site, an API, or a network, with a clear report and prioritized fixes." },
  { title: "Security code review", text: "A focused read of an application: injections, XSS, access control, exposed secrets, risky dependencies. Every issue comes with its fix." },
  { title: "Web development", text: "Sites and apps in Next.js, Django, or Supabase, built secure from the start: RLS, input validation, verified payments." },
  { title: "Tools and automation", text: "Custom Python scripts and tools: scanners, OSINT collection, file analysis, CI integration." },
  { title: "Phishing awareness", text: "Mapping what an organization exposes publicly and preparing awareness campaigns, within an authorized scope." },
];

export const STATS_LABELS_EN = ["Projects built", "Cybersecurity tools", "Automated tests", "Playable games"];

export const PROJECTS_EN = {
  "frixx": {
    tagline: "AI-assisted business website generator, with a static export ready to host.",
    summary: "Describe your business, style and sections; FrixX generates the site, shows a live desktop and mobile preview, then exports it as static files.",
    body: [
      "FrixX is built for small businesses that have neither the time nor the budget for a custom site: a restaurant, a hair salon, a law practice, a craftsman. You fill in a four-step brief (identity, style, content, contact) and the AI builds a showcase site that matches the chosen industry and tone.",
      "The result renders live, in desktop or mobile view, then exports as an optimized static site: no server to maintain, free hosting is enough. The app also installs like a native app (PWA).",
    ],
    features: [
      "Guided brief: identity, style, content, contact",
      "Preset industries and adjustable tone",
      "Customizable accent color and mood",
      "Live desktop and mobile preview",
      "Optimized static export for hosting",
      "Installable as an app (PWA)",
    ],
    stack: ["Generative AI", "PWA", "Static export"],
  },
  "phishing": {
    tagline: "Gives a risk score to a suspicious URL, file, or image.",
    summary: "Analyzes URLs, certificates, headers, content, WHOIS, files (magic bytes, entropy, macros), and images (EXIF, LSB steganography).",
    body: [
      "Built for a junior SOC analyst: paste a URL or drop a file, the tool combines about ten signals and returns a score out of 100 with an HTML report.",
      "The report escapes everything coming from the target: a booby-trapped page can't run code on the analyst who opens it. The tool works as an interactive menu or a command line, with JSON output for automation.",
    ],
    features: [
      "Brand-impersonation detection with no false positives",
      "True file type via magic bytes, double extension",
      "Shannon entropy, VBA macros, suspicious strings",
      "CLI mode, JSON output, automated tests",
    ],
  },
  "safe-install": {
    tagline: "Blocks a booby-trapped npm or PyPI package before it installs.",
    summary: "Typosquatting, postinstall scripts slipped in quietly, code that reads SSH keys or exfiltrates to a webhook: the archive is inspected in memory, never executed.",
    body: [
      "Supply-chain attacks target the moment a developer types npm install. safe-install steps in before that: it downloads the package archive, reads it in memory, and returns an OK, WARN, or BLOCK verdict.",
      "It also diffs versions against each other: a postinstall script that appears in the latest version but wasn't there before is one of the strongest signals. Zero dependencies, usable in CI thanks to its exit codes.",
    ],
    features: [
      "Typosquatting via Damerau-Levenshtein distance",
      "New install scripts appearing in a version",
      "Exfiltration and obfuscation patterns",
      "Protection against archive \"bombs\"",
    ],
    code: `$ safe-install npm lodahs
lodahs@1.0.1 (npm)
  score   : 100/100
  verdict : BLOCK
  reasons:
    +40  name very close to: lodash
    +35  'postinstall': curl | sh
    +35  reads SSH keys  [index.js]
    +30  script added in this version`,
  },
  "breach": {
    tagline: "A metroidvania where every power-up is earned by hacking a terminal.",
    summary: "Caesar cipher for the dash, Base64 for the double jump, SQL injection to get past the firewall. Playable in the browser.",
    body: [
      "BREACH takes the classic metroidvania loop — explore, get blocked, unlock — and swaps keys for real vulnerabilities. During the SQL injection challenge, the query built by the server is shown live: you watch the apostrophe break it.",
      "Progression is proven by tests that simulate the game's physics: the pit is uncrossable without the dash, the wall without the double jump, the firewall without the injection.",
    ],
    features: [
      "4 security challenges, 3 abilities",
      "Single file, Canvas 2D, zero dependencies",
      "Level generated by code",
      "Progression tests in Node",
    ],
  },
  "recon": {
    tagline: "A pentest's reconnaissance phase, in a single command.",
    summary: "Ping sweep, ARP, parallel port scanning, banners, OS fingerprinting, DNS and subdomains.",
    body: [
      "A network recon tool written using only Python's standard library. Scans run across 100 threads: a /24 ping sweep takes a few seconds instead of several minutes.",
      "Every input is validated before reaching a system command, and the ping adapts to both Windows and Linux.",
    ],
    features: [
      "Parallel port scanning and ping sweep",
      "OS fingerprinting via TTL and nmap",
      "Subdomain enumeration",
      "CLI subcommands and tests on Linux and Windows",
    ],
  },
  "scraper": {
    tagline: "OSINT collection of public contacts for social-engineering audits.",
    summary: "Multi-page crawler that extracts emails, phone numbers, and names, with CSV, JSON, and HTML exports.",
    body: [
      "Before a phishing-awareness test, you need to know what information an organization exposes publicly. The crawler walks the site, respects robots.txt and a page limit, then groups the contacts it finds.",
      "Exports are hardened: the HTML report escapes the collected content, and the CSV neutralizes formulas a booby-trapped site could slip into Excel.",
    ],
    features: [
      "Crawler with depth, delay, and page limit",
      "Respects robots.txt",
      "CSV, JSON exports and an HTML report",
      "Protection against CSV formula injection",
    ],
  },
  "synergy": {
    tagline: "Freelance marketplace where the database enforces the rules.",
    summary: "Clients and freelancers meet, place orders, and pay via Mobile Money. First version in Django with 3D rendering, later migrated to Next.js and Supabase.",
    body: [
      "SynergyCraft connects clients and freelancers, from order to payment. The first version was a full Django app: REST API, JWT auth, real-time messaging with Channels, and a 3D interface in Three.js.",
      "The current version migrated to Next.js and Supabase, moving security down into PostgreSQL: Row Level Security policies guarantee a user only reads and writes their own data, and triggers stop a client from marking their own order as paid. The FedaPay payment is verified by a signed webhook.",
    ],
    features: [
      "Separate client and freelancer spaces",
      "FedaPay payment with a signed webhook (HMAC and timestamp)",
      "RLS on every table, workflow triggers",
      "Migration from Django to Next.js and Supabase",
    ],
  },
  "vyrn": {
    tagline: "My own programming language: Python's syntax, C's speed.",
    summary: "A statically typed, indentation-based language, compiled to C and then to a native executable. Type inference, structs, lists, rich strings, and direct calls to C functions.",
    body: [
      "The compiler follows the classic pipeline: a lexer that handles indentation, a recursive-descent parser, a type checker with inference, and a C code generator paired with a small runtime. The generated C then goes through gcc or clang to produce a native binary, with no virtual machine.",
      "Errors are designed to be read: each one points to the line and column with a code snippet, and several errors are reported in a single pass. At runtime, an out-of-bounds access or a division by zero gives a clear message with the line number instead of a crash. On the same recursive computation (fib(35)), Vyrn runs about ten times faster than CPython.",
    ],
    features: [
      "Native compilation via C: about 10× faster than CPython on fib(35)",
      "Types checked before execution, with inference",
      "Structs, generic lists, string methods",
      "C interop: cinclude and extern fn",
      "Localized errors (line, column) and bounds checking",
      "CLI run, build, check (JSON output) and emit-c, 20 automated tests",
    ],
  },
  "vyrn-studio": {
    tagline: "The code editor for the Vyrn language, built on VS Code's engine.",
    summary: "Monaco with a black-and-red theme, Vyrn syntax highlighting and completion, errors underlined as you type, one-shortcut execution, and a view of the generated C.",
    body: [
      "A local Python server links the interface to the compiler: on every keystroke, the code is checked and errors show up under the text and in a Problems tab. Ctrl+Enter compiles and runs the file, showing output, compile and run times, and a standard input you can prepare in advance.",
      "The editor keeps VS Code's muscle memory: tabs, explorer, fuzzy quick-open (Ctrl+P), project-wide search, go to definition, rename, and a command palette. The server only listens locally, requires a random token, and confines paths to the project folder.",
    ],
    features: [
      "Monaco engine (VS Code), black-and-red theme",
      "Live diagnostics from the compiler",
      "Ctrl+Enter execution, measured output and timing",
      "View of the generated C",
      "Quick open, project-wide search, F12 and F2",
      "Local server protected by a token, confined paths",
    ],
  },
  "music-player": {
    tagline: "Cross-platform music player: Windows, macOS, Linux, and Android, with synced lyrics.",
    summary: "Local library, playlists, queue, live 3-band equalizer, and automatically fetched lyrics. Audio engine in Rust, Vue 3 interface, packaged with Tauri.",
    body: [
      "A lightweight player that runs on desktop and phone with the same code: the Rust engine plays audio (mp3, flac, ogg, wav, m4a), scans the library incrementally, and applies the equalizer, while the Vue 3 interface adapts from small foldable screens to tablets.",
      "Synced lyrics are looked up in order: .lrc file, tags, then LRCLIB, with smart parsing of poorly labeled filenames. On Android: lock-screen controls, background playback service, and signed auto-updates with no reinstall needed.",
    ],
    features: [
      "Windows, macOS, Linux and Android (arm64 and armv7 APKs)",
      "Automatic synced lyrics, adjustable to the half-second",
      "15 themes, 73 fonts, 10 selectable app icons",
      "Automatic updates signed by CI",
    ],
  },
  "reality-scanner": {
    tagline: "Analyzes live what a camera sees: motion, faces, people, text, and objects.",
    summary: "Webcam, video, or image: combinable detectors draw their results as an overlay, with a dashboard and an event log.",
    body: [
      "The Flask server reads the source and applies the chosen detectors: motion via background subtraction, HOG silhouettes, text regions, and 80 object classes with YOLOv8 when installed.",
      "The interface shows the annotated stream, latency, sharpness, and activity over time; you can export the log as JSON or an annotated snapshot.",
    ],
    features: [
      "Combinable detectors, adjustable confidence threshold",
      "Optional YOLOv8 (80 classes)",
      "Sharpness, brightness, and latency metrics",
      "Appearance log and JSON export",
    ],
  },
  "truth-or-fake": {
    tagline: "Spots edits and AI-generated images, metadata included.",
    summary: "ELA, noise map, FFT spectrum, copy-paste detection, and metadata reading (EXIF, prompts, C2PA) produce an explained score.",
    body: [
      "Each analysis produces a layer overlaid on the image at adjustable opacity: zones recompressed differently, noise that's too uniform, periodic peaks left by generative models, cloned regions.",
      "The score out of 100 adds up weighted clues, each explained in plain language. A button forges a tampered image right in the browser so you can test the tool immediately.",
    ],
    features: [
      "Error Level Analysis and noise map",
      "FFT spectrum against generation artifacts",
      "Internal copy-paste via ORB keypoints",
      "Metadata: EXIF, AI prompts, C2PA",
    ],
    stack: ["Python", "Flask", "OpenCV", "Forensics"],
  },
  "silent-secretary": {
    tagline: "Transcribes a meeting and produces the minutes: decisions, tasks, open questions.",
    summary: "Live dictation, audio file (Whisper plus in-house diarization), or an existing transcript; all language processing stays local.",
    body: [
      "Speakers in an audio file are separated by spectral fingerprint and pitch, clustered with K-means; the number of speakers is chosen automatically.",
      "The minutes extract decisions, tasks with an owner and a deadline, questions left unanswered, and speaking time, then export to Markdown.",
    ],
    features: [
      "Three sources: mic, audio file, text",
      "In-house diarization, no external service",
      "Tasks with an owner and a deadline",
      "Markdown export, SQLite history",
    ],
  },
  "digital-watcher": {
    tagline: "Learns a network's normal behavior and explains every unusual activity.",
    summary: "Isolation Forest, robust deviations, and a beaconing rule: the alert states what changed and suggests a hypothesis (scan, exfiltration, C2…).",
    body: [
      "Each traffic window is summarized into 8 features. Detection combines an isolation forest, a per-feature robust z-score, and a rule that flags an unknown host contacted in a burst.",
      "The demo simulates a workstation where you can inject five attacks with one click; in real mode, the tool reads /proc on Linux with no root privileges.",
    ],
    features: [
      "Hybrid, explainable detection",
      "5 one-click simulated attacks",
      "Real mode via /proc, no root",
      "Live-adjustable sensitivity",
    ],
    stack: ["Python", "scikit-learn", "Flask", "Network analysis"],
  },
  "second-brain": {
    tagline: "Your notes and PDFs automatically linked, and queryable in plain language.",
    summary: "A graph of ideas based on semantic proximity, [[wiki]] links and tags, semantic search, and Q&A with citations.",
    body: [
      "Passages are indexed with TF-IDF then LSA, which groups notes about the same concept even if they don't use the same words.",
      "Answers cite their sources as clickable links; without an API key they're extractive, with a key an LLM writes the answer strictly from your own excerpts.",
    ],
    features: [
      "Import .md, .txt, and .pdf",
      "Interactive idea graph",
      "RAG with clickable citations",
      "Works with no API key",
    ],
  },
  "confession-room": {
    tagline: "Anonymous confessions with reactions, pseudonymous reputation, and three-tier moderation.",
    summary: "A stable pseudonym with no account or email, reactions, replies, and automatic, community, and human moderation.",
    body: [
      "Identity lives in a random token stored in an httpOnly cookie, which generates a unique pseudonym and graphic seal; you can change it anytime.",
      "Emails, phone numbers, and links are automatically redacted, three reports hide a message, and a protected queue lets you approve, delete, or ban.",
    ],
    features: [
      "Anonymity with no account",
      "Trends, reactions, and replies",
      "Automatic and human moderation",
      "Identity-based anti-spam",
    ],
    stack: ["Python", "Flask", "SQLite", "Moderation"],
  },
  "time-capsule": {
    tagline: "Letters and photos sealed until a future date, encrypted if you want.",
    summary: "The server refuses to deliver content before its time; with a secret passphrase, it only ever stores ciphertext (AES-GCM 256).",
    body: [
      "Encryption happens in the browser with WebCrypto: PBKDF2-SHA256 at 200,000 iterations, then 256-bit AES-GCM. The server can never read a protected capsule.",
      "A scheduler detects capsules that have come due and can notify by email; the public wall shows countdowns synced to the server clock.",
    ],
    features: [
      "Server-side verified seal",
      "Optional end-to-end encryption",
      "Attached photos, shareable link",
      "Scheduler and unlock email",
    ],
  },
  "the-arena": {
    tagline: "Head-to-head debates: the audience votes live and an AI scores each argument.",
    summary: "Three 90-second rounds, real-time votes and reactions over WebSocket, a verdict blending the AI referee and the audience.",
    body: [
      "The referee scores each argument on five criteria (structure, evidence, rebuttal, clarity, development) and gives personalized feedback; you can also train against the AI.",
      "The Node server manages rooms, the timer, and real-time broadcasting with a hand-written WebSocket implementation.",
    ],
    features: [
      "Real-time debates over WebSocket",
      "AI referee on five criteria",
      "Adjustable audience vote",
      "Training mode against the AI",
    ],
  },
  "case-zero": {
    tagline: "An investigation game: cross-reference documents, conversations, and photos to unmask a culprit.",
    summary: "A string-and-pin investigation board, a timeline rebuilt from clues, and Canvas-drawn photos with a magnifier.",
    body: [
      "The Helios prototype case features four suspects, alibis that line up or don't, and a red herring; the accusation requires a culprit, a method, and two pieces of evidence.",
      "The whole case is described in a data file, and a validator checks that it stays consistent and solvable: you can write your own cases.",
    ],
    features: [
      "Investigation board with red strings",
      "Automatically rebuilt timeline",
      "Canvas-drawn scenes, 2.5× magnifier",
      "Case creator with a validator",
    ],
  },
  "digital-identity": {
    tagline: "Visualizes your digital footprint and helps you shrink it.",
    summary: "A graph of your accounts and credentials, an exposure score, and prioritized recommendations, entirely in the browser.",
    body: [
      "Importing a password export never keeps the plaintext: each password becomes a truncated fingerprint and a strength estimate, just enough to spot reuse.",
      "The graph shows which accounts a stranger could link together, and the recommendations say what to do first: 2FA, email aliases, dormant accounts.",
    ],
    features: [
      "Interactive identity graph",
      "Per-account exposure score",
      "No password stored in plaintext",
      "No data sent anywhere",
    ],
    stack: ["JavaScript", "WebCrypto", "Defensive OSINT"],
  },
  "password-lab": {
    tagline: "A lab that shows concretely why a password falls, and how to store one properly.",
    summary: "A realistic strength tester, a hashing comparator, a dictionary attack against fictional accounts, and a C benchmark with OpenSSL.",
    body: [
      "Naive entropy is compared against realistic entropy that spots dictionary words, leetspeak, and predictable suffixes.",
      "In the lab, you see the effect of salting and the cost of scrypt or PBKDF2 against an attack; the C benchmark measures each algorithm's real throughput.",
    ],
    features: [
      "Realistic entropy and predictable patterns",
      "MD5, SHA, PBKDF2 and scrypt compared",
      "Attack limited to the lab's own accounts",
      "C benchmark with OpenSSL EVP",
    ],
    stack: ["Python", "C", "OpenSSL", "Cryptography"],
  },
  "packet-detective": {
    tagline: "A mini-Wireshark: capture, dissection, and detection of suspicious behavior.",
    summary: "A C capture engine (AF_PACKET), an in-house pcap parser, a three-pane interface, filters, and TCP stream tracking.",
    body: [
      "Dissection covers Ethernet, ARP, IPv4 and IPv6, ICMP, TCP, UDP, DNS, HTTP, and TLS (SNI), with a hex dump that highlights the hovered layer.",
      "Expert info flags credentials sent in the clear, port scans, risky domains, and retransmissions; captures export to pcap.",
    ],
    features: [
      "Capture in C via AF_PACKET",
      "pcap and pcapng reading with no libpcap",
      "Wireshark-style filters",
      "Suspicious activity detection",
    ],
    stack: ["C", "Python", "Networking", "pcap"],
  },
  "ghost-files": {
    tagline: "Watches a folder and keeps every file's history, diffs included.",
    summary: "A C++ daemon (inotify, hand-written SHA-256), SQLite history, and suspicious-behavior detection.",
    body: [
      "The C++17 engine tracks creations, modifications, deletions, and renames, with SHA-256 fingerprints implemented from the spec and checked against hashlib.",
      "The interface shows the timeline and diffs, and alerts on typical ransomware behavior: more than 20 files touched in 10 seconds.",
    ],
    features: [
      "C++ inotify daemon",
      "Hand-implemented SHA-256",
      "History and diffs",
      "Ransomware-pattern alert",
    ],
  },
  "mini-task-manager": {
    tagline: "A process manager in C, with a web interface served by the binary and an ncurses mode.",
    summary: "CPU, RAM, and processes read from /proc, sorting, a process tree, signals; a single binary with no framework.",
    body: [
      "The binary embeds its own HTTP server over POSIX sockets and only listens on 127.0.0.1, since the API can send signals.",
      "The graphical interface offers a sortable list, per-core graphs, a process tree, and actions to end, kill, suspend, or resume.",
    ],
    features: [
      "A single C binary, two interfaces",
      "Hand-written HTTP server",
      "Per-core CPU graphs",
      "Parent-child process tree",
    ],
  },
  "mini-sandbox": {
    tagline: "Runs a suspicious program in a cage and watches everything it attempts.",
    summary: "A C++ engine with ptrace, namespaces, and resource limits; a report with a verdict, process tree, and system calls.",
    body: [
      "The program runs under an unprivileged user, with time, memory, and process limits; every sensitive syscall is traced and can be blocked.",
      "Seven samples (spy, saboteur, fork bomb, downloader…) show the detection in action, with a risk score and the files created.",
    ],
    features: [
      "ptrace and Linux namespaces",
      "CPU, memory, and process limits",
      "Process tree and system calls",
      "7 sample programs",
    ],
  },
  "infinite-maze": {
    tagline: "A procedural maze that can reshape itself as you move through it.",
    summary: "DFS, Prim, or Kruskal generation, A* for the solution path and the Minotaur, fog of war, and shareable seeds.",
    body: [
      "Each maze is a spanning tree with loops added on top; the exit is placed on the farthest cell, computed by BFS.",
      "In living mode, walls move, and every change is checked to make sure the exit never becomes unreachable.",
    ],
    features: [
      "3 generation algorithms",
      "A* for the solution path and the enemy",
      "Living maze, always connected",
      "Shareable seeds",
    ],
    stack: ["JavaScript", "Canvas 2D", "Algorithms"],
  },
  "memory-exe": {
    tagline: "A psychological game where your choices rewrite your memories and the world.",
    summary: "Memories that change before your eyes, shifting objects, conditional dialogue, and five endings.",
    body: [
      "Three stats — corruption, lucidity, and trust — drive the visual glitches, the truth revealed, and the ending you get.",
      "Every piece of text is a function of the game state: the same locations don't tell the same story from one playthrough to the next.",
    ],
    features: [
      "5 endings",
      "Self-rewriting memories",
      "Glitch effects tied to corruption",
      "Conditional dialogue",
    ],
    stack: ["JavaScript", "Interactive storytelling"],
  },
  "particle-world": {
    tagline: "A sandbox where sand, water, fire, lava, and about fifteen elements react with each other.",
    summary: "A 300×190-cell cellular automaton: combustion, steam, lava that freezes water, plants that grow.",
    body: [
      "Each element follows simple rules, and their interactions produce rich scenes: a forest fire, a volcano, an hourglass, an acid lab.",
      "Adjustable brush, wind, step-by-step pause, live population graphs, and PNG export.",
    ],
    features: [
      "15 elements and their reactions",
      "4 ready-made scenes",
      "Wind, pause, and step-by-step",
      "4× PNG export",
    ],
    stack: ["JavaScript", "Cellular automaton", "Canvas"],
  },
  "synesthesia": {
    tagline: "A music visualizer that turns bass, frequencies, and rhythm into animations.",
    summary: "6-band FFT analysis, beat detection via spectral flux, estimated tempo, and four visualizations.",
    body: [
      "The demo synthesizes its own music at 124 BPM with Web Audio; you can also load a file or listen through the mic.",
      "Beat detection measures what increases from one frame to the next in the bass, which stays reliable even when a bass note holds steady.",
    ],
    features: [
      "Synthesized music demo",
      "Detected beats and tempo",
      "4 visualizations",
      "File, mic, or demo",
    ],
  },
  "one-minute-war": {
    tagline: "Multiplayer strategy: 60 seconds to plan, then every order executes at once.",
    summary: "A seed-generated symmetric map, armies, cities, and gold; simultaneous resolution of movement and battles.",
    body: [
      "Paths are computed with Dijkstra based on terrain, two armies crossing paths fight halfway, and forests give a defensive bonus.",
      "The Node server referees the match and broadcasts turns over WebSocket; the AI fills empty slots and takes over for a disconnected player.",
    ],
    features: [
      "60-second simultaneous turns",
      "Symmetric map for fairness",
      "WebSocket multiplayer, 2 to 4 players",
      "AI for empty slots",
    ],
  },
  "city-pulse": {
    tagline: "A collaborative map for reporting urban issues and tracking their resolution.",
    summary: "One-click reporting, duplicate detection within 60m, neighbor confirmations, agent tracking, and a heatmap.",
    body: [
      "Before publishing, the app looks for nearby reports in the same category and offers to confirm one instead of creating a duplicate.",
      "The map is a hand-built component: Web Mercator projection, tiles, marker clustering, and a weighted heatmap.",
    ],
    features: [
      "Geographic duplicate detection",
      "Agent-tracked statuses",
      "Hand-built map with clustering",
      "Heatmap and statistics",
    ],
    stack: ["Python", "Flask", "Mapping", "SQLite"],
  },
  "where-did-my-money-go": {
    tagline: "Categorizes your spending with machine learning and forecasts next month.",
    summary: "CSV import from any bank, learned categories, detected subscriptions, and a forecast range.",
    body: [
      "The file format is auto-detected (separator, columns, numbers, encoding), then a character-level TF-IDF model with logistic regression classifies the entries.",
      "Correcting a category applies it to every transaction from the same merchant and retrains the model; subscriptions are flagged along with the date of the next charge.",
    ],
    features: [
      "Universal CSV import",
      "Learned, correctable categorization",
      "Subscription detection",
      "Per-category forecast",
    ],
  },
  "pixel-war": {
    tagline: "A real-time collaborative canvas, with a cooldown between pixels and a timelapse.",
    summary: "200×140 pixels, 34 colors, WebSocket broadcasting, every pixel's author tracked, and the full history replayable.",
    body: [
      "The cooldown is enforced server-side, by token and IP address; every pixel placed is broadcast instantly to everyone connected.",
      "The canvas is stored in binary and the history in an append-only log, enabling a full timelapse and PNG export.",
    ],
    features: [
      "Real-time WebSocket",
      "Server-side enforced cooldown",
      "Full-history timelapse",
      "48× zoom and minimap",
    ],
  },
  "lost-and-found-ai": {
    tagline: "Automatically matches found-item photos with lost-item listings.",
    summary: "SIFT and RANSAC visual matching, colors and context; a verification question before returning the item.",
    body: [
      "A found-item photo won't share the owner's angle or lighting: the score combines keypoints, colors, and contextual clues like timing.",
      "The \"See the matches\" button draws the retained correspondences, and a verification question guards against false claims.",
    ],
    features: [
      "SIFT and RANSAC matching",
      "Visual and contextual score",
      "Displayed matching points",
      "Verification question",
    ],
    stack: ["Python", "OpenCV", "Flask", "Computer vision"],
  },
  "universe-explorer": {
    tagline: "The solar system in 3D, with the planets' real positions, plus a probe sandbox.",
    summary: "JPL orbital elements, a hand-built 3D engine, a time machine, and probes launched from Earth.",
    body: [
      "Positions are computed from JPL's Keplerian elements and checked against the 2003 Mars opposition.",
      "The probe is integrated under the pull of the Sun and the eight planets: 2.95 km/s gets you to Mars, 8.8 km/s to Jupiter.",
    ],
    features: [
      "Real planet positions",
      "Dependency-free Canvas 3D engine",
      "Probes and detected flybys",
      "Distance and light-time measurement",
    ],
    stack: ["JavaScript", "Celestial mechanics", "Canvas"],
  },
  "code-autopsy": {
    tagline: "Forensics for code repositories: complexity, vulnerabilities, duplicates, and Git hotspots.",
    summary: "Multi-language static analysis, Git history (churn, bus factor, coupling), and an autopsy certificate graded A to E.",
    body: [
      "Analysis is exact for Python via its AST, and heuristic for JS, C, Java, Go, or Rust; it catches common vulnerabilities, hardcoded secrets, and dead code.",
      "Cross-referenced with Git history, complexity points to the hotspots: the complex files everyone keeps touching, right where bugs are born.",
    ],
    features: [
      "Per-function complexity and maintainability",
      "Vulnerabilities and hardcoded secrets",
      "Git hotspots and bus factor",
      "Treemap and Markdown report",
    ],
  },
  "terminal-404": {
    tagline: "An escape-room game inside a fake operating system: stop the AI before the purge.",
    summary: "A full desktop with terminal, files, mail, photos, and network; four code fragments to find in 30 minutes.",
    body: [
      "The terminal recognizes real commands: ls -a, grep, find, base64, ssh, pipes, tab completion, and history.",
      "Clues are hidden in images, emails, and logs; the WARDEN AI taunts the player and penalizes cheating attempts.",
    ],
    features: [
      "Realistic terminal with pipes",
      "Desktop with draggable windows",
      "Clues hidden in images",
      "Achievements and personal best",
    ],
  },
  "mood-mirror": {
    tagline: "A generative mirror: your body language becomes live art.",
    summary: "The energy, amplitude, and fluidity of your gestures (and voice) mapped onto Russell's model, across five generative styles.",
    body: [
      "The camera feed is analyzed in the browser: adaptive background, motion, posture; a fluid gesture reads differently from jittery agitation.",
      "The apparent mood drives palettes and engines (flow, watercolor, constellation, mosaic, waves), with PNG snapshots and 10-second video capture.",
    ],
    features: [
      "Motion and voice analysis",
      "5 generative-art engines",
      "Demo mode with a synthetic dancer",
      "Nothing leaves the browser",
    ],
    stack: ["JavaScript", "Computer vision", "Web Audio", "Canvas"],
  },
  "timemap": {
    tagline: "Travel through time on a map of Paris, from Lutetia to today.",
    summary: "Successive city walls, monuments appearing and disappearing, before/after comparison, and GeoJSON import.",
    body: [
      "The mapping engine is hand-built: Web Mercator projection, zoom, hover, and selection on Canvas, with no external tiles.",
      "The timeline scrolls through 2,000 years with interpolated population, and any dated GeoJSON can be imported to tell the story of another city.",
    ],
    features: [
      "Hand-built vector map",
      "Animated timeline and comparison",
      "GeoJSON import and export",
      "Personal bookmarks",
    ],
    stack: ["JavaScript", "GeoJSON", "Mapping", "Canvas"],
  },
  "digital-doppelganger": {
    tagline: "Your textual double, trained locally on your own messages.",
    summary: "A stylistic fingerprint, a bidirectional Markov chain, TF-IDF memories, and an optional LLM; a built-in Turing test.",
    body: [
      "The profile measures length, punctuation, emoji, register, and signature phrases; the Markov chain builds a full sentence around a keyword.",
      "WhatsApp exports are recognized, and the double only trains once you confirm the texts really are your own.",
    ],
    features: [
      "Style profile and radar chart",
      "Markov, memories, and LLM",
      "WhatsApp import",
      "Turing test",
    ],
  },
  "permis-b-benin": {
    tagline: "A revision PWA for Benin's driving-theory exam (category B license).",
    summary: "The whole syllabus summarized in 12 chapters, a map of 53 hand-drawn road signs, and a quiz generator built from 119 questions, with progress tracking. Installable and usable offline.",
    body: [
      "The course covers Benin's traffic regulations end to end: signage, right of way, speed limits, alcohol and fatigue, mandatory equipment, driving behavior, first aid, offenses, night and rain driving, two-wheeler and zemidjan specifics, and the environment. Each chapter fits into a few short sections for quick revision.",
      "The 53 signs are original SVG illustrations, grouped by category (danger, prohibition, priority, mandatory, information) to avoid any rights issue with photos. The quiz generator draws from 119 questions across three exercise types: course, signs, and scenarios, and can replay only past mistakes.",
      "A progress page tracks answers per chapter and successive exam scores, stored only locally on the device. The whole thing works as an installable PWA, with offline caching via a service worker.",
    ],
    features: [
      "12 course chapters, summarized without skipping anything in the official syllabus",
      "53 signs in original SVG, sorted by category",
      "119 quiz questions: course, signs, and scenarios",
      "Mistake-review mode and per-chapter progress tracking",
      "Installable and 100% usable offline (PWA + service worker)",
    ],
    code: `$ permis-b-benin --revision
12 chapters · 53 signs · 119 questions
  mode    : exam quiz (20 questions)
  score   : 17/20
  mistakes: right of way (2), speed limits (1)
  -> replay only my mistakes? [y/n]`,
  },
};

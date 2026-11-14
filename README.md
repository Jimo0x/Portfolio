# Portfolio de Julio Dahou

Portfolio de **Julio Dahou**, spécialiste cybersécurité et développeur (Cotonou, ouvert au remote).

## Ce qu'on y trouve

- **Une carte réseau interactive en ouverture** : chaque projet est un hôte relié à « julio ». Des paquets circulent sur les liens, le survol isole un nœud et le clic ouvre le projet.
- **Une page par projet** (`#projet-<id>`), avec captures, explications, points clés, technologies, lien vers le code et navigation précédent / suivant. Chaque page a son propre lien, qu'on peut partager.
- **4 thèmes** : Plan (clair), Nuit, Phosphore (CRT vert) et Ambre. On passe de l'un à l'autre par une transition circulaire, et le choix est mémorisé.
- **Une liste de projets filtrable**, avec un aperçu qui suit le curseur.
- **Une palette de commandes** (<kbd>Ctrl</kbd>+<kbd>K</kbd>) pour aller à un projet, une section, un thème ou copier l'email.
- **Un terminal** (<kbd>`</kbd>) avec les commandes `ls`, `cat breach`, `open frixx`, `repo recon`, `theme nuit`, `goto contact`…
- Le raccourci <kbd>T</kbd> change de thème, et un code Konami est caché quelque part.
- Le site est utilisable au clavier et respecte `prefers-reduced-motion`. La carte réseau s'arrête quand elle sort de l'écran.

## Lancer en local

```bash
npm install
npm run dev
npm run build
```

## Structure

```
index.html        squelette de la page
src/data.js       TOUT le contenu : projets, parcours, compétences, contact
src/app.js        point d'entrée
src/network.js    carte réseau du héro (canvas)
src/projects.js   liste filtrable, aperçu au survol, pages projet
src/theme.js      thèmes et transition
src/palette.js    palette de commandes
src/terminal.js   terminal
src/fx.js         titre décodé, apparitions, navigation, parcours
src/style.css     styles et variables des thèmes
public/assets/    captures des projets
```

**Ajouter un projet** : ajoute une entrée dans `PROJECTS` (`src/data.js`) et sa capture dans `public/assets/`. La carte, la liste, la page projet, la palette et le terminal se mettent à jour tout seuls.

**Ajouter un thème** : ajoute un bloc `[data-theme="…"]` dans `src/style.css` et une entrée dans `THEMES` (`src/theme.js`).

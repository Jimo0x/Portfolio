# Portfolio de Julio Dahou

Portfolio de **Julio Dahou**, spécialiste cybersécurité et développeur (Cotonou, ouvert au remote).

## Ce qu'on y trouve

- **Un seul thème, noir et rouge** : Sora pour les titres et le texte, Bitcount (police pixel) pour les étiquettes, et des sections numérotées.
- **Une carte réseau interactive en ouverture** : chaque projet est un hôte relié à « julio ». Le survol isole un nœud, le clic ouvre le projet.
- **Une constellation rouge en fond de page**, avec des lignes de guide et un menu vertical à droite (en bas sur mobile).
- **Des chiffres clés animés**, **des cartes projet** (filtrables, avec balayage lumineux au survol), **un carrousel de services** et **des compétences qui défilent**.
- **Une page par projet** (`#projet-<id>`) avec un lien partageable.
- **Une palette de commandes** (<kbd>Ctrl</kbd>+<kbd>K</kbd>) et **un terminal** (<kbd>`</kbd>).
- **Des animations** : ouverture en rideau, titre qui se déchiffre, bouton à texte circulaire, curseur réactif, boutons magnétiques, titres qui montent depuis un masque, barre de progression et signature géante en pied de page.
- Le site est utilisable au clavier et respecte `prefers-reduced-motion`.

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
src/palette.js    palette de commandes
src/terminal.js   terminal
src/fx.js         titre décodé, chiffres clés, services, navigation, parcours
src/motion.js     ouverture, curseur, constellation, bandeaux, titres masqués, signature
src/style.css     styles et variables des thèmes
public/assets/    captures des projets
```

**Ajouter un projet** : ajoute une entrée dans `PROJECTS` (`src/data.js`) et sa capture dans `public/assets/`. La carte, la liste, la page projet, la palette et le terminal se mettent à jour tout seuls.

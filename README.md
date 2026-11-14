# Portfolio de Julio Dahou

Portfolio de **Julio Dahou**, spécialiste cybersécurité et développeur (Cotonou, ouvert au remote).

## Ce qu'on y trouve

Le site est pensé comme le poste de travail d'un opérateur sécurité : noir, rouge carmin et blanc cassé, **Chakra Petch** pour les titres et **JetBrains Mono** pour tout ce qui sort d'une machine.

- **Démarrage** : une courte séquence de boot (`[ ok ] chargement du noyau`…), une fois par visite.
- **Titres caviardés** : une partie de chaque titre est cachée sous une barre rouge qui se retire, comme un document déclassifié.
- **Carte réseau interactive** : chaque projet est un hôte relié à « julio ». Clique sur un nœud pour ouvrir le projet.
- **Barre latérale repliable** à gauche : icônes seules ou icônes + libellés (bouton ou touche <kbd>[</kbd>), sections, outils, progression de lecture et heure à Cotonou. Sur mobile, elle s'ouvre en tiroir.
- **Rapport** : les chiffres clés sortent comme un rapport de scan, avec des barres qui se remplissent.
- **Projets dans des fenêtres** : chaque capture est présentée en couleur dans une fenêtre qui s'incline vers le curseur et fait défiler la page au survol. Le premier projet est mis en vedette.
- **Services dans une console** : on choisit une commande, la réponse s'écrit.
- **Compétences en scan de ports** (`1379/tcp ouvert Python`).
- **Contact en poignée de main TCP** : SYN, SYN-ACK, ACK, puis l'email.
- **Pages projet** avec lien partageable (`#projet-<id>`), **palette de commandes** (<kbd>Ctrl</kbd>+<kbd>K</kbd>) et **terminal** (<kbd>`</kbd>).
- Utilisable au clavier, respecte `prefers-reduced-motion`.

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
src/fx.js         titre décodé, rapport, console des services, scan, barre d'état, parcours
src/motion.js     démarrage, curseur, bandeau, titres masqués, signature
src/style.css     styles (un seul thème)
public/assets/    captures des projets
```

**Ajouter un projet** : ajoute une entrée dans `PROJECTS` (`src/data.js`) et sa capture dans `public/assets/`. La carte, la liste, la page projet, la palette et le terminal se mettent à jour tout seuls.

## Pages et partage

Le site est multi-pages : accueil, `/projets/`, une page par projet (`/projets/<id>/`), `/services/`, `/a-propos/`, `/contact/` et une page 404.
Les pages sont générées depuis `src/data.js` par `scripts/pages.mjs` (`npm run pages`, lancé aussi par `npm run build`).

Chaque page a ses métadonnées de partage (Open Graph, Twitter, données structurées) et sa propre image en pixel art (1200 x 630, dans `public/og/`).
Pour les régénérer après une modification des projets : `npm run og` (Python 3 et Pillow).

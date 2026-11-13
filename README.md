# Portfolio — Julio Dahou

Portfolio single-page de **Julio Dahou**, spécialiste cybersécurité et développeur logiciel (Cotonou, ouvert au remote).

## Fonctionnalités

- Layout single-page avec dock de navigation façon GNOME, scrollspy et barre de progression
- Fond animé (tsparticles) et révélations au scroll, désactivés si `prefers-reduced-motion`
- **Mode terminal** : une console interactive pour explorer le portfolio en ligne de commande
  (bouton `>_` du dock, touche <kbd>`</kbd> ou <kbd>Ctrl</kbd>+<kbd>K</kbd>)

```text
julio@portfolio:~$ help
julio@portfolio:~$ ls
julio@portfolio:~$ cat breach
julio@portfolio:~$ open safe-install
julio@portfolio:~$ goto contact
```

Complétion avec <kbd>Tab</kbd>, historique avec <kbd>↑</kbd>/<kbd>↓</kbd>.

## Lancer en local

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production dans dist/
```

## Structure

```
index.html          contenu de la page
src/app.js          scroll, scrollspy, révélations
src/terminal.js     mode terminal (commandes + interface)
src/particles.js    fond animé
src/style.css       thème noir / blanc / vert néon
public/assets/      captures des projets
```

Pour ajouter un projet au terminal, ajoute une entrée dans `PROJECTS` (`src/terminal.js`).

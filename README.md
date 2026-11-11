# NEO ARCADE

**Play beyond limits.** Une mini-arcade futuriste, responsive et installable, conçue pour iPhone, iPad, Mac et PC.

## Jeux inclus

- **REACTION** — mesure tes réflexes en millisecondes.
- **MEMORY** — retrouve les huit paires de symboles.
- **NUMBER RUSH** — clique sur les nombres de 1 à 16 le plus vite possible.

## Progression

- XP, niveaux et records.
- Six succès à débloquer.
- Son activable/désactivable.
- Sauvegarde locale sur l'appareil via `localStorage`.

## Démarrer

Aucune dépendance, aucun compte et aucun serveur de jeu ne sont nécessaires. Tous les fichiers de l'application sont locaux.

Pour tester en développement, utilise un serveur HTTP local (par exemple l'extension Live Server de VS Code). Le service worker ne fonctionne pas en ouvrant directement le fichier `index.html` avec `file://`.

## Publier avec GitHub Pages

1. Ouvre **Settings** dans ce dépôt GitHub.
2. Va dans **Pages**.
3. Dans **Build and deployment**, choisis **Deploy from a branch**.
4. Choisis la branche `main` et le dossier `/(root)`, puis sauvegarde.
5. Attends la publication, puis ouvre l'adresse GitHub Pages fournie.

Si GitHub Pages n'est pas proposé pour ce dépôt privé, vérifie les options de ton compte GitHub ou utilise un hébergement HTTPS compatible.

## Installer et jouer hors ligne

1. Ouvre le site publié une première fois avec une connexion Internet.
2. Attends que le cache hors ligne soit activé.
3. Sur iPhone/iPad : Safari → Partager → **Sur l'écran d'accueil**.
4. Sur Mac/PC : utilise l'option d'installation proposée par le navigateur (si disponible).

Après le premier chargement réussi, l'application et les trois jeux peuvent fonctionner sans Wi-Fi.

## À savoir

- Les XP, records et succès sont enregistrés **séparément sur chaque appareil**. Ils ne se synchronisent pas automatiquement entre iPhone, Mac et PC.
- Effacer les données du navigateur peut supprimer la progression locale.
- Le premier accès et la première mise en cache nécessitent Internet.
- Aucun service externe, aucune police distante et aucune image distante ne sont utilisés.

## Structure

```
index.html
styles.css
app.js
manifest.webmanifest
sw.js
assets/
  icon.svg
  icon-192.svg
  icon-512.svg
```

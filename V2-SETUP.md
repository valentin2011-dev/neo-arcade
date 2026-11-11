# NEO ARCADE V2 — guide du projet

## Version actuelle sur `v2-foundation`

NEO ARCADE est une mini-arcade web installable (PWA), pensée pour ordinateur, tablette et mobile.

### Fonctionnalités présentes
- REACTION : test de temps de réaction.
- MEMORY : jeu de paires.
- NUMBER RUSH : cliquer les nombres dans l'ordre.
- NEON SNAKE : Snake sur grille, commandes clavier et tactiles.
- NEON AIM : cliquer les cibles pendant 20 secondes.
- Battle local : duel à deux joueurs sur le même appareil, chacun son tour.
- Progression locale : XP, niveaux, records et succès.
- Personnalisation : avatars, thèmes, effet RGB et fond d'écran personnel.
- Page de records et panneau de progression personnel.
- Mise en cache PWA pour le lancement hors ligne après un premier chargement réussi.

### Données et mode hors ligne
La progression et les préférences sont enregistrées dans le stockage local du navigateur. Elles restent propres à chaque navigateur/appareil : aucune synchronisation entre appareils n'est activée par défaut.

Le fond d'écran est stocké localement et limité à 2,5 Mo. Pour éviter de saturer le stockage, privilégier une image compressée.

### Backend Supabase (facultatif, non requis pour jouer)
Le dépôt conserve le schéma SQL et le code d'intégration préparatoire. Pour activer les comptes et la synchronisation, il faut configurer les variables publiques du projet dans un fichier local `config.js` à partir de `config.example.js`. Ne jamais ajouter de clé `service_role` ou une clé secrète dans le navigateur ou dans GitHub.

Le fichier `config.js` n'est pas fourni dans le dépôt. Sans cette configuration, les jeux locaux restent utilisables et aucune connexion cloud n'est disponible.

### Fonctionnalités non terminées
- Battle en ligne entre deux appareils.
- Classement mondial partagé entre joueurs.
- Synchronisation cloud prête à l'emploi et validée de bout en bout.
- Tests complets sur appareils réels et navigateurs.

### Mise en service et vérification
1. Héberger le dépôt sur un serveur HTTPS (par exemple GitHub Pages).
2. Ouvrir le site une première fois en ligne pour télécharger les ressources.
3. Installer la PWA depuis le navigateur compatible.
4. Tester chaque jeu, les commandes tactiles, les records et le mode hors ligne.
5. Vérifier les mises à jour du service worker après chaque nouvelle version.

**État qualité :** les modifications doivent encore être testées sur de vrais appareils. Ne pas considérer cette branche comme une version de production tant que les tests fonctionnels et hors ligne ne sont pas passés.

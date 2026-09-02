# runtime-tests.md

Contrôles qui demandent un œil humain, à dérouler **à la maison** après un `git pull`, sur le serveur de dev (`npm run dev`).

Avant de lire cette liste, lancer `npm run generate && npm run smoke` : une trentaine de contrôles y passent déjà dans un Chrome headless — console propre sur les dix routes, résolution des composants Vuetify, icônes SVG, tiroir mobile, menu de réglages, persistance du thème, navigation, bascule de langue, balises SEO, mouvement réduit, recadrage des vignettes, graisse des `<strong>`, grille des compétences, absence de requête publicitaire. Ce qui suit est ce que la machine ne peut pas juger.

**Mode d'emploi**

- Un point validé se **supprime** — l'historique git garde la trace.
- Un point qui échoue se signale plutôt que de se cocher.
- 🔴 **Bloquant** : interdit le merge de `dev` vers `main`.

---

## 🔴 Bloquants

### 1. Image manquante pour la carte wikiwa

`public/images/portfolio/wikiwa.webp` n'existe pas. L'entrée est déclarée dans `src/components/Projects.vue`.

- **À faire** : capture de wikiwa.com, export en `.webp`, dépôt à ce chemin.
- **Symptôme si oublié** : première carte du portfolio en image cassée.

---

## Jugement visuel

### 2. Le saut au chargement du héros

C'était le défaut que tu avais repéré. L'état initial est maintenant posé en CSS et non plus par GSAP après le premier rendu.

- **À faire** : recharger `/` plusieurs fois, dont une fois cache vidé et réseau bridé (onglet Réseau, profil « Fast 3G »). Le contenu du héros doit rester invisible puis apparaître en fondu — jamais s'afficher, disparaître, puis réapparaître.

### 3. Ombre portée du texte du héros

Le `text-shadow` visait des `id` inexistants : il n'a jamais été appliqué jusqu'ici. Tu le découvres donc pour la première fois.

- **À faire** : juger la lisibilité du texte blanc sur la photo, en clair et en sombre, et dire si l'ombre est trop marquée.

### 4. Rythme des apparitions au scroll

Les cinq animations par section, chacune avec son délai, sont remplacées par un `stagger` unique plus un zoom sur l'illustration.

- **À faire** : dérouler l'accueil lentement. Juger si la cascade est trop rapide, trop lente, ou bien réglée.

### 5. Parallaxe et navigations répétées

Les animations sont encapsulées dans un `gsap.context()` révoqué au démontage ; elles s'accumulaient auparavant à chaque retour sur l'accueil.

- **À faire** : vérifier que le fond du héros défile plus lentement que le contenu, puis faire quatre ou cinq allers-retours `/` ↔ `/about` et confirmer l'absence de ralentissement progressif.

---

## Ce que la machine ne peut pas atteindre

### 6. Langue des deux CV téléchargeables

Les PDF ne portent aucune métadonnée de langue : l'association repose sur le suffixe des fichiers d'origine, invérifiable sans les ouvrir.

- **À faire** : télécharger le CV depuis le pied de page en français, vérifier qu'il est en français. Recommencer en anglais.

### 7. Envoi réel du formulaire

`smoke.mjs` vérifie la présence du formulaire et de sa mention, pas l'acheminement.

- **À faire** : envoyer un message de test et confirmer sa réception par courriel.

### 8. Aperçus de partage

C'est la raison d'être du prérendu, et elle ne se vérifie qu'une fois le site en ligne — les robots des réseaux sociaux lisent l'URL publique.

- **À faire, après déploiement** : passer `https://www.renaudbresson.dev/projects` et `https://www.renaudbresson.dev/en/about` dans le [post inspector LinkedIn](https://www.linkedin.com/post-inspector/) et le [validateur Facebook](https://developers.facebook.com/tools/debug/). Chaque URL doit afficher **son propre** titre et sa propre description, pas ceux de l'accueil.
- **Symptôme** : le titre de l'accueil sur toutes les pages — le prérendu n'aurait pas été déployé, ou l'hébergeur ne sert pas `dist/<route>/index.html`.

### 9. Configuration de l'hébergeur

Le prérendu produit `dist/about/index.html`, `dist/en/about/index.html`, etc. La plupart des hébergeurs statiques les servent automatiquement sur `/about` et `/en/about`, mais un repli SPA trop agressif renverrait `index.html` pour tout et annulerait le bénéfice.

- **À faire** : après déploiement, `curl -s https://www.renaudbresson.dev/en/about | grep -o '<title>[^<]*'` doit renvoyer le titre anglais, pas celui de l'accueil.

### 10. Déployer avec `generate`, pas `build`

`npm run build` ne prérend rien. La commande de déploiement est désormais **`npm run generate`**.

- **À faire** : mettre à jour le script ou la procédure de déploiement, et le vérifier au point 9.

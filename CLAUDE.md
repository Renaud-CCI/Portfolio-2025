# CLAUDE.md

Ce fichier guide Claude Code (claude.ai/code) sur ce dépôt.

Langue : répondre en français. Le code, les identifiants et les clés de traduction restent en anglais ; les commentaires du dépôt sont en français, et rares — un commentaire qui reformule la ligne suivante n'a pas sa place.

## Contexte de travail

Le code est écrit depuis une machine distante. Les dépendances y sont installées et **toute la chaîne d'outils s'exécute**, navigateur headless compris.

**À lancer avant de rendre la main :**

```sh
npm run type-check   # types, .vue inclus
npm run lint         # ESLint
npm run generate     # build + prérendu des 14 routes
npm run smoke        # ~45 contrôles dans un Chrome headless, sur dist/
```

`npm run smoke` couvre la console des quatorze routes, la résolution des composants Vuetify, les icônes, le tiroir mobile, le menu de réglages, la persistance du thème, la navigation, la bascule de langue, les balises SEO, le mouvement réduit et les corrections visuelles. Il exige un `dist/` à jour : lancer `generate` avant.

**Ce qui reste hors de portée :** le jugement visuel (une ombre est-elle trop marquée, une animation trop lente), les appareils réels, les navigateurs autres que Chromium, et tout service externe réellement appelé — le script qui reçoit le formulaire, l'API ecoindex, les robots des réseaux sociaux.

Conséquences :

- Exécuter les quatre commandes, ne pas les proposer.
- Distinguer « compile », « les contrôles passent » et « c'est beau ». Le troisième ne se constate pas ici.
- Quand un doute porte sur un comportement observable, **écrire un contrôle dans `scripts/smoke.mjs`** plutôt que de le renvoyer à l'humain. Ce qui subsiste va dans [`runtime-tests.md`](runtime-tests.md).

## runtime-tests.md

Liste des contrôles qui demandent un œil humain, à dérouler après un `git pull`. Une entrée validée s'y **supprime** — l'historique git garde la trace. Un point bloquant interdit le merge de `dev` vers `main`.

Avant d'y ajouter une entrée, se demander si un contrôle Puppeteer ne ferait pas le travail.

## Branches

- `main` — production, déployée sur https://www.renaudbresson.dev
- `dev` — branche de travail, mergée quand `runtime-tests.md` n'a plus de bloquant.

## Commandes

```sh
npm ci               # installation à l'identique du lockfile
npm run dev          # serveur Vite
npm run build        # type-check + build vite, en parallèle via npm-run-all2
npm run generate     # build puis prérendu — c'est la commande de déploiement
npm run smoke        # contrôles navigateur sur dist/
npm run type-check   # vue-tsc --build
npm run lint         # eslint . --fix (écrit dans les fichiers : vérifier git status après)
npm run format       # prettier --write src/
```

Aucun framework de test unitaire n'est configuré. `smoke.mjs` est un script, pas une suite : ne pas inventer de commande `test`.

## Architecture

### Deux systèmes de style, et deux pièges

Vuetify 3 fournit les composants, les icônes et la palette (`src/plugins/vuetify.ts`) ; Tailwind v4 fournit la mise en page et la typographie.

**Piège 1 — les couches CSS.** Tailwind v4 émet ses utilitaires dans `@layer utilities`. Vuetify livre du CSS **sans couche**. En CSS, une règle hors couche l'emporte sur toute règle en couche, quelle que soit la spécificité. Donc **un utilitaire Tailwind posé sur un composant Vuetify est ignoré dès que Vuetify définit la même propriété** — silencieusement, la classe est bien présente dans le DOM. C'est ce qui neutralisait `border-b-2 border-amber-500` sur le lien de navigation actif. Pour styler un composant Vuetify, passer par du CSS `scoped` (hors couche, donc gagnant) ou par les props du composant, pas par un utilitaire Tailwind.

**Piège 2 — le mode sombre est résolu deux fois.** Le thème Vuetify est basculé depuis le menu engrenage d'`App.vue` et persisté en `localStorage`, tandis que les variantes `dark:` de Tailwind suivent uniquement `prefers-color-scheme`. Après une bascule manuelle, les liaisons `isDark` changent mais pas les `dark:`. Pour ce que le bouton doit affecter, utiliser le ternaire `isDark`.

`tailwind.config.ts` et `postcss.config.ts` sont des reliquats de la v3 : sans directive `@config` dans le CSS, la chaîne v4 ne les lit jamais.

### Langue : le chemin fait autorité

Pas de vue-i18n, pas de détection navigateur. `src/i18n.ts` initialise i18next en français ; **c'est l'URL qui détermine la langue** : `/about` en français, `/en/about` en anglais, via des `alias` de route et un `beforeEach` dans `src/router/index.ts`.

Ce choix est imposé par le prérendu — un fichier statique ne peut pas dépendre d'un `?lng=` — et par le SEO : rediriger selon `Accept-Language` enverrait Googlebot, qui explore en `en-US`, vers la version anglaise, et la française ne serait jamais indexée.

Conséquences pratiques :

- **Aucun lien interne ne s'écrit en dur.** Utiliser `useLocalePath()` (`src/composables/localePath.ts`) : `:to="localePath('/about')"`. Un `to="/about"` en dur ramène l'anglophone en français au premier clic.
- Les helpers purs sont dans `src/lang-path.ts`.
- Changer de langue est une navigation, pas un appel à `changeLanguage` : voir `changeLanguage` dans `App.vue`.

Chaque locale (`src/locales/fr`, `src/locales/en`) a un JSON par domaine, ré-exporté depuis son `index.ts` sous une clé égale au nom de fichier, le tout enregistré comme unique namespace `translation`. Les clés s'écrivent `nav.home`, `seo.about.title`, `portfolio.projects.pepe.title`.

Ajouter un fichier JSON impose d'éditer **les deux** `index.ts` — rien ne parcourt le dossier. Les tableaux (`about.timeline`, `about.skills`, `about.diplomas`) passent par `t(clé, { returnObjects: true })` puis un cast : garder les deux locales structurellement identiques, sinon le cast ment.

Une clé manquante n'échoue pas, elle s'affiche brute. Relire les deux locales après chaque ajout.

### Référencement et prérendu

`src/plugins/seo.ts` pose à chaque navigation le titre, la description, les balises OG et Twitter, la canonique et trois `alternate` (`fr`, `en`, `x-default`), depuis `locales/{fr,en}/seo.json` indexé sur le nom de route.

`scripts/prerender.mjs` sert `dist/` sur un serveur local, ouvre les quatorze routes dans Chromium et écrit le HTML rendu en `dist/<route>/index.html`. Il force `prefers-reduced-motion: reduce` : les animations d'entrée masquent les éléments avant de les révéler, l'instantané serait sinon capturé à opacité nulle. Il vérifie enfin que `public/sitemap.xml` couvre exactement les routes rendues, et échoue sinon.

**Ajouter une route touche huit endroits** : le routeur (chemin + alias `/en/...`), `seo.json` en français et en anglais, `public/sitemap.xml`, le tableau `ROUTES` de `scripts/prerender.mjs`, celui de `scripts/smoke.mjs` — ce sont deux tableaux distincts — et les tableaux `links` d'`App.vue` et de `Footer.vue`.

Exception assumée : `/legal` et `/privacy` ne figurent que dans `Footer.vue`, dans une seconde rangée plus discrète. Les ajouter à `App.vue` les mettrait dans la barre du haut et dans le tiroir mobile, où elles n'ont rien à faire — et casserait le contrôle « tiroir ouvert avec ses liens » qui attend cinq entrées.

### Routage et composants

`src/components/` contient les vues de page et les fragments partagés — il n'y a pas de dossier `views/`. `Home.vue` est importé en dur ; les autres sont différés. `Footer.vue` est hors du `<RouterView>`.

### Animations

Tout est dans `Home.vue`. L'état initial masqué est posé en **CSS** via la classe `anim-pending`, levée quand GSAP est prêt ou si son import échoue : GSAP arrivant en import différé, poser cet état en JavaScript produisait un saut visible au chargement. Les sections animées portent `data-animate`, les éléments `.anim-item` et `.anim-image`. Le tout est encapsulé dans un `gsap.context()` révoqué au démontage, et `prefers-reduced-motion` désactive l'ensemble sans rien masquer.

Ne pas remonter GSAP en import statique : il resterait hors du bundle initial pour rien.

### Ajouter un projet au portfolio

1. `src/components/Projects.vue` — entrée dans le tableau `projects` (`id`, `image`, `link`, `github` ; chaîne vide = bouton GitHub masqué).
2. `src/locales/{fr,en}/portfolio.json` — `projects.<id>` avec `title`, `description`, `descriptionLong`.
3. `public/images/portfolio/<nom>.webp`.

L'`id` est la clé de jointure ; un décalage affiche la clé brute au lieu d'échouer.

### Éco-conception

Le pied de page injecte le badge ecoindex du CNUMR : la page est notée publiquement. Servir du `.webp`, poser `loading="lazy" decoding="async"` sous la ligne de flottaison, réserver `fetchpriority="high"` au héros. Les composants Vuetify sont importés à la demande par `vite-plugin-vuetify` — ne pas rétablir d'`import * as components`. Les icônes sont des tracés SVG (`@mdi/js`) et non une police : n'ajouter une icône qu'en l'important nommément.

Les PNG et le `.xcf` de `public/images/` sont les fichiers de travail de l'auteur. Ils ne sont référencés nulle part et ne pèsent donc pas sur l'ecoindex, mais `public/` étant copié tel quel dans `dist/`, ils sont déployés et publiquement accessibles. C'est assumé.

### Services externes

Le formulaire de contact poste vers l'URL `MAIL_ENDPOINT` de `src/legal.ts`. Une mention de traitement des données figure sous le bouton (`contact.privacy_notice`), suivie d'un lien vers `/privacy`. Le badge ecoindex charge un script depuis jsDelivr et appelle une API externe à chaque chargement — d'où des erreurs de console en local, que `smoke.mjs` filtre.

### Pages légales

`/legal` et `/privacy`, rendues par `Legal.vue` et `Privacy.vue` sur un même `LegalLayout.vue`, les lignes de définitions par `LegalRows.vue`.

**Les faits vérifiables vivent dans `src/legal.ts`, jamais dans les JSON** : identité de l'éditeur, SIRET, hébergeur, date de mise à jour, endpoint du formulaire. Les locales ne portent que ce qui se traduit — libellés, finalités, bases légales. La jointure entre les deux se fait par la clé `key` des entrées `privacy.processors.items` (`host`, `cdn`), pas par un indice de tableau.

Conséquence : corriger un SIRET ou changer d'hébergeur, c'est éditer un seul fichier. Mais **changer d'hébergeur change aussi le fond juridique** — un hébergeur hors UE impose de rétablir une section de transfert au titre de l'article 46 du RGPD dans les deux locales. Voir `runtime-tests.md`.

La section 12 de `smoke.mjs` lit `src/legal.ts` comme du texte pour vérifier trois choses qui bloquent le merge : SIRET renseigné, endpoint auto-hébergé conforme à ce qu'annonce la politique, image wikiwa présente. Ces échecs-là sont comptés séparément des régressions.

## Conventions

Prettier : pas de point-virgule, guillemets simples, largeur 100. Alias `@/` → `src/`. Les composants de page déclarent `defineOptions({ name: 'XxxPage' })` avant leurs imports. Sujets de commit courts et en minuscules, souvent `verbe / sujet`.

## Points de vigilance

- Les `index.ts` de locales utilisent `import … assert { type: 'json' }`, déprécié au profit de `with`. Passe sans avertissement sur Vite 6.3.5 ; à surveiller lors d'une montée de version.
- `src/plugins/vuetify.ts` appelle `window.matchMedia` au niveau module. Sans conséquence avec le prérendu Puppeteer, qui exécute un vrai navigateur, mais rédhibitoire pour un rendu serveur Node.
- Le prérendu suppose un Chromium téléchargé par Puppeteer. Sur une machine ou un CI sans lui, `npm run generate` échoue — `npm run build` reste utilisable, au prix des aperçus de partage.

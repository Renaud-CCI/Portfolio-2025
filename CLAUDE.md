# CLAUDE.md

Ce fichier guide Claude Code (claude.ai/code) sur ce dépôt.

Langue : répondre en français. Le code, les identifiants et les clés de traduction restent en anglais ; les commentaires du dépôt sont en français.

## Contexte de travail : développement à l'aveugle

Le code est écrit depuis une machine qui **ne peut rien exécuter** : `node_modules` n'y est pas installé, il n'y a ni serveur de dev, ni navigateur, ni capture d'écran. Les tests runtime ont lieu **ailleurs**, après un `git pull` sur le PC perso, sur serveur de dev.

Conséquences, non négociables :

- Ne jamais écrire qu'un rendu, une animation, un thème ou un comportement navigateur « fonctionne » : rien n'a été vu. Dire ce qui a été écrit, et ce qui reste à vérifier.
- Ce qui est réellement vérifiable ici : la lecture du code, la cohérence des clés i18n, les chemins d'assets, la logique TypeScript. Rien de plus.
- Terminer toute modification non triviale par une liste **« À vérifier au pull »** : les points précis à regarder sur le serveur de dev, formulés comme des actions (« ouvrir /projects en mode sombre, vérifier que les cartes… »).
- Si une vérification statique devient indispensable, `npm install` puis `npm run type-check` reste possible ici — mais c'est un choix à proposer, pas à faire d'office.

## Branches

- `main` — production, déployée sur https://www.renaudbresson.dev
- `dev` — branche de travail. Tout part d'ici ; `main` n'est touchée qu'après validation runtime.

## Commandes

```sh
npm install          # non installé par défaut sur la machine d'écriture
npm run dev          # serveur Vite
npm run build        # type-check (vue-tsc) + build vite, en parallèle via npm-run-all2
npm run build-only   # build sans type-check
npm run type-check   # vue-tsc --build
npm run lint         # eslint . --fix  (attention : écrit toujours dans les fichiers)
npm run format       # prettier --write src/
```

Aucun framework de test n'est configuré — ne pas inventer de commande de test.

## Architecture

### Deux systèmes de style, et le piège du mode sombre

L'application fait tourner **Vuetify 3 et Tailwind v4 côte à côte**. Vuetify fournit les composants (`v-btn`, `v-dialog`, `v-app-bar`), le jeu d'icônes mdi et la palette teal/ambre définie dans `src/plugins/vuetify.ts`. Tailwind fournit toute la mise en page et la typographie dans les templates.

Le mode sombre est donc résolu deux fois, et les deux chemins divergent :

- Le thème Vuetify est basculé à la main depuis le menu engrenage de `App.vue` (`theme.global.name.value`), initialisé sur `prefers-color-scheme` à la fois dans le `onMounted` de `App.vue` et dans `plugins/vuetify.ts`. Les composants le lisent via `const isDark = computed(() => theme.global.current.value.dark)` et branchent avec `:class="isDark ? 'bg-gray-900 …' : 'bg-gray-100 …'"`.
- Les variantes `dark:` de Tailwind suivent uniquement `prefers-color-scheme`.

Après un basculement manuel, les liaisons `isDark` changent mais pas les utilitaires `dark:`. Pour tout ce que le bouton doit affecter, préférer le ternaire `isDark` à la variante `dark:`. Le choix manuel n'est par ailleurs pas persisté au rechargement, contrairement à la langue (cache cookie/localStorage).

Tailwind v4 passe par `@tailwindcss/vite` et `@import 'tailwindcss'` dans `src/assets/main.css`. `tailwind.config.ts` et `postcss.config.ts` sont des reliquats de la v3 : sans directive `@config` dans le CSS, la chaîne v4 ne les lit jamais.

### i18n — i18next, pas vue-i18n

`src/i18n.ts` initialise i18next avec `fallbackLng: 'fr'` et un ordre de détection querystring → cookie → localStorage → navigator. Chaque dossier de locale (`src/locales/fr`, `src/locales/en`) contient un JSON par domaine, ré-exporté depuis son `index.ts` sous une clé égale au nom de fichier, l'ensemble étant enregistré comme unique namespace `translation`. Les clés s'écrivent donc `nav.home`, `portfolio.projects.pepe.title`, `services.items.<clé>.description`.

Ajouter un fichier JSON impose d'éditer **les deux** `index.ts` (`fr` et `en`) — rien ne parcourt le dossier automatiquement. Les tableaux (`about.timeline`, `about.diplomas`) sont récupérés avec `t(clé, { returnObjects: true })` puis castés : garder les deux locales structurellement identiques, sinon le cast ment.

Les composants utilisent `const { t } = useTranslation()` de `i18next-vue`. `main.ts` répercute la langue active sur `document.documentElement.lang`.

Vigilance à l'aveugle : une clé manquante ou mal orthographiée n'échoue pas, elle affiche la clé brute. Relire les deux locales après chaque ajout.

### Routage et composants

`src/components/` contient à la fois les vues de page et les fragments partagés — il n'y a pas de dossier `views/`. `Home.vue` est importé en dur par le routeur ; `About`, `Projects`, `Services`, `Contact` sont en import différé. `Footer.vue` est hors du `<RouterView>`, dans `App.vue`. Le `scrollBehavior` de `src/router/index.ts` décale les ancres de 60px pour l'app bar fixe.

Ajouter une route touche quatre endroits : le routeur, le tableau `links` de `App.vue`, la navigation de `Footer.vue`, et `public/sitemap.xml`.

### Ajouter un projet au portfolio

Deux fichiers et un asset :

1. `src/components/Projects.vue` — ajouter une entrée au tableau `projects` codé en dur (`id`, `image`, `link`, `github` ; chaîne vide = bouton GitHub masqué).
2. `src/locales/{fr,en}/portfolio.json` — ajouter `projects.<id>` avec `title`, `description`, `descriptionLong`.
3. `public/images/portfolio/<nom>.webp`.

L'`id` est la clé de jointure entre le tableau et les traductions ; un décalage affiche la clé brute au lieu d'échouer.

### Contraintes d'éco-conception

L'historique git porte un travail assumé d'allègement, et `Footer.vue` injecte le badge ecoindex du CNUMR : la page est notée publiquement. Suivre les conventions en place — servir du `.webp` (les `.png` d'origine sont conservés mais non référencés), poser `loading="lazy" decoding="async"` sur tout ce qui est sous la ligne de flottaison, réserver `fetchpriority="high"` au héros. `ScrollTrigger` de GSAP est volontairement importé dynamiquement dans le `onMounted` de `Home.vue` pour rester hors du bundle initial : ne pas le remonter en import statique.

### Services externes et contenu statique

Le formulaire de contact poste directement vers Formspree (`src/components/Contact.vue`) ; il n'y a pas de backend. `index.html` porte le script AdSense et l'intégralité du bloc SEO — la SPA ne pose aucune meta par route, donc `index.html`, `public/sitemap.xml` et `public/robots.txt` se maintiennent à la main.

Les CV servis par le site sont `public/RenaudBresson_CV_{fr,en}.pdf`, choisis selon la langue active par `src/composables/cv.ts`. Les mettre à jour = remplacer ces deux fichiers.

## Conventions

Prettier : pas de point-virgule, guillemets simples, largeur 100 (`.prettierrc.json`, `.editorconfig`). Alias d'import `@/` → `src/`. Les composants de page déclarent `defineOptions({ name: 'XxxPage' })` avant leurs imports. Sujets de commit courts et en minuscules, souvent `verbe / sujet` (`update / cv`, `fix / add download_cv in Footer`).

## À vérifier au pull

Point connu, non vérifié en environnement d'exécution :

- Les `index.ts` de locales utilisent la syntaxe `import … assert { type: 'json' }`, dépréciée au profit de `with`. Elle passe aujourd'hui par la chaîne Vite ; à surveiller lors d'une montée de version de Vite ou d'esbuild.

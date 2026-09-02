# runtime-tests.md

Contrôles qui exigent un navigateur, à dérouler **à la maison** après un `git pull`, sur le serveur de dev (`npm run dev`).

Le code de ce dépôt est écrit depuis une machine sans navigateur : le type-check, le build et le lint y passent, mais rien n'y est jamais vu. Ce fichier est le relais entre les deux postes.

**Mode d'emploi**

- Un point validé se **supprime** du fichier — la liste ne contient que ce qui reste à faire, l'historique git garde la trace.
- Un point qui échoue se signale plutôt que de se cocher.
- 🔴 **Bloquant** : interdit le merge de `dev` vers `main`.

---

## 🔴 Bloquants

### 1. Image manquante pour la carte wikiwa

Le fichier `public/images/portfolio/wikiwa.webp` n'existe pas. L'entrée est déclarée dans `src/components/Projects.vue`.

- **À faire** : produire une capture de wikiwa.com, l'exporter en `.webp` et la déposer à ce chemin. Le format des autres cartes fait foi (voir `public/images/portfolio/`).
- **Symptôme si oublié** : la première carte du portfolio affiche une image cassée, sur la page la plus en avant du site.

---

## Contrôles fonctionnels

### 2. Composants Vuetify après passage à l'import à la demande

`vite-plugin-vuetify` remplace l'import global de la bibliothèque (`import * as components`) par une résolution à la demande depuis les templates. **Le build ne peut pas prouver que la résolution est correcte** : un composant non résolu ne casse pas la compilation, il déclenche un avertissement Vue dans la console du navigateur et ne rend rien.

Les 19 composants à voir au moins une fois, avec l'endroit où les trouver :

| Composant | Où le vérifier |
|---|---|
| `v-app`, `v-main` | toute page s'affiche |
| `v-app-bar`, `v-toolbar-title` | barre supérieure |
| `v-app-bar-nav-icon` | icône hamburger, en dessous de `sm` |
| `v-navigation-drawer` | tiroir latéral ouvert par le hamburger |
| `v-menu`, `v-list`, `v-list-item`, `v-list-item-title`, `v-divider` | menu engrenage (thème et langue) |
| `v-btn` | partout |
| `v-icon` | engrenage, et les trois icônes du pied de page |
| `v-dialog`, `v-card`, `v-card-title`, `v-card-text`, `v-card-actions`, `v-spacer` | pop-up d'un projet, sur `/projects` |

- **À faire** : ouvrir la console du navigateur et parcourir le site. Rechercher tout message `Failed to resolve component`.
- **Symptôme** : un élément d'interface absent, sans erreur bloquante — le reste de la page continue de s'afficher normalement.

### 3. Icônes après suppression de la police Material Design

`@mdi/font` (403 ko de woff2) est remplacé par `@mdi/js` et le jeu `mdi-svg` : les icônes sont désormais des tracés SVG intégrés au bundle. Quatre icônes sont explicites dans le code, les autres passent par les alias internes de Vuetify.

- **À faire** : vérifier les quatre icônes explicites — l'**engrenage** de la barre supérieure, puis **LinkedIn**, **GitHub** et **l'enveloppe** dans le pied de page. Vérifier ensuite le **hamburger** en dessous de `sm`, qui passe lui par un alias Vuetify (`$menu`) et non par un import explicite.
- **Symptôme** : icône absente, carré vide, ou glyphe de remplacement à la place du pictogramme.
- **En cas d'échec** : `git revert` du commit « perf / remplace la police mdi par des tracés SVG » suffit à revenir en arrière, il est isolé.

### 4. Langue des deux CV téléchargeables

`public/RenaudBresson_CV_fr.pdf` et `public/RenaudBresson_CV_en.pdf` ont été remplacés par les impressions PDF des sources HTML. Ces fichiers ne portent aucune métadonnée de langue : l'association repose uniquement sur le suffixe des fichiers d'origine, invérifiable sans les ouvrir.

- **À faire** : basculer le site en français, télécharger le CV depuis le pied de page, vérifier qu'il est en français. Recommencer en anglais.
- **Symptôme** : les deux PDF sont intervertis.

### 5. Bloc « Compétences » de la page À propos

Nouveau markup introduit avec les contenus du CV 2026 (`src/components/About.vue`, liste `dl` alimentée par `about.skills`).

- **À faire** : ouvrir `/about` et vérifier que les six domaines s'affichent en deux colonnes (libellé à gauche, contenu à droite) au-dessus du point de rupture `md`, et empilés en une colonne en dessous.
- **Symptôme** : libellés et contenus qui se chevauchent, ou colonne de gauche écrasée.

### 6. Page Services après renommage de clé

La quatrième carte « Collaboration & freelance » a été remplacée par « Mise en production » (clé `collaboration` → `delivery`, `src/components/Services.vue`).

- **À faire** : ouvrir `/services`, compter quatre cartes, vérifier que la troisième est bien « Mise en production » et qu'aucune n'affiche une clé brute du type `services.items.delivery.title`.
- **Symptôme d'une clé non résolue** : le texte affiché est la clé elle-même, i18next n'échoue jamais bruyamment.

### 7. Les deux langues, sur les cinq pages

La refonte des contenus a touché les six fichiers de locale, en français comme en anglais.

- **À faire** : parcourir `/`, `/about`, `/projects`, `/services`, `/contact` en français, puis basculer en anglais et refaire le tour.
- **Symptôme** : une clé brute affichée à la place d'un texte, ou un paragraphe resté dans l'autre langue.

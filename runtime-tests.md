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

- **À faire** : produire une capture de wikiwa.com, l'exporter en `.webp` et la déposer à ce chemin.
- **Symptôme si oublié** : la première carte du portfolio affiche une image cassée.

---

## Animations de la page d'accueil

`Home.vue` a été repris en entier. Trois bugs y coexistaient : le sélecteur `section:not(#heroSection)` n'excluait rien (la section portait `ref=`, pas `id=`), le CSS `#heroTitle, #heroSubtitle…` ne s'appliquait à aucun élément pour la même raison, et l'état initial était posé par GSAP *après* le premier rendu, d'où le saut visible au chargement.

### 2. Plus de saut au chargement du héros

- **À faire** : recharger `/` plusieurs fois, dont une fois avec le cache vidé et le réseau bridé (onglet Réseau, profil « Fast 3G »). Le contenu du héros doit rester invisible puis apparaître en fondu — jamais s'afficher, disparaître, puis réapparaître.
- **Symptôme** : le saut que tu avais repéré.

### 3. Ombre portée du texte du héros

Le `text-shadow` visait des `id` inexistants : il n'a jamais été appliqué. Il l'est désormais via la classe `hero-text`, sur le titre, le sous-titre et le paragraphe — pas sur les boutons.

- **À faire** : vérifier la lisibilité du texte blanc sur la photo, en clair et en sombre.
- **Symptôme** : ombre trop marquée ou absente.

### 4. Apparition au scroll des quatre sections

Les animations par type d'élément (titre, sous-titre, paragraphe, bouton, chacun avec son propre délai et son propre ScrollTrigger) sont remplacées par un `stagger` unique sur les éléments marqués `.anim-item`, plus une animation d'échelle sur l'image `.anim-image`. Deux ScrollTriggers par section au lieu d'environ cinq.

- **À faire** : dérouler la page d'accueil lentement et vérifier que chaque section (À propos, Portfolio, Services, Contact) fait apparaître ses éléments en cascade, et son illustration en léger zoom.
- **Symptôme** : éléments qui restent invisibles, ou qui apparaissent tous d'un bloc.

### 5. Parallaxe et nettoyage à la navigation

Les animations sont désormais encapsulées dans un `gsap.context()` révoqué au démontage du composant — auparavant les ScrollTriggers s'accumulaient à chaque passage sur l'accueil.

- **À faire** : vérifier que l'image de fond du héros défile plus lentement que le contenu. Puis quitter vers `/about`, revenir sur `/`, et recommencer trois ou quatre fois : les animations doivent se rejouer normalement à chaque retour, sans ralentissement progressif.
- **Symptôme** : parallaxe figée après un aller-retour, ou page qui devient saccadée au fil des navigations.

### 6. Mouvement réduit

Nouveau comportement : si le système déclare `prefers-reduced-motion: reduce`, aucune animation ne se déclenche et rien n'est masqué.

- **À faire** : activer la réduction des animations dans Windows (Paramètres → Accessibilité → Effets visuels), recharger `/`, et vérifier que tout le contenu est visible immédiatement, sans animation.
- **Symptôme** : contenu resté invisible — ce serait le pire cas, le masquage sans l'animation qui le lève.

---

## Corrections visuelles

### 7. Soulignement de la page active

`border-secondary` n'existe pas en Tailwind (c'est un nom de couleur Vuetify) et sortait donc dans la couleur par défaut. Remplacé par `border-amber-500`.

- **À faire** : vérifier que l'onglet de la page courante est souligné en ambre dans la barre supérieure.

### 8. Vignettes du portfolio

`object-cover` manquait sur les cartes, alors que la pop-up l'avait.

- **À faire** : ouvrir `/projects` et vérifier que les huit vignettes sont recadrées, non étirées.

### 9. Pop-up projet

L'animation GSAP d'ouverture ne s'exécutait jamais : `ref` posé sur un composant Vuetify renvoie l'instance, pas l'élément DOM, et le `watch` se déclenchait avant le montage du contenu. Code supprimé au profit de la transition native de `v-dialog`, qui produit le même effet d'échelle.

- **À faire** : ouvrir puis fermer plusieurs cartes projet, vérifier que la pop-up s'ouvre avec une transition et que le contenu est le bon à chaque fois.

### 10. Mot en gras sur la page À propos

`base.css` appliquait `font-weight: normal` à `*`, ce qui neutralisait les balises `<strong>`. La règle est retirée.

- **À faire** : sur `/about`, vérifier que « RQTH » est bien en gras dans son paragraphe, et qu'aucun autre titre n'a changé de graisse ailleurs sur le site.
- **Symptôme** : un titre soudain plus gras que prévu — tous portent une classe Tailwind explicite, mais c'est le seul effet de bord possible.

### 11. Persistance du thème

Le choix clair/sombre n'était pas conservé : `onMounted` le réécrasait depuis la préférence système à chaque montage. Il est maintenant stocké en `localStorage`, avec repli sur la préférence système en l'absence de valeur.

- **À faire** : basculer en sombre, recharger la page, vérifier que le sombre est conservé. Recommencer en clair. Tester aussi en navigation privée, où l'écriture peut être refusée : le site doit fonctionner sans erreur, simplement sans mémoriser.

---

## Contrôles fonctionnels

### 12. Composants Vuetify après passage à l'import à la demande

`vite-plugin-vuetify` remplace l'import global par une résolution à la demande. **Le build ne peut pas prouver que la résolution est correcte** : un composant non résolu ne casse pas la compilation, il produit un avertissement console et ne rend rien.

| Composant | Où le vérifier |
|---|---|
| `v-app`, `v-main` | toute page s'affiche |
| `v-app-bar`, `v-toolbar-title` | barre supérieure |
| `v-app-bar-nav-icon` | icône hamburger, en dessous de `sm` |
| `v-navigation-drawer` | tiroir latéral ouvert par le hamburger |
| `v-menu`, `v-list`, `v-list-item`, `v-list-item-title`, `v-divider` | menu engrenage |
| `v-btn` | partout |
| `v-icon` | engrenage, et les trois icônes du pied de page |
| `v-dialog`, `v-card`, `v-card-title`, `v-card-text`, `v-card-actions`, `v-spacer` | pop-up projet |

- **À faire** : console ouverte, parcourir le site et rechercher tout `Failed to resolve component`.

### 13. Icônes après suppression de la police Material Design

`@mdi/font` (403 ko de woff2) est remplacé par `@mdi/js` et le jeu `mdi-svg`.

- **À faire** : vérifier l'**engrenage** de la barre supérieure, puis **LinkedIn**, **GitHub** et **l'enveloppe** du pied de page. Vérifier aussi le **hamburger**, qui passe par un alias Vuetify (`$menu`) et non par un import explicite.
- **En cas d'échec** : `git revert` du commit « perf / remplace la police mdi par des traces SVG », il est isolé.

### 14. Langue des deux CV téléchargeables

Les PDF ne portent aucune métadonnée de langue : l'association repose sur le suffixe des fichiers d'origine.

- **À faire** : télécharger le CV depuis le pied de page en français, vérifier qu'il est en français. Recommencer en anglais.

### 15. Mention de traitement des données du formulaire

Nouveau paragraphe sous le bouton d'envoi (`contact.privacy_notice`), dans les deux langues.

- **À faire** : ouvrir `/contact` en français puis en anglais et vérifier que la mention s'affiche et reste lisible en mode sombre.

### 16. Disparition d'AdSense

Le script `adsbygoogle` est retiré d'`index.html`.

- **À faire** : onglet Réseau, recharger, vérifier qu'aucune requête ne part vers `googlesyndication.com`.

### 17. Bloc « Compétences » de la page À propos

Liste `dl` alimentée par `about.skills`.

- **À faire** : vérifier l'affichage sur deux colonnes au-dessus de `md`, empilé en dessous.

### 18. Page Services après renommage de clé

- **À faire** : quatre cartes, la troisième étant « Mise en production », sans clé brute affichée.

### 19. Les deux langues, sur les cinq pages

- **À faire** : parcourir `/`, `/about`, `/projects`, `/services`, `/contact` en français puis en anglais.
- **Symptôme** : une clé brute affichée à la place d'un texte — i18next n'échoue jamais bruyamment.

---

## Référencement

`src/plugins/seo.ts` pose désormais titre, description, canonique et alternates de langue à chaque navigation et à chaque changement de langue. Les textes viennent de `src/locales/{fr,en}/seo.json`.

### 20. Titre et description par page

- **À faire** : naviguer entre les cinq pages et surveiller le titre de l'onglet, qui doit changer à chaque fois — « Réalisations — Renaud Bresson » sur `/projects`, « Contact — Renaud Bresson » sur `/contact`, etc. Vérifier ensuite dans l'inspecteur que `<meta name="description">` suit.
- **Symptôme** : titre figé sur celui de l'accueil, ou clé brute `seo.projects.title` affichée dans l'onglet.

### 21. Bascule de langue

- **À faire** : sur `/about`, basculer en anglais sans recharger. Le titre de l'onglet doit passer à « Background and skills — Renaud Bresson » immédiatement.
- **Symptôme** : le titre reste en français tant qu'on ne change pas de page.

### 22. Canonique et alternates

- **À faire** : dans l'inspecteur, sur `/about` en français, vérifier la présence de :
  - `<link rel="canonical" href="https://www.renaudbresson.dev/about">`
  - trois `<link rel="alternate">` en `fr`, `en` et `x-default`
  
  Basculer en anglais : la canonique doit devenir `.../about?lng=en`, les alternates rester identiques. Vérifier aussi qu'il n'y a **jamais plus de trois** balises `alternate` après plusieurs bascules successives.
- **Symptôme** : accumulation de balises `alternate` à chaque changement de langue.

### 23. Entrée directe par URL en anglais

- **À faire** : ouvrir `https://…/about?lng=en` dans un onglet privé. La page doit s'afficher en anglais dès le premier rendu, sans clic.
- **Symptôme** : page en français malgré le paramètre.

### 24. Sitemap

- **À faire** : ouvrir `/sitemap.xml` et `/robots.txt` sur le serveur de dev, vérifier qu'ils se servent bien et que le sitemap déclare dix URL.

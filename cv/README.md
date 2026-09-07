# cv/

Source des deux CV, hors du build Vite (jamais copiée dans `dist/`, donc pas servie
par le site — seuls les PDF le sont).

- `CV-Renaud-Bresson.html` (fr) et `CV-Renaud-Bresson-EN.html` (en) sont **la** source.
  Autonomes : ni image, ni police, ni feuille de style externe. Mise en page A4 par
  `@page { size: A4; margin: 0 }` et un padding interne en millimètres.
- Les modifier, jamais les PDF.

## Régénérer les PDF

```sh
npm run cv:pdf
```

Imprime les deux HTML dans `public/RenaudBresson_CV_{fr,en}.pdf` — les fichiers que
`src/composables/cv.ts` propose au téléchargement selon la langue active. Chrome
n'est pas nécessaire : le script passe par le Puppeteer déjà installé pour le
prérendu.

Le script **échoue** si un CV dépasse 297 mm de haut : le PDF se couperait au milieu
d'une expérience. Il affiche la hauteur mesurée à chaque impression, ce qui donne la
marge restante avant débordement.

Après régénération, les PDF sont modifiés dans l'arbre : ils se commitent avec le
HTML qui les a produits, et ne partent en ligne qu'au déploiement depuis `main`.

## Ce qui n'est pas ici

`CV-Renaud-2026-09.md`, à la racine du workspace, garde la trace des arbitrages de
contenu — ce qui a été retiré du CV et pourquoi. Volontairement hors du dépôt : ce
sont des notes de travail, et le dépôt est public.

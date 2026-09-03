# runtime-tests.md

Contrôles qui demandent un œil humain, à dérouler **à la maison** après un `git pull`, sur le serveur de dev (`npm run dev`).

Avant de lire cette liste, lancer `npm run generate && npm run smoke` : une quarantaine de contrôles y passent déjà dans un Chrome headless — console propre sur les quatorze routes, résolution des composants Vuetify, icônes SVG, tiroir mobile, menu de réglages, persistance du thème, navigation, bascule de langue, balises SEO, mouvement réduit, recadrage des vignettes, graisse des `<strong>`, grille des compétences, absence de requête publicitaire, et sur les pages légales : identité de l'éditeur et de l'hébergeur, nombre de traitements et de sous-traitants décrits, traduction réelle de la version anglaise, liens légaux du pied de page.

La **section 12 de `smoke.mjs`** reprend les trois bloquants ci-dessous et fait échouer la commande tant qu'ils tiennent. Ce ne sont pas des régressions, c'est ce journal vérifié par la machine : le message de sortie les distingue explicitement.

**Mode d'emploi**

- Un point validé se **supprime** — l'historique git garde la trace.
- Un point qui échoue se signale plutôt que de se cocher.
- 🔴 **Bloquant** : interdit le merge de `dev` vers `main`.

---

## 🔴 Bloquants

### 1. SIRET absent des mentions légales

`LEGAL.siret` est vide dans `src/legal.ts`. La ligne n'est alors pas affichée du tout — pas de libellé orphelin — mais l'identification légale d'une activité professionnelle est incomplète, et la note qui renvoie au répertoire SIRENE disparaît avec elle.

- **À faire** : renseigner les quatorze chiffres dans `src/legal.ts`. Un seul endroit, les deux langues suivent.
- **Contrôlé par** : `smoke.mjs`, section 12.

### 2. Le formulaire poste encore vers Formspree

C'est le point le plus important de la liste. Les pages légales décrivent **le traitement cible** : un script sur ton serveur, en France, sans prestataire tiers. Tant que `MAIL_ENDPOINT` pointe vers Formspree, la politique publiée est fausse — et sur un site dont le CV vend « RGPD (consentement, mentions légales) », c'est le pire endroit où se tromper.

- **À faire** : écrire le script PHP, le déployer, puis remplacer `MAIL_ENDPOINT` dans `src/legal.ts`.
- **Le script doit** : accepter le POST `name` / `email` / `message`, refuser les autres origines (CORS ou vérification du `Referer`), ne pas réinjecter l'entrée de l'utilisateur dans les en-têtes du courriel (injection d'en-tête), et rediriger vers une page de confirmation — le formulaire est un POST classique sans JavaScript, l'utilisateur quitte donc la page.
- **Point de conformité à tenir** : si le script écrit les messages dans un fichier ou une base plutôt que de les relayer seulement par courriel, cette copie-là doit être purgée comme le dit la politique. Voir aussi le point 5 pour les journaux.
- **Contrôlé par** : `smoke.mjs`, section 12.

### 3. Image manquante pour la carte wikiwa

`public/images/portfolio/wikiwa.webp` n'existe pas. L'entrée est déclarée dans `src/components/Projects.vue`.

- **À faire** : capture de wikiwa.com, export en `.webp`, dépôt à ce chemin.
- **Symptôme si oublié** : première carte du portfolio en image cassée.
- **Contrôlé par** : `smoke.mjs`, section 12.

---

## Décision d'hébergement prise le 2026-09-03

Les pages légales sont écrites pour **le VPS OVH**, site et script de contact sur la même machine. Conséquences à mettre en œuvre :

### 4. Basculer l'hébergement du portfolio sur le VPS

Le nom de domaine reste chez IONOS, seul l'enregistrement A change. Le site est aujourd'hui servi par Vercel, que les mentions légales ne nomment plus.

- **À faire** : conteneur nginx sur le VPS, enregistrement A de `www.renaudbresson.dev` vers son IP, certificat TLS.
- **Configuration nginx à reprendre telle quelle** : `try_files $uri $uri/index.html /index.html;`. C'est cette directive qui sert `dist/en/about/index.html` sur `/en/about` **et** assure le repli SPA. Sans le `$uri/index.html`, tout le prérendu est perdu et chaque page renvoie le titre de l'accueil.
- **Tant que ce n'est pas fait**, les mentions légales nomment un hébergeur qui n'est pas le bon. C'est le pendant du point 2 pour l'hébergement.

**Si tu changes d'avis** et restes sur Vercel : corriger `LEGAL.host` dans `src/legal.ts`, et surtout **rétablir dans les deux `legal.json` la section de transfert hors Union européenne** — l'entrée `privacy.processors.items` de clé `host` et la phrase d'introduction « aucune donnée n'est transférée hors de l'Union » deviennent fausses.

### 5. Journalisation du serveur : la politique annonce trente jours

Réglé pour les messages — la politique dit maintenant « supprimés dès que la demande est traitée, et au plus tard douze mois », ce qui correspond à ton habitude. Restent les journaux du serveur, seul engagement de la politique qui dépende d'une configuration et pas de toi.

**Aucune valeur par défaut ne donne trente jours.** Docker en `json-file` sans option ne fait *aucune* rotation : les journaux grossissent jusqu'à saturer le disque, c'est le piège classique du VPS qui tombe au bout de deux ans. Et le paquet nginx de Debian ou d'Ubuntu installe un `/etc/logrotate.d/nginx` en `daily` + `rotate 14`, soit quatorze jours. Dans les deux cas la phrase publiée est fausse.

**Aucune des deux solutions ci-dessous ne touche wikiwa.** `logrotate` n'est pas un réglage global : `/etc/logrotate.d/` est un dossier contenant un fichier par service, et chaque fichier ne s'applique qu'aux chemins qu'il nomme explicitement. De même, les options de journalisation Docker se posent par conteneur. Le seul geste à éviter est d'éditer `/etc/logrotate.d/nginx`, le fichier partagé posé par le paquet système.

- **Recommandé — ne pas journaliser l'adresse IP sur ce site.** Un `access_log off;`, ou un `log_format` sans `$remote_addr`, dans le nginx du portfolio. Plus de donnée personnelle dans les journaux, donc plus de durée à promettre ni de rotation à configurer : le traitement disparaît de la politique, qui en sort plus courte et plus solide. Coût : plus de `fail2ban` ici — ce site n'a ni compte, ni back-office, ni administration à forcer. Pour protéger le formulaire, un `limit_req` nginx suffit et ne lit aucun journal.
- **Si tu tiens aux IP** : écrire les journaux du portfolio dans un volume à lui (`/srv/portfolio/logs/`) et ajouter un `/etc/logrotate.d/portfolio` en `daily` + `rotate 30`.

Si tu choisis la première option, **préviens-moi** : il faut alors retirer le traitement « Journaux techniques du serveur » des deux `legal.json`, pas seulement changer la configuration du serveur.

---

## Relecture juridique

### 6. Deux affirmations que je n'ai pas pu vérifier

Elles sont plausibles mais posées sans preuve, et ce sont des mentions légales.

- **Franchise en base de TVA** (article 293 B du CGI) : exact par défaut en micro-entreprise, faux si tu as dépassé les seuils ou opté pour la TVA. Vérifier.
- **Adresse et téléphone d'OVH** : `2 rue Kellermann, 59100 Roubaix`, RCS Lille Métropole `424 761 419`, téléphone `1007`. À confronter aux mentions légales publiées par OVH.

### 7. Crédit de la photographie du héros

`public/images/forest-hero-sm.webp` n'est crédité nulle part. Si elle vient d'une banque d'images, la licence impose peut-être une attribution : l'ajouter à la section « Crédits et technologies » de `legal.json`. Si elle est de toi, rien à faire.

---

## Jugement visuel

### 8. Le saut au chargement du héros

C'était le défaut que tu avais repéré. L'état initial est maintenant posé en CSS et non plus par GSAP après le premier rendu.

- **À faire** : recharger `/` plusieurs fois, dont une fois cache vidé et réseau bridé (onglet Réseau, profil « Fast 3G »). Le contenu du héros doit rester invisible puis apparaître en fondu — jamais s'afficher, disparaître, puis réapparaître.

### 9. Ombre portée du texte du héros

Le `text-shadow` visait des `id` inexistants : il n'a jamais été appliqué jusqu'ici. Tu le découvres donc pour la première fois.

- **À faire** : juger la lisibilité du texte blanc sur la photo, en clair et en sombre, et dire si l'ombre est trop marquée.

### 10. Rythme des apparitions au scroll

Les cinq animations par section, chacune avec son délai, sont remplacées par un `stagger` unique plus un zoom sur l'illustration.

- **À faire** : dérouler l'accueil lentement. Juger si la cascade est trop rapide, trop lente, ou bien réglée.

### 11. Parallaxe et navigations répétées

Les animations sont encapsulées dans un `gsap.context()` révoqué au démontage ; elles s'accumulaient auparavant à chaque retour sur l'accueil.

- **À faire** : vérifier que le fond du héros défile plus lentement que le contenu, puis faire quatre ou cinq allers-retours `/` ↔ `/about` et confirmer l'absence de ralentissement progressif.

### 12. Allure des deux pages légales

Elles sont neuves et personne ne les a encore regardées. La machine sait qu'elles rendent le bon texte, pas qu'elles sont lisibles.

- **À faire** : ouvrir `/legal` et `/privacy` en clair et en sombre, sur mobile et sur grand écran. La colonne fait 3xl de large et les listes de définitions passent d'une à deux colonnes à partir de `sm` — juger si les longues valeurs (bases légales, notes de sous-traitance) restent confortables à lire.
- **Point d'attention** : les deux liens légaux du pied de page sont volontairement plus discrets que les cinq liens de navigation, et ils **ne figurent pas** dans la barre du haut ni dans le tiroir mobile. Confirmer que ça te convient.

---

## Ce que la machine ne peut pas atteindre

### 13. Langue des deux CV téléchargeables

Les PDF ne portent aucune métadonnée de langue : l'association repose sur le suffixe des fichiers d'origine, invérifiable sans les ouvrir.

- **À faire** : télécharger le CV depuis le pied de page en français, vérifier qu'il est en français. Recommencer en anglais.

### 14. Envoi réel du formulaire

`smoke.mjs` vérifie la présence du formulaire, sa mention de traitement et son renvoi vers la politique, pas l'acheminement.

- **À faire, une fois le point 2 réglé** : envoyer un message de test et confirmer sa réception par courriel. Tester aussi un envoi depuis une autre origine pour vérifier que le script le refuse.

### 15. Aperçus de partage

C'est la raison d'être du prérendu, et elle ne se vérifie qu'une fois le site en ligne — les robots des réseaux sociaux lisent l'URL publique.

- **À faire, après déploiement** : passer `https://www.renaudbresson.dev/projects` et `https://www.renaudbresson.dev/en/about` dans le [post inspector LinkedIn](https://www.linkedin.com/post-inspector/) et le [validateur Facebook](https://developers.facebook.com/tools/debug/). Chaque URL doit afficher **son propre** titre et sa propre description, pas ceux de l'accueil.
- **Symptôme** : le titre de l'accueil sur toutes les pages — le prérendu n'aurait pas été déployé, ou le serveur ne sert pas `dist/<route>/index.html` (voir la directive `try_files` du point 4).

### 16. Déployer avec `generate`, pas `build`

`npm run build` ne prérend rien. La commande de déploiement est **`npm run generate`**.

- **À faire** : mettre à jour le script ou la procédure de déploiement, et le vérifier au point 15.

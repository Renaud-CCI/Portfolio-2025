# runtime-tests.md

Contrôles qui demandent un œil humain, à dérouler **à la maison** après un `git pull`, sur le serveur de dev (`npm run dev`).

Avant de lire cette liste, lancer `npm run generate && npm run smoke` : une quarantaine de contrôles y passent déjà dans un Chrome headless — console propre sur les quatorze routes, résolution des composants Vuetify, icônes SVG, tiroir mobile, menu de réglages, persistance du thème, navigation, bascule de langue, balises SEO, mouvement réduit, recadrage des vignettes, graisse des `<strong>`, grille des compétences, absence de requête publicitaire, et sur les pages légales : identité de l'éditeur et de l'hébergeur, nombre de traitements et de sous-traitants décrits, traduction réelle de la version anglaise, liens légaux du pied de page.

La **section 12 de `smoke.mjs`** reprend les bloquants ci-dessous et fait échouer la commande tant qu'ils tiennent. Ce ne sont pas des régressions, c'est ce journal vérifié par la machine : le message de sortie les distingue explicitement.

**Mode d'emploi**

- Un point validé se **supprime** — l'historique git garde la trace.
- Un point qui échoue se signale plutôt que de se cocher.
- 🔴 **Bloquant** : interdit le merge de `dev` vers `main`.

---

Plus aucun 🔴 bloquant au 2026-09-04 : SIRET, image wikiwa, hébergement et formulaire de contact sont tous résolus et vérifiés en conditions réelles (mail reçu, formulaire testé de bout en bout jusqu'à la redirection `/contact/merci`). Détail du dernier réglé, pour mémoire :

**Postfix (relais IONOS)** — deux pièges rencontrés, à ne pas redécouvrir si le VPS reçoit un jour un autre expéditeur applicatif :
- Le preseed `postfix/mailname = renaudbresson.dev` avait ajouté ce domaine à `mydestination` : postfix livrait `contact@renaudbresson.dev` en local (« unknown user ») au lieu de relayer. `mydestination` ne doit contenir que `$myhostname`/`localhost` sur un satellite.
- IONOS refuse un `MAIL FROM` qui ne correspond pas au compte authentifié (550 Sender address is not allowed) — l'expéditeur par défaut de `mail`/PHP est l'utilisateur Unix local (`www-data@vps-...`), pas `contact@renaudbresson.dev`. Réglé par `smtp_generic_maps` (`/etc/postfix/generic`), qui réécrit tout expéditeur du domaine du VPS vers `contact@renaudbresson.dev`.

---

## Hébergement — VPS OVH, fait le 2026-09-04

Décision prise le 2026-09-03, exécutée le 2026-09-04 : nginx + certbot sur le VPS (`server/renaudbresson.dev.nginx`, rapatrié après un correctif — certbot avait copié la redirection HTTP du domaine nu telle quelle dans le bloc HTTPS), DNS IONOS basculé, Vercel plus dans le chemin. `try_files $uri $uri/index.html /index.html;` en place, vérifié en prod.

### 5. Journalisation du serveur : la politique annonce trente jours

Réglé pour les messages — la politique dit maintenant « supprimés dès que la demande est traitée, et au plus tard douze mois », ce qui correspond à ton habitude. Restent les journaux du serveur, seul engagement de la politique qui dépende d'une configuration et pas de toi.

**Aucune valeur par défaut ne donne trente jours.** Docker en `json-file` sans option ne fait *aucune* rotation : les journaux grossissent jusqu'à saturer le disque, c'est le piège classique du VPS qui tombe au bout de deux ans. Et le paquet nginx de Debian ou d'Ubuntu installe un `/etc/logrotate.d/nginx` en `daily` + `rotate 14`, soit quatorze jours. Dans les deux cas la phrase publiée est fausse.

**Aucune des deux solutions ci-dessous ne touche wikiwa.** `logrotate` n'est pas un réglage global : `/etc/logrotate.d/` est un dossier contenant un fichier par service, et chaque fichier ne s'applique qu'aux chemins qu'il nomme explicitement. De même, les options de journalisation Docker se posent par conteneur. Le seul geste à éviter est d'éditer `/etc/logrotate.d/nginx`, le fichier partagé posé par le paquet système.

- **Recommandé — ne pas journaliser l'adresse IP sur ce site.** Un `access_log off;`, ou un `log_format` sans `$remote_addr`, dans le nginx du portfolio. Plus de donnée personnelle dans les journaux, donc plus de durée à promettre ni de rotation à configurer : le traitement disparaît de la politique, qui en sort plus courte et plus solide. Coût : plus de `fail2ban` ici — ce site n'a ni compte, ni back-office, ni administration à forcer. Pour protéger le formulaire, un `limit_req` nginx suffit et ne lit aucun journal.
- **Si tu tiens aux IP** : écrire les journaux du portfolio dans un volume à lui (`/srv/portfolio/logs/`) et ajouter un `/etc/logrotate.d/portfolio` en `daily` + `rotate 30`.

Si tu choisis la première option, **préviens-moi** : il faut alors retirer le traitement « Journaux techniques du serveur » des deux `legal.json`, pas seulement changer la configuration du serveur.

**État réel au 2026-09-04** : ni l'une ni l'autre option n'est faite. Le vhost bootstrap journalise dans `/var/log/nginx/renaudbresson.dev.access.log` avec le format par défaut (donc `$remote_addr`), sans `logrotate` dédié — exactement le piège décrit plus haut. Décision toujours à prendre.

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

### 15. Aperçus de partage

C'est la raison d'être du prérendu, et elle ne se vérifie qu'une fois le site en ligne — les robots des réseaux sociaux lisent l'URL publique.

- **À faire, le site étant maintenant en ligne** : passer `https://www.renaudbresson.dev/projects` et `https://www.renaudbresson.dev/en/about` dans le [post inspector LinkedIn](https://www.linkedin.com/post-inspector/) et le [validateur Facebook](https://developers.facebook.com/tools/debug/). Chaque URL doit afficher **son propre** titre et sa propre description, pas ceux de l'accueil.
- **Symptôme** : le titre de l'accueil sur toutes les pages — le prérendu n'aurait pas été déployé, ou le serveur ne sert pas `dist/<route>/index.html` (voir la directive `try_files`, section « Hébergement » plus haut).

### 16. Déployer avec `generate`, pas `build`

`npm run build` ne prérend rien. La commande de déploiement est **`npm run generate`**.

- **Réglé le 2026-09-04** : `.github/workflows/deploy.yml` appelle `npm run generate`, pas `build`. Le manuel n'est plus dans le chemin.

# server/

Scripts et config côté serveur du portfolio, hors du build Vite (jamais copiés dans `dist/`).
Déployés par `.github/workflows/deploy.yml` sur le VPS OVH qui héberge déjà wikiwa.com.

## `contact.php`

Relais du formulaire de contact — voir le commentaire en tête du fichier pour le détail
du contrat (méthode, origine, anti-injection d'en-têtes, redirection).

Déployé par la CI dans `/var/www/portfolio-scripts/contact.php`, en dehors de
`/var/www/portfolio-frontend` pour ne pas être effacé par le `rsync --delete` qui
resynchronise `dist/` à chaque déploiement du front.

**Prérequis non automatisés :**

- Un MTA local doit être disponible sur le VPS pour `mail()` (postfix en mode
  satellite/relais suffit — pas besoin de recevoir de courriel, seulement d'en
  envoyer). **Absent du VPS au 2026-09-04** (`systemctl is-active postfix/exim4` :
  `inactive`/absent des deux) — `mail()` échouera tant que ce n'est pas fait.
- Une fois l'endpoint réellement joignable, vérifier `npm run smoke` (section 12) :
  il ne doit plus matcher un tiers connu (déjà le cas, `MAIL_ENDPOINT` pointe sur
  `https://www.renaudbresson.dev/contact.php` dans `src/legal.ts`).
- Test manuel obligatoire — voir `runtime-tests.md`, point 14 : envoyer un message
  réel, confirmer la réception, et vérifier qu'un POST depuis une autre origine est
  bien rejeté (403).

## `renaudbresson.dev.nginx`

Vhost du front (SPA prérendue) et du script de contact. **Version pré-certbot : HTTP
seul.** Une fois `certbot --nginx -d renaudbresson.dev -d www.renaudbresson.dev` lancé
sur le VPS, il réécrit ce fichier pour ajouter les blocs HTTPS et la redirection
80 → 443 (voir le vhost `wikiwa.com` du même serveur pour la forme attendue). **C'est
cette version réécrite qu'il faut rapatrier et committer ici** — tant que ce n'est pas
fait, chaque déploiement CI réécrase par la version bootstrap, sans régression mais
sans progrès non plus.

## Déploiement (`.github/workflows/deploy.yml`)

Se déclenche après un succès de la CI sur `master` (ou manuellement,
`workflow_dispatch`). Construit avec `npm run generate` (pas `build` — c'est la
commande qui prérend, voir `CLAUDE.md`), puis :

1. `rsync --delete dist/ → /var/www/portfolio-frontend/`
2. `rsync server/contact.php → /var/www/portfolio-scripts/contact.php`
3. `rsync server/renaudbresson.dev.nginx → /etc/nginx/sites-available/renaudbresson.dev`,
   `nginx -t && systemctl reload nginx`

**Secrets GitHub requis** (repo `Renaud-CCI/Portfolio-2025`, absents au 2026-09-04) :
`VPS_SSH_KEY`, `VPS_USER`, `VPS_HOST` — mêmes noms que sur `wikiwa-spa`, où ils sont
déjà configurés pour le même VPS.

## Ce qui reste à faire avant que le site serve réellement en prod (voir `runtime-tests.md`, point 4)

1. Bootstrap : créer `/var/www/portfolio-frontend` et `/var/www/portfolio-scripts` sur
   le VPS, déployer le vhost HTTP, configurer les secrets GitHub — peut se faire dès
   maintenant, le site ne sera joignable qu'après l'étape 2.
2. **Basculer l'enregistrement A de `www.renaudbresson.dev` chez IONOS** vers l'IP du
   VPS — étape hors CI, à faire par Renaud (le site tourne aujourd'hui sur Vercel : le
   couper avant que le VPS ne réponde casse le site en ligne).
3. Une fois le DNS propagé, lancer `certbot --nginx` sur le VPS, puis rapatrier le
   vhost réécrit dans ce dépôt (voir ci-dessus).
4. Installer/configurer un MTA pour `contact.php` (voir plus haut).

# server/

Scripts et config côté serveur du portfolio, hors du build Vite (jamais copiés dans `dist/`).
Déployés par `.github/workflows/deploy.yml` sur le VPS OVH qui héberge déjà wikiwa.com.

**Statut au 2026-09-04 : tout est en place et vérifié en conditions réelles** (front servi
en HTTPS, formulaire testé de bout en bout jusqu'à la réception du mail). Le détail
ci-dessous documente comment, pour la prochaine fois qu'il faut y retoucher.

## `contact.php`

Relais du formulaire de contact — voir le commentaire en tête du fichier pour le détail
du contrat (méthode, origine, anti-injection d'en-têtes, redirection).

Déployé dans `/var/www/portfolio-scripts/contact.php`, en dehors de
`/var/www/portfolio-frontend` pour ne pas être effacé par le `rsync --delete` qui
resynchronise `dist/` à chaque déploiement du front.

**MTA (postfix, mode satellite, relais IONOS)** : installé et fonctionnel. Deux pièges
rencontrés à l'installation, à ne pas redécouvrir — détaillés dans `runtime-tests.md`
(section hébergement) :

- `mydestination` ne doit **pas** contenir `renaudbresson.dev`, sinon postfix livre en
  local au lieu de relayer (« unknown user »).
- IONOS refuse un `MAIL FROM` qui ne correspond pas au compte authentifié — `smtp_generic_maps`
  (`/etc/postfix/generic`) réécrit l'expéditeur local du VPS vers `contact@renaudbresson.dev`.
- Identifiants SMTP dans `/etc/postfix/sasl_passwd` (chmod 600, jamais commité, jamais
  géré par un agent — mot de passe entré directement par Renaud sur le VPS).

## `renaudbresson.dev.nginx`

Vhost du front (SPA prérendue) et du script de contact, HTTPS. Généré par
`certbot --nginx -d renaudbresson.dev -d www.renaudbresson.dev` le 2026-09-04 puis
rapatrié ici, **avec un correctif manuel** : certbot avait copié la redirection du
domaine nu telle quelle dans le nouveau bloc HTTPS (`return 301 http://www...` au lieu
de `https://`), cassant `https://renaudbresson.dev/`. Si `certbot renew` ou une
relance manuelle de `certbot --nginx` réécrit ce fichier un jour, revérifier ce point
avant de le recommitter.

## Déploiement (`.github/workflows/deploy.yml`)

Se déclenche après un succès de la CI sur `master` (ou manuellement,
`workflow_dispatch`). Construit avec `npm run generate` (pas `build` — c'est la
commande qui prérend, voir `CLAUDE.md`), puis :

1. `rsync --delete dist/ → /var/www/portfolio-frontend/`
2. `rsync server/contact.php → /var/www/portfolio-scripts/contact.php`
3. `rsync server/renaudbresson.dev.nginx → /etc/nginx/sites-available/renaudbresson.dev`,
   `nginx -t && systemctl reload nginx`

**Secrets GitHub** (repo `Renaud-CCI/Portfolio-2025`) : `VPS_SSH_KEY`, `VPS_USER`,
`VPS_HOST` — configurés le 2026-09-04, mêmes valeurs que sur `wikiwa-spa` (même VPS).

Le workflow n'a pas encore tourné réellement (il n'existe que sur `dev`, et GitHub
n'autorise le déclenchement — automatique ou manuel — qu'à partir de la branche par
défaut). Le premier déploiement effectif se fera au prochain merge vers `master`.
Le bootstrap initial (dossiers, vhost, contact.php) a été fait à la main, avec les
mêmes commandes que celles du workflow.

## Infra du VPS (pour mémoire)

- IP : `135.125.79.85`, accès `ssh wikiwa-vps`.
- `wikiwa-backend`/`horizon`/`wikiwa-scheduler` restent gérés par **supervisor**, pas
  systemd (voir le `CLAUDE.md` de `wikiwa-api`) — ne pas confondre avec l'unité
  systemd `frankenphp.service`, orpheline et en échec permanent sur ce VPS (port 80
  déjà pris par nginx), sans rapport avec le vrai service ni avec le portfolio.
- DNS `renaudbresson.dev`/`www` chez IONOS, deux enregistrements A vers l'IP ci-dessus.
  Domaine détaché de Vercel.

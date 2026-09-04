# server/

Scripts côté serveur du portfolio, hors du build Vite (jamais copiés dans `dist/`).

## `contact.php`

Relais du formulaire de contact — voir le commentaire en tête du fichier pour le détail
du contrat (méthode, origine, anti-injection d'en-têtes, redirection).

**Déploiement (VPS OVH, voir `runtime-tests.md`) :**

1. Déposer `contact.php` sur le serveur, servi en PHP-FPM à une URL du domaine du site
   (ex. `https://www.renaudbresson.dev/contact.php`).
2. Un MTA local doit être disponible pour `mail()` (postfix en mode satellite/relais
   suffit — pas besoin de recevoir de courriel, seulement d'en envoyer).
3. Mettre à jour `MAIL_ENDPOINT` dans `src/legal.ts` avec l'URL réelle.
4. Vérifier `npm run smoke` (section 12) : l'endpoint ne doit plus matcher un tiers connu.
5. Test manuel obligatoire après déploiement — voir `runtime-tests.md`, point 14 : envoyer
   un message réel, confirmer la réception, et vérifier qu'un POST depuis une autre origine
   est bien rejeté (403).

<?php
/**
 * Script de relais du formulaire de contact de renaudbresson.dev.
 *
 * Reçoit le POST classique (sans JavaScript) du formulaire de src/components/Contact.vue,
 * relaie le message par courriel, et redirige — le formulaire n'utilise pas fetch, la page
 * est donc quittée. Aucune donnée n'est écrite sur disque ni en base : rien à purger, la
 * politique de confidentialité ("supprimés dès que la demande est traitée") est vraie par
 * construction.
 *
 * Déploiement : ce fichier vit sur le même serveur que le site (voir runtime-tests.md,
 * point 2 et décision d'hébergement du 2026-09-03), hors du build Vite — il n'est jamais
 * copié dans dist/. Le nginx du portfolio doit juste le servir en PHP-FPM à l'URL pointée
 * par MAIL_ENDPOINT dans src/legal.ts.
 */

declare(strict_types=1);

// --- Configuration ---------------------------------------------------------
// Garder en phase avec src/legal.ts (LEGAL.email) : rien n'automatise ce lien,
// les deux fichiers vivent dans des dépôts/déploiements différents.
const RECIPIENT = 'contact@renaudbresson.dev';
const ALLOWED_ORIGINS = ['https://www.renaudbresson.dev', 'https://renaudbresson.dev'];
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// --- Méthode -----------------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Méthode non autorisée.');
}

// --- Origine -----------------------------------------------------------------
// Formulaire POST classique : pas de préflight CORS à gérer, mais on refuse toute
// origine qui n'est pas le site lui-même (Referer, à défaut Origin).
$source = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
$sourceOrigin = $source !== '' ? parse_url($source, PHP_URL_SCHEME) . '://' . parse_url($source, PHP_URL_HOST) : '';
if (!in_array($sourceOrigin, ALLOWED_ORIGINS, true)) {
    http_response_code(403);
    exit('Origine refusée.');
}

// --- Entrée --------------------------------------------------------------
function fieldOrFail(string $key, int $maxLength): string
{
    $value = trim((string) ($_POST[$key] ?? ''));
    if ($value === '' || mb_strlen($value) > $maxLength) {
        http_response_code(400);
        exit('Champ invalide : ' . $key);
    }
    // Un retour à la ligne dans un champ destiné à un en-tête permettrait d'y
    // injecter des en-têtes supplémentaires (Bcc, autre destinataire...).
    return str_replace(["\r", "\n"], '', $value);
}

$name = fieldOrFail('name', MAX_FIELD_LENGTH);
$email = fieldOrFail('email', MAX_FIELD_LENGTH);
$message = trim((string) ($_POST['message'] ?? ''));
$lang = ($_POST['lang'] ?? '') === 'en' ? 'en' : 'fr';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('Adresse électronique invalide.');
}
if ($message === '' || mb_strlen($message) > MAX_MESSAGE_LENGTH) {
    http_response_code(400);
    exit('Message invalide.');
}

// --- Envoi -----------------------------------------------------------------
$subject = 'Nouveau message via renaudbresson.dev';
$body = "Nom : {$name}\nEmail : {$email}\n\n{$message}\n";

// From sur le domaine du site (pas l'adresse du visiteur, jamais fiable pour un
// en-tête From) ; Reply-To vers le visiteur pour répondre directement.
$headers = [
    'From: Formulaire renaudbresson.dev <contact@renaudbresson.dev>',
    "Reply-To: {$name} <{$email}>",
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail(RECIPIENT, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    http_response_code(502);
    exit("Échec de l'envoi. Réessayez plus tard.");
}

// --- Confirmation ------------------------------------------------------------
// 303 : le navigateur refait un GET sur la cible, pas un nouveau POST.
$target = $lang === 'en' ? '/en/contact/merci' : '/contact/merci';
header('Location: ' . ALLOWED_ORIGINS[0] . $target, true, 303);
exit;

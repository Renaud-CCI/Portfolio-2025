// Données factuelles des pages légales : un seul endroit à corriger, et aucune
// dérive possible entre les deux langues.
export const LEGAL = {
  name: 'Renaud Bresson',
  city: 'Feurs (42110)',
  // Vide tant que le numéro n'est pas renseigné : `npm run smoke` échoue dans ce cas.
  siret: '',
  email: 'contact@renaudbresson.dev',
  phone: '06 23 84 67 65',
  updated: '2026-09-03',

  // Le site et le script du formulaire tournent sur le même serveur : l'hébergeur
  // à déclarer est le fournisseur de l'infrastructure. Changer d'hébergement veut
  // dire corriger ces valeurs *et* la première entrée de
  // `legal.privacy.processors.items` dans les deux locales.
  host: {
    name: 'OVH SAS',
    address: '2 rue Kellermann, 59100 Roubaix',
    registry: 'RCS Lille Métropole 424 761 419',
    phone: '1007',
    url: 'https://www.ovhcloud.com',
  },

  cdn: {
    name: 'jsDelivr',
    operator: 'Prospect One',
  },
} as const

// Le formulaire poste encore vers Formspree alors que la politique de
// confidentialité décrit un traitement auto-hébergé : basculer cette URL vers le
// script PHP du serveur avant le merge vers main (voir runtime-tests.md).
export const MAIL_ENDPOINT = 'https://formspree.io/f/mgvyzgdy'

// Les prestataires de formulaires relaient le message par leurs propres serveurs :
// tant que l'endpoint pointe vers l'un d'eux, la politique publiée est fausse.
export function isSelfHostedEndpoint(endpoint: string = MAIL_ENDPOINT): boolean {
  return !/formspree\.io|web3forms\.com|formsubmit\.co|getform\.io/i.test(endpoint)
}

// Ligne d'une liste de définitions, rendue par LegalRows.vue.
export interface LegalRow {
  label: string
  value: string
  href?: string
}

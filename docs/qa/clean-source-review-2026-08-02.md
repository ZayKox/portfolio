# Reproductibilité depuis les sources suivies — 2 août 2026

## Périmètre

- Révision inspectée : `87e1dab51cabc0f434df5a4b7bc5c2b5a6d616f0`.
- Source : archive créée avec `git archive HEAD` dans un dossier temporaire distinct du workspace.
- Environnement : Node.js 22.23.0, npm 10.9.8 et moteur Docker local.

L’archive initiale ne contenait ni `node_modules/`, ni `dist/`, ni `.astro/`, ni fichier non suivi. Elle représentait donc uniquement les fichiers enregistrés dans le commit inspecté.

## Installation propre

`npm ci` a installé 532 paquets depuis `package-lock.json`, sans réutiliser le dossier de dépendances du workspace. La commande a terminé avec zéro vulnérabilité signalée sur les 533 paquets audités pendant l’installation.

## Validation du dépôt

`npm run verify` a réussi intégralement dans l’archive :

- formatage Prettier conforme ;
- provenance des trois médias conforme et aucune police embarquée ;
- contrôle Astro et TypeScript : 39 fichiers, zéro erreur, avertissement ou indice ;
- build indexable avec origine HTTPS de test ;
- build de preview entièrement `noindex` ;
- build sans `SITE_URL` et sans faux domaine ;
- pour chaque variante : 13 documents HTML, 12 routes atteignables et 15 références internes validés.

## Validation des conteneurs

Les images publique et preview ont ensuite été construites depuis cette même archive, sans accès aux fichiers du workspace original.

| Mode    | Image construite                                                          | Résultat                                                                                                                          |
| ------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Public  | `sha256:b92b131c771db0415a437124fefdf3112e0b7ce3d62d3916fcefb4bfb1c88c2c` | 12 routes bilingues, vraie 404, icônes, canonical, JSON-LD, sitemap, carte sociale et absence de cookie validés                   |
| Preview | `sha256:add18e0cad6e7de9b738d363b1050927c215e968d049f4cb650adf8acae66337` | 12 routes bilingues, vraie 404, icônes, suppression des signaux d’indexation, interdiction du crawl et absence de cookie validées |

Les conteneurs et images temporaires ont été supprimés automatiquement par le script de validation après les contrôles.

## Conclusion et limites

Le build et le conteneur du commit inspecté ne dépendent d’aucun fichier non
suivi du workspace local. Cette preuve historique reste valable pour la
reproductibilité du commit contrôlé, mais elle précède la migration et ne valide
ni la configuration Wrangler ni le premier déploiement Workers.

Elle ne remplace pas la répétition distante : `npm ci`, le build, les en-têtes,
l’URL de preview, le SHA envoyé et l’absence d’indexation devront encore être
confirmés par GitHub Actions et sur une version Workers protégée par Access. La
répétition de release complète sera également rejouée sur son SHA final.

# Revue de préparation Cloudflare Workers — 4 septembre 2026

## Périmètre

Cette revue couvre la configuration versionnée du portfolio statique, les
workflows GitHub Actions, les variantes de build, les textes légaux FR/EN et les
smoke tests prévus pour Cloudflare Workers Static Assets. Elle ne constitue pas
une preuve de déploiement : aucun compte Cloudflare, secret GitHub, DNS,
certificat, règle Access ou domaine public n’a été modifié.

Branche locale examinée : `develop`. L’arbre de travail était propre avant la
tâche.

## Résultat

La configuration locale est prête pour une première preview privée après les
opérations externes du runbook. Le déploiement reste volontairement neutralisé
par deux variables d’activation distinctes tant que Cloudflare Access, les
environnements GitHub et la fenêtre de bascule ne sont pas prêts.

La revue de menace du pipeline a conduit aux garde-fous suivants :

- le workflow de preview doit lui-même être lancé depuis `main` ;
- la référence demandée est installée, validée et construite sans aucun secret ;
- seul `dist/` passe dans un artefact GitHub immuable vers le job de
  déploiement ;
- le job cloisonné dans l’environnement `preview` recharge son outillage depuis
  `main` et revalide `dist/` avant de recevoir le jeton Cloudflare ;
- une sonde sans identifiant doit être refusée par Access avant le smoke test
  authentifié ;
- la production refuse un SHA validé qui n’est plus le HEAD de `main` ;
- la gate de production et l’approbation humaine sont séparées, et le runbook
  prépare HTTP → HTTPS et `www` → apex avant la bascule.

## Validations exécutées

| Contrôle                                                                             | Résultat                                                                                                          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `npm ci --no-audit --no-fund`                                                        | 562 paquets installés depuis le lockfile                                                                          |
| `npm run format` puis `npm run verify`                                               | réussi                                                                                                            |
| `astro check`                                                                        | 50 fichiers, 0 erreur, 0 avertissement, 0 indication                                                              |
| Variantes indexable, preview `noindex` et sans `SITE_URL`                            | 19 documents HTML, 18 routes et 23 références internes validés pour chaque contrat                                |
| `npm audit --audit-level=high`                                                       | 0 vulnérabilité dans l’arbre installé, Wrangler inclus                                                            |
| Playwright Chromium, Firefox et mobile Chromium                                      | 78 réussis, 15 ignorés selon les responsabilités de chaque projet                                                 |
| Playwright WebKit et mobile WebKit dans `mcr.microsoft.com/playwright:v1.62.1-noble` | 49 réussis, 13 ignorés selon les responsabilités de chaque projet                                                 |
| Lighthouse mobile                                                                    | 100 en performance, accessibilité, bonnes pratiques et SEO sur les 4 pages ; LCP de 903 à 905 ms, CLS 0, TBT 0 ms |
| `npm run check:links`                                                                | 5 cibles contrôlées, aucune cible confirmée cassée ; LinkedIn a refusé la sonde avec le statut non bloquant 999   |
| Parsing YAML des 3 workflows                                                         | réussi ; 1 job CI, 2 jobs preview et 1 job production                                                             |
| Résolution des tags des actions GitHub                                               | les quatre SHA épinglés correspondent aux tags documentés                                                         |
| Build production puis `wrangler deploy --dry-run`                                    | réussi avec Wrangler 4.129.0, 49 fichiers statiques lus, aucun binding                                            |
| Build preview puis `wrangler versions upload --dry-run --preview-alias staging`      | réussi avec Wrangler 4.129.0                                                                                      |
| `wrangler telemetry status`                                                          | désactivé par la configuration du projet                                                                          |
| `git diff --check`                                                                   | réussi                                                                                                            |

La première exécution Playwright locale a aussi révélé deux assertions qui
cherchaient l’adresse email comme nom accessible alors que le lien porte désormais
le libellé « Ouvrir la messagerie ». Elles ont été alignées sur l’interface
existante. WebKit ne pouvait pas démarrer directement sur l’hôte faute de
bibliothèques système ; l’image Playwright officielle de même version a permis
de couvrir les 62 cas restants sans modifier le système.

## Preuves encore requises

Avant la production, il reste à exécuter et consigner :

- la création du Worker, des deux jetons Cloudflare distincts et des
  environnements GitHub protégés ;
- la preuve qu’Access bloque une requête anonyme et accepte le service token sur
  l’URL réelle de preview ;
- la recette visuelle, clavier, mobile et thèmes sur cette preview ;
- l’inventaire puis la migration de la zone sans altérer MX, SPF, DKIM, DMARC ou
  les autres services ;
- les redirections permanentes HTTP → HTTPS et `www` → apex, le certificat, la
  vraie 404, les en-têtes et le cache sur le réseau Cloudflare ;
- un premier déploiement, son smoke test distant et un exercice de rollback.

Ces étapes sont ordonnées dans `docs/deployment-runbook.md`. Elles nécessitent
des actions externes explicites et n’ont pas été simulées par les dry-runs.

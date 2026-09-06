# Application de l’audit — 6 septembre 2026

Suite du rapport `production-audit-2026-09-05.md`. État initial : branche `develop`, commit `2cec73cd671dd435d236145aeedc1882c128c3fc`, index et arbre propres. Le changement du nom du Worker déjà committé est conservé.

## Corrections livrées

- Retrait FR/EN des centres d’intérêt, du récit d’origine informatique et de l’inspiration Letterboxd sans validation canonique. Routes : `/`, `/en/`, `/a-propos/`, `/en/about/`.
- CV limités aux informations validées : retrait des détails Intento, des sites et descriptions de cursus, des attributions Svelte/Docker/Git/PL-SQL à Beyowi et des développements non validés de la mission Sealed Air. Les postes, entreprises, établissements et périodes restent présents. Les champs absents n’émettent pas de paragraphe ou liste vide. Routes : `/cv/`, `/en/resume/` et leurs deux PDF.
- Génération PDF précédée d’un build indépendant du domaine. Manifeste versionné des empreintes des sources et des deux sorties ; `check:resume` bloque les artefacts périmés ou modifiés dans `verify`, donc aussi en CI. Les tests négatifs couvrent modification, ajout, suppression de source, PDF modifié et PDF manquant. La vérification ne nécessite pas de navigateur ; la régénération exige Chromium.
- Axe bloque toutes les violations, y compris mineures/modérées, sur les dix-huit routes et la 404, en clair/sombre dans les cinq profils navigateur.
- Conservation des rapports navigateur et Lighthouse en CI également lors d’un succès, pendant sept jours, pour pouvoir joindre les preuves à une release.

Aucune nouvelle réponse personnelle n’est considérée validée. Le questionnaire reste inchangé ; les détails retirés peuvent être réintroduits après validation explicite.

## Vérifications locales

- `npm run format` et `npm run verify` : réussis, incluant fraîcheur PDF et tests négatifs ; dix-neuf documents et dix-huit routes validés dans les trois modes de build.
- Copie isolée des fichiers versionnés et des nouveaux fichiers de cette tâche, sans `node_modules`, `.astro`, `dist` ou dépendance à un dépôt voisin : `npm ci` puis `npm run verify` réussis. Installation : zéro vulnérabilité signalée.
- Chromium, Firefox et mobile Chromium : 117 réussis, 15 non applicables ignorés.
- WebKit desktop/mobile dans l’image officielle Playwright épinglée du rapport initial : 75 réussis, 13 non applicables ignorés. Total : **192 réussis, zéro échec**.
- Lighthouse : 100/100 dans les quatre catégories sur les six routes ; LCP 902–903 ms, CLS maximal 0,001, TBT nul.
- PDF : deux pages par langue, `/Lang` FR/EN, balisage présent, retrait des passages contrôlé par extraction textuelle ; les quatre pages ont été rendues et examinées, sans contenu coupé.

Ces résultats sont des preuves locales et synthétiques, pas une certification WCAG/PDF-UA ni des mesures de production.

## Infrastructure : constats actuels et travail restant

Le domaine faisant foi est `ethanbrosselard.com` (§25 du questionnaire). Les sondes de cette passe montrent un apex HTTPS répondant 200, sans canonical attendu, et `www.ethanbrosselard.com` ne résolvant pas. `test:deployment` échoue dès `/` avec `canonical does not match https://ethanbrosselard.com/` ; les assertions suivantes ne sont donc pas réputées vérifiées. Le constat du rapport initial selon lequel l’apex redirige vers un autre service ne doit pas être utilisé pour décider la bascule actuelle.

La [CI du commit initial 2cec73c](https://github.com/ZayKox/portfolio/actions/runs/33977120451) est réussie. Le [dernier workflow de production consulté](https://github.com/ZayKox/portfolio/actions/runs/33977408310) est ignoré (`skipped`) et porte le SHA précédent ; ce n’est pas une preuve de déploiement des corrections de cette tâche. La CI distante du futur commit reste à exécuter après publication Git autorisée.

Wrangler indique que la session n’est pas authentifiée. Aucun secret, réglage de compte, DNS, déploiement, push ou PR n’a été modifié pendant cette passe. Restent nécessaires :

1. Accès authentifié au compte Cloudflare et vérification des environnements/protections/secrets GitHub, puis preview privée Access avec refus anonyme et smoke test authentifié.
2. Inventaire et préservation des DNS existants, association du bon Worker au domaine, redirections HTTP/HTTPS et `www` ; après le GO explicite, recette distante complète et exercice de rollback selon `docs/deployment-runbook.md`.
3. Recette humaine avec lecteur d’écran, zoom réel, Safari macOS et téléphones physiques ; relecture des mentions d’hébergement avec les réglages réellement déployés.
4. Vérification manuelle du lien LinkedIn : le refus automatisé ne prouve pas un lien cassé.

Les corrections locales ne lèvent pas ces conditions de mise en production.

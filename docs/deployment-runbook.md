# Runbook de déploiement et retour arrière

Ce document décrit la réponse opératoire du portfolio statique sur Coolify. Il complète `docs/production-plan.md` et ne remplace pas les sauvegardes ni les procédures d’administration du VPS.

## Périmètre technique

- La production est la ressource Git Coolify construite depuis `docker-compose.production.yml` sur `main`.
- Le service `portfolio` expose uniquement le port interne `8080` et ne possède ni volume, base de données ou secret applicatif. Il s'exécute sans capability Linux, sans possibilité d'acquérir de nouveaux privilèges et avec une racine en lecture seule.
- `SITE_URL` et `SITE_NOINDEX` sont injectés au build. Un retour arrière doit conserver les valeurs de production validées.
- Coolify peut revenir à une version précédente uniquement lorsque l’image Docker correspondante est encore disponible localement. L’action ne doit donc jamais être supposée disponible sans vérification préalable.

## Informations à enregistrer avant chaque publication

Compléter la fiche de release de `docs/production-plan.md` avec :

```text
SHA candidat :
SHA actuellement validé en production :
Identifiant du déploiement candidat :
Identifiant du dernier déploiement valide :
Référence ou digest de l’image valide si Coolify l’affiche :
Action de rollback disponible sur le déploiement valide : oui/non
SITE_URL contrôlé :
SITE_NOINDEX contrôlé : false
Rapport smoke test avant publication :
Personne autorisant la publication :
```

Ne jamais copier dans ce fichier un jeton Coolify, une valeur d’en-tête `Authorization`, une clé SSH ou une autre donnée secrète.

## Déclenchement

Revenir en arrière lorsqu’une publication introduit notamment :

- une page blanche ou une erreur HTTP majeure ;
- une navigation FR/EN, un contact ou une route projet inaccessible ;
- une fuite de donnée ou de secret ;
- une violation CSP qui bloque le site ;
- une erreur de canonical, de domaine, de sitemap ou d’indexation ;
- une régression d’accessibilité majeure ;
- des erreurs répétées dans les logs ou un healthcheck défaillant.

Une correction en avant reste possible pour un défaut mineur dont la résolution est immédiate et moins risquée qu’un rollback. Le choix, son auteur et sa justification doivent être inscrits dans la fiche d’incident.

## Retour arrière rapide par image Coolify

### 1. Stabiliser

1. Suspendre les nouvelles fusions et désactiver temporairement l’auto-déploiement si nécessaire.
2. Si le déploiement fautif est encore en cours et n’a pas remplacé la version saine, l’annuler depuis Coolify puis vérifier que la production actuelle répond toujours.
3. Noter l’heure Europe/Paris, le SHA fautif, l’identifiant du déploiement et les symptômes observés.
4. Ne modifier ni DNS, domaine, certificat, variables de build, fichier Compose ou proxy pendant le diagnostic initial.

### 2. Choisir la cible

1. Ouvrir l’historique de la ressource et sélectionner le dernier déploiement qui possède à la fois un SHA identifié, un statut réussi et un smoke test accepté.
2. Confirmer que Coolify propose encore l’action de rollback pour cette version. Sa présence est un prérequis, mais seul le rollback réussi puis contrôlé prouve que l’image locale était réellement exploitable.
3. Comparer la cible avec le SHA et l’identifiant consignés dans la dernière fiche de release valide.
4. Arrêter la procédure et utiliser le repli Git ci-dessous en cas de doute sur la cible ou d’absence d’image locale.

### 3. Exécuter

1. Déclencher le rollback de la version sélectionnée depuis Coolify.
2. Enregistrer le nouvel identifiant de déploiement et la cible choisie.
3. Attendre le statut réussi et le healthcheck sain du service `portfolio`.
4. Ne pas lancer en parallèle une reconstruction du commit fautif.

### 4. Vérifier immédiatement

Depuis un poste de confiance, exécuter :

```sh
npm run test:deployment -- \
  --url https://domaine-final.example \
  --mode production \
  --check-http-redirect \
  --redirect-from https://www.domaine-final.example \
  --report deployment-reports/rollback-production.json
```

Omettre `--redirect-from` si cette origine secondaire n’est pas configurée ; répéter l’option pour chaque variante publique réellement déclarée dans Coolify.

Puis contrôler manuellement :

- accueil français et anglais ;
- navigation, changement de langue et thème ;
- liste et aperçus des projets ;
- contact et liens externes principaux ;
- vraie réponse 404 ;
- statut et logs Coolify ;
- correspondance entre le SHA restauré, la fiche de release et le déploiement affiché.

Le smoke test vérifie également HTTPS via l’origine attendue, la redirection HTTP, les redirections permanentes des variantes HTTPS déclarées, les canonical, alternates, JSON-LD, sitemap, `robots.txt`, carte sociale, en-têtes de sécurité et absence de cookie.

## Repli lorsque l’image n’est plus disponible

Ne pas démarrer manuellement un ancien conteneur avec des commandes Docker improvisées : Coolify gère le réseau, les labels du proxy, le healthcheck et le cycle de vie de la ressource.

1. Créer une branche dédiée depuis `main`, par exemple `fix/revert-release-<date>`.
2. Créer un commit de revert du ou des commits fautifs avec `git revert`. Ne pas réécrire l’historique et ne pas déplacer `main` de force.
3. Ouvrir une pull request vers `main` et exécuter les contrôles requis.
4. Faire approuver et fusionner le revert selon les règles de protection, puis laisser Coolify construire ce nouveau SHA.
5. Exécuter le smoke test production complet et enregistrer le nouveau déploiement.

Cette voie reconstruit un artefact dont le contenu revient à l’état sain ; elle est plus lente qu’un rollback par image mais conserve l’alignement entre Git et la production.

## Exercice obligatoire sur la ressource privée

Avant la première production :

1. Déployer un premier SHA valide sur la ressource privée avec `SITE_NOINDEX=true` et une protection d’accès.
2. Conserver son identifiant, son image locale et un rapport `test:deployment --mode preview` réussi.
3. Déployer un deuxième SHA identifiable et également valide.
4. Utiliser l’action de rollback vers le premier déploiement sans modifier les variables ni le domaine de preview.
5. Relancer le smoke test preview, vérifier le SHA restauré dans Coolify et mesurer la durée entre le déclenchement et le rétablissement.
6. Consigner le résultat dans la fiche de release. Si l’action n’est pas disponible pour cette ressource Docker Compose, tester le repli Git et enregistrer cette limite avant le GO.

## Après l’incident

1. Confirmer le rétablissement avec Ethan et lever le gel des déploiements seulement après validation.
2. Créer une correction normale par branche et pull request si le rollback par image a désaligné temporairement `main` et la production.
3. Documenter cause, impact, durée, SHA fautif, SHA restauré, identifiants Coolify, rapport de smoke test et mesure préventive.
4. Vérifier que l’image de retour arrière suivante reste disponible avant toute nouvelle publication.

## Fiche d’incident

```text
Début de l’incident (Europe/Paris) :
Détection :
Symptômes et portée :
SHA fautif :
Déploiement fautif :
Décision rollback ou correction en avant :
Décideur :
SHA cible :
Déploiement cible :
Image locale disponible : oui/non
Début du rétablissement :
Fin du rétablissement :
Rapport smoke test :
Cause :
Correction Git :
Prévention :
```

## Références officielles vérifiées le 2 août 2026

- [Applications et limite des rollbacks Coolify](https://coolify.io/docs/applications)
- [Déploiements Docker Compose dans Coolify](https://coolify.io/docs/applications/build-packs/docker-compose)
- [Déploiements Git et historique de versions](https://coolify.io/docs/applications/ci-cd)
- [API : consulter un déploiement par identifiant](https://coolify.io/docs/api-reference/api/deployments/get-deployment-by-uuid)
- [API : annuler un déploiement en cours](https://coolify.io/docs/api-reference/api/deployments/cancel-deployment-by-uuid)

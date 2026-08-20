# Runbook de déploiement et retour arrière

Ce document décrit le déploiement direct du portfolio statique sur le VPS
partagé. Il n’utilise pas Coolify : Docker Compose lance le conteneur Nginx du
portfolio, tandis que le Caddy déjà administré par `personal-infrastructure`
termine TLS et relaie vers son port interne.

Le domaine du portfolio reste une zone DNS distincte de l’infrastructure
familiale. Il n’est ni géré ni déduit par ce dépôt.

## Contrat de production

- Le service `portfolio` ne publie aucun port sur l’hôte ; il expose seulement
  `8080` au réseau Docker partagé avec Caddy.
- `PORTFOLIO_CADDY_NETWORK` désigne ce réseau externe existant. Sa valeur doit
  correspondre au réseau de bord administré par `personal-infrastructure`.
- Caddy reste l’unique point d’entrée HTTP/HTTPS du VPS et porte les certificats
  TLS.
- `SITE_URL` est l’origine HTTPS canonique complète, sans barre finale.
- `SITE_NOINDEX` vaut `false` en production et `true` pour toute recette non
  publique.
- Le déploiement s’effectue depuis un clone Git propre, épinglé à un SHA validé.

Le fichier [portfolio.caddy.example](../deploy/caddy/portfolio.caddy.example)
est un modèle de route. Il doit être intégré au dépôt et au mécanisme de
configuration de Caddy de `personal-infrastructure` ; ne modifiez pas la
configuration active directement sur le VPS sans cette mise à jour contrôlée.

## Préparer le VPS

1. Installer Docker Engine et le plugin Docker Compose selon le runbook de
   `personal-infrastructure`.
2. Vérifier que le réseau Docker de Caddy existe, sans le créer au hasard :

   ```sh
   docker network ls
   ```

3. Cloner ce dépôt dans un répertoire de service dédié, par exemple
   `/srv/services/portfolio/repo`.
4. Créer un fichier d’environnement hors Git, lisible seulement par
   l’opérateur :

   ```dotenv
   SITE_URL=https://<portfolio-domain>
   SITE_NOINDEX=false
   PORTFOLIO_CADDY_NETWORK=<existing-caddy-edge-network>
   ```

5. Ajouter la route Caddy avec le domaine réel dans le dépôt
   `personal-infrastructure`, puis l’appliquer avec son processus de
   configuration. Vérifier que Caddy et le portfolio partagent bien le même
   réseau Docker.
6. Créer ou mettre à jour les enregistrements DNS de la zone du portfolio vers
   l’adresse publique du VPS. Cette zone est distincte du DNS familial ; ne pas
   modifier ses enregistrements depuis ce dépôt.

Avant ouverture publique, attendre la résolution DNS et vérifier que Caddy peut
obtenir le certificat. Les tests doivent utiliser l’URL HTTPS finale, jamais
une adresse IP avec un en-tête `Host` improvisé.

## Déployer une version validée

Depuis le clone de service :

```sh
git fetch --tags origin
git checkout --detach <validated-sha>
docker compose --env-file /etc/portfolio/production.env -f docker-compose.production.yml build --pull
docker compose --env-file /etc/portfolio/production.env -f docker-compose.production.yml up -d --remove-orphans
```

`<validated-sha>` doit avoir passé la CI et `npm run verify`. Ne déployez pas
une branche locale ou un arbre de travail modifié.

Vérifier ensuite :

```sh
docker compose --env-file /etc/portfolio/production.env -f docker-compose.production.yml ps
curl --fail --location https://<portfolio-domain>/
curl --fail --location https://<portfolio-domain>/en/
curl --fail --location https://<portfolio-domain>/robots.txt
curl --fail --location https://<portfolio-domain>/sitemap-index.xml
```

Contrôles manuels à effectuer sur le domaine final : page 404, redirections,
en-têtes de sécurité, absence de `noindex`, bascule FR/EN, thèmes, clavier et
largeur mobile 320 px. Contrôler les journaux avec `docker compose logs` sans
les recopier dans un ticket : la configuration Nginx réduit volontairement les
données de requête journalisées.

## Retour arrière

1. Retrouver le SHA précédemment validé.
2. Réexécuter les commandes de déploiement avec ce SHA.
3. Vérifier les mêmes URL HTTPS et l’état du conteneur.

Le retour arrière ne nécessite ni changement DNS ni modification de la route
Caddy, tant que le nom du service et le réseau externe restent inchangés.

## Renouvellement et opérations

- Caddy renouvelle les certificats TLS ; vérifier ses journaux et son état via
  le runbook de `personal-infrastructure`.
- Appliquer les mises à jour du système, Docker et de Caddy depuis le dépôt
  d’infrastructure, puis redéployer le SHA du portfolio si nécessaire.
- Ne pas exposer `8080`, le socket Docker, un tableau d’administration ou un
  registre de logs au public.
- Ne pas ajouter de secret applicatif : le portfolio est statique. Le fichier
  d’environnement contient uniquement des paramètres de publication et reste
  hors Git.

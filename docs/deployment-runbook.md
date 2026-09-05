# Runbook de déploiement et retour arrière

Ce document décrit la publication du portfolio statique sur Cloudflare Workers
avec Static Assets. GitHub Actions est l’unique chemin normal de déploiement :
les pull requests sont validées sans secret, un mainteneur déclenche la preview
manuellement pour une référence relue, puis une fusion vers `main` publie la
production. Il n’existe ni serveur d’origine, ni conteneur, ni runtime
applicatif à administrer.

Aucun déploiement Cloudflare, changement DNS ou changement de registrar n’a été
effectué lors de la rédaction de ce runbook. Les opérations externes ci-dessous
restent à exécuter par Ethan ou avec son accord explicite.

## Contrat de production

- Astro génère uniquement `dist/` ; Workers Static Assets sert cet artefact sans
  SSR, Function, binding, base de données ou secret applicatif.
- La configuration Wrangler pointe vers `dist/`, sert `404.html` avec un statut
  404, conserve les URL Astro avec barre finale, désactive la route de
  production `workers.dev` et active explicitement les URL de preview.
- `SITE_URL=https://ethanbrosselard.com` et `SITE_NOINDEX=false` sont des paramètres du
  build de production.
- Toute preview est créée par `workflow_dispatch` avec une référence et un
  alias explicites, utilise `SITE_NOINDEX=true` et reste protégée par
  Cloudflare Access. `noindex` est une défense complémentaire, pas un contrôle
  d’accès. La référence demandée construit l’artefact sans secret ; seul un
  second job cloisonné dans l’environnement `preview`, fondé sur l’outillage de
  confiance de `main`, reçoit le jeton Cloudflare.
- `main` représente la production. Un déploiement ne démarre qu’après le succès
  du job de validation GitHub Actions sur le même SHA.
- Le domaine canonique est `https://ethanbrosselard.com`. `www` redirige
  définitivement vers l’apex en conservant chemin et paramètres.
- Aucun outil de mesure d’audience côté navigateur, cookie publicitaire ou de
  mesure d’audience, formulaire ou contenu tiers embarqué n’est activé au
  lancement. Cela n’exclut pas les métriques réseau agrégées de Cloudflare ni
  un cookie strictement nécessaire si une protection est déclenchée.

## Secrets et responsabilités

Le dépôt et l’artefact ne contiennent aucun secret. Les secrets suivants vivent
dans les environnements GitHub concernés, avec accès restreint :

| Secret                    | Environnement             | Usage                           | Règle                                           |
| ------------------------- | ------------------------- | ------------------------------- | ----------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID`   | `preview` et `production` | sélectionner le compte Workers  | ne jamais l’injecter dans le client             |
| `CLOUDFLARE_API_TOKEN`    | `preview` et `production` | envoyer une version ou déployer | jeton dédié, périmètre minimal, jamais dans Git |
| `CF_ACCESS_CLIENT_ID`     | `preview`                 | smoke test automatisé           | identifiant d’un service token Access dédié     |
| `CF_ACCESS_CLIENT_SECRET` | `preview`                 | smoke test automatisé           | secret masqué, rotation et expiration suivies   |

Trois variables GitHub non secrètes pilotent le flux :

| Variable                        | Portée | Valeur attendue                                              |
| ------------------------------- | ------ | ------------------------------------------------------------ |
| `CLOUDFLARE_WORKERS_SUBDOMAIN`  | dépôt  | sous-domaine du compte, sans `.workers.dev`                  |
| `CLOUDFLARE_PREVIEWS_ENABLED`   | dépôt  | `true` seulement après configuration des secrets et d’Access |
| `CLOUDFLARE_PRODUCTION_ENABLED` | dépôt  | absente ou `false` jusqu’au GO de bascule du domaine         |

Créer un jeton API depuis le modèle Cloudflare **Edit Cloudflare Workers** pour
chaque environnement, puis le limiter au seul compte et à la zone
`ethanbrosselard.com`. Les valeurs `preview` et `production` doivent être distinctes et
ne doivent pas permettre l’administration générale du compte. Le service token
Access utilise une règle `Service Auth` limitée aux previews du Worker. Aucun
secret ne doit apparaître dans les logs, les rapports de test, les commentaires
de pull request, `.env` ou `.dev.vars` du dépôt.

## Préparer Cloudflare une seule fois

1. Protéger les comptes GitHub, Cloudflare et le registrar avec 2FA. Créer les
   deux jetons API dédiés à GitHub Actions, limités au compte et aux opérations
   Workers nécessaires, sans réutiliser la valeur de preview en production.
2. Ajouter `ethanbrosselard.com` comme zone Cloudflare. Avant toute délégation des
   nameservers, inventorier et recopier les enregistrements existants,
   notamment A/AAAA/CNAME, MX, SPF, DKIM, DMARC, autres TXT et éventuels
   enregistrements de validation. Ne pas déplacer le registrar par défaut.
3. Vérifier l’inventaire depuis une source externe, puis seulement remplacer
   les nameservers chez le registrar. La messagerie et les autres services du
   domaine ne doivent pas être affectés par la migration du portfolio.
4. Créer une ressource Worker nommée exactement `portfolio`, sans domaine
   personnalisé ni contenu du portfolio. Désactiver sa route de production
   `workers.dev` et ses URL de preview pendant le bootstrap.
5. Dans Workers & Pages > `portfolio` > Access, protéger ce Worker en choisissant
   **Previews only** ; cette protection Worker (`preview_worker`) couvre les URL
   versionnées et les alias sans rendre le Custom Domain de production privé.
   L’activer avant d’envoyer la première version, autoriser Ethan pour la recette
   humaine, puis créer un service token séparé avec une règle `Service Auth`
   pour les smoke tests GitHub Actions.
6. Créer les environnements GitHub `preview` et `production`, ajouter les
   secrets selon le tableau précédent, puis définir
   `CLOUDFLARE_WORKERS_SUBDOMAIN` comme variable du dépôt. Restreindre
   `production` à `main` et y configurer obligatoirement un approbateur humain.
   Si le plan GitHub ne permet pas ce frein, conserver la production désactivée
   jusqu’à la mise en place d’un contrôle équivalent revu.
7. Vérifier que `wrangler.jsonc` désactive `observability`, `send_metrics` et
   l’instrumentation des dépendances. Dans Cloudflare, ne configurer ni Logpush,
   ni export OpenTelemetry, ni outil équivalent pour ce Worker.
8. Laisser Web Analytics désactivé. Ne pas activer Bot Fight Mode ni une règle
   Challenge en production sans besoin documenté et sans mise à jour préalable
   de la politique de confidentialité.
9. Laisser `CLOUDFLARE_PRODUCTION_ENABLED` absent ou à `false`. Une fois les
   étapes précédentes vérifiées, passer uniquement
   `CLOUDFLARE_PREVIEWS_ENABLED` à `true` afin d’autoriser la répétition privée.

À la fin de cette préparation, déclencher la première preview. La configuration
versionnée réactive alors intentionnellement les URL de version tout en laissant
la route `workers.dev` de production désactivée. Vérifier immédiatement que la
politique Access couvre chaque URL de preview, que la sonde sans identifiant est
refusée et que le smoke test authentifié réussit.

## Préparer la bascule du domaine

Avant toute bascule, vérifier si l’apex sert déjà un autre service. La variable
de production est évaluée dès la fin de la CI : elle doit donc être activée **avant** le run CI
destiné à la release, tandis que l’approbation obligatoire de l’environnement
retient le déploiement jusqu’au cutover. Suivre cet ordre :

1. après validation de la preview et GO explicite, relever une dernière fois les
   enregistrements A, AAAA ou CNAME de l’apex et de `www`, puis vérifier que MX,
   SPF, DKIM, DMARC et les autres TXT sont inchangés ;
2. confirmer que le service web existant accepte HTTPS, puis activer **Always
   Use HTTPS** dans Cloudflare, ou une Redirect Rule HTTP → HTTPS équivalente,
   et vérifier une redirection permanente sans boucle ;
3. créer ou remplacer, uniquement si l’inventaire l’autorise, l’enregistrement A
   **proxifié** de `www` vers l’adresse réservée `192.0.2.0`, puis une Redirect
   Rule permanente vers `https://ethanbrosselard.com` qui conserve le chemin et la
   chaîne de requête. Vérifier cette redirection avant d’ouvrir la gate ;
4. passer `CLOUDFLARE_PRODUCTION_ENABLED` à `true`, puis fusionner la release
   relue vers `main` ou relancer la CI issue d’un `push` sur son SHA courant. Le
   job `production` doit apparaître en attente d’approbation ; s’il est ignoré,
   ne toucher ni à l’apex ni au Worker et déclencher un nouveau run CI ;
5. comparer au HEAD courant de `main` le SHA du run CI déclencheur affiché par
   GitHub, conserver la valeur de l’ancien enregistrement, puis retirer
   uniquement l’enregistrement web de l’apex incompatible ;
6. approuver l’environnement `production`. Le workflow refuse lui-même un SHA
   devenu obsolète, puis `wrangler deploy` attache le Custom Domain
   `ethanbrosselard.com`, crée le DNS associé et demande le certificat géré ;
7. attendre que HTTPS réponde, puis laisser le smoke test confirmer HTTP →
   HTTPS, `www` → apex, les chemins, les paramètres et les pages ;
8. ne jamais conserver deux origines publiques qui servent le même HTML.

Si le Custom Domain ou le smoke test échoue, remettre la variable à `false` et
restaurer l’ancien enregistrement web plutôt que modifier les enregistrements de
messagerie. Après une première production réussie, garder l’approbation humaine
sur l’environnement pour chaque release.

## Flux GitHub Actions

### Pull request sans secret

Le workflow de pull request installe les dépendances avec `npm ci` et exécute la
validation requise du dépôt. Il n’accède à aucun environnement GitHub contenant
les secrets Cloudflare ou Access et ne publie rien. Cette séparation évite
d’exécuter automatiquement du code de pull request avec des identifiants de
déploiement.

### Preview déclenchée manuellement

Après relecture de la pull request, un mainteneur autorisé lance le workflow
`workflow_dispatch` depuis la définition présente sur `main`, en indiquant la
référence Git exacte à tester et un alias de preview explicite. Toute exécution
du workflow lui-même depuis une autre branche est refusée. Le workflow doit :

1. résoudre et consigner le SHA correspondant à la référence demandée ;
2. installer avec `npm ci`, refaire la validation et construire avec
   `SITE_NOINDEX=true`, dans un premier job qui ne reçoit aucun secret ;
3. transmettre uniquement `dist/` comme artefact immuable au second job ;
4. dans un second job cloisonné par l’environnement `preview`, charger
   l’outillage de déploiement depuis `main`, télécharger l’artefact et le
   revalider avant d’exposer le jeton Cloudflare ;
5. envoyer une version non promue avec `wrangler versions upload` et l’alias
   demandé ;
6. exposer l’URL et le SHA dans le résumé du workflow, tandis que Wrangler
   consigne l’identifiant de version sans exposer de secret ;
7. exiger qu’une requête sans identifiant soit bloquée par Access, puis exécuter
   le smoke test `preview` avec le service token ;
8. conserver le rapport comme artefact de CI selon la politique du dépôt.

Le mainteneur vérifie que le SHA de la preview correspond toujours à celui qu’il
entend fusionner. Une preview qui échoue au build, à Access, au smoke test ou au
contrôle `noindex` bloque la fusion.

### Production

Une fusion vers `main` déclenche le job de production après le job de
validation, jamais en parallèle. Le job :

1. construit avec `SITE_URL=https://ethanbrosselard.com` et `SITE_NOINDEX=false` ;
2. vérifie juste avant la publication que le SHA validé est toujours le HEAD de
   `main` et refuse toute version obsolète ;
3. publie avec `wrangler deploy` ;
4. associe le SHA Git au message de déploiement ; Wrangler consigne
   l’identifiant de version et l’horodatage ;
5. réessaie le smoke test jusqu’à six fois, avec dix secondes entre les
   tentatives, pendant que le domaine personnalisé commence à servir la
   nouvelle version ;
6. exécute immédiatement le smoke test de production ;
7. échoue si la publication, les métadonnées, les en-têtes, les redirections ou
   le domaine ne respectent pas le contrat de production.

Ne pas publier normalement avec `wrangler deploy` depuis un poste local. Une
commande manuelle n’est acceptable qu’en incident, avec cible résolue, accord
explicite et preuve conservée.

## Recette d’une preview

Ouvrir l’URL de version fournie par le workflow, passer l’authentification
Cloudflare Access, puis vérifier au minimum :

- accueil, projets, contact, pages légales et 404 en français et en anglais ;
- bascule de langue, thèmes, clavier, réduction du mouvement et largeur 320 px ;
- présence de `noindex, nofollow`, absence de canonical, sitemap, JSON-LD et
  métadonnées sociales ;
- en-têtes de sécurité, absence de cookie applicatif et cache attendu ;
- absence de ressource externe ou de mesure d’audience côté navigateur.

Le smoke test automatisé transmet les deux en-têtes Access sans les afficher :

```sh
CF_ACCESS_CLIENT_ID=<secret> \
CF_ACCESS_CLIENT_SECRET=<secret> \
npm run test:deployment -- \
  --url https://<version>-<worker>.<subdomain>.workers.dev \
  --mode preview \
  --report deployment-reports/preview.json
```

## Recette de production

Après le déploiement, exécuter :

```sh
npm run test:deployment -- \
  --url https://ethanbrosselard.com \
  --mode production \
  --check-http-redirect \
  --redirect-from https://www.ethanbrosselard.com \
  --report deployment-reports/production.json
```

Contrôler aussi depuis un navigateur et un réseau extérieur : certificat TLS
valide, HTTP vers HTTPS, absence de boucle, canonical unique, sitemap,
`robots.txt`, 404 réelle, en-têtes, cache, navigation FR/EN, thèmes et console
sans erreur. Vérifier l’absence de script
`static.cloudflareinsights.com/beacon.min.js`, de requête `/cdn-cgi/rum` et de
cookie lors d’une navigation ordinaire. La fiche de release conserve l’URL, le
SHA, l’identifiant Workers, les résultats et le GO.

## Retour arrière

Déclencher un rollback en cas de page blanche, navigation principale cassée,
fuite de donnée, violation CSP bloquante, erreur de domaine ou canonical,
régression d’accessibilité majeure ou erreurs HTTP généralisées.

1. Suspendre les nouvelles fusions vers `main` et identifier la dernière
   version Workers validée dans la fiche de release.
2. Dans Workers & Pages > Worker > Deployments, sélectionner cette version puis
   **Rollback**. En ligne de commande, uniquement avec autorisation explicite,
   l’équivalent est `npx wrangler rollback <version-id>`.
3. Vérifier que la version restaurée reçoit 100 % du trafic, sans modifier le
   DNS, le domaine personnalisé ou TLS.
4. Relancer immédiatement le smoke test de production et les contrôles manuels
   essentiels.
5. Créer une branche dédiée, appliquer un `git revert` du changement fautif,
   puis repasser par pull request et CI afin que `main` redevienne cohérente avec
   la production. Ne jamais réécrire l’historique.
6. Documenter cause, impact, durée, SHA fautif, version restaurée et prévention.

Le rollback Cloudflare rétablit le service rapidement ; le revert Git restaure
ensuite la vérité déclarative. Ne pas changer les nameservers ou supprimer le
Worker pour corriger un incident applicatif.

## Exploitation courante

- Examiner les échecs GitHub Actions et les versions Workers ; ne promouvoir
  qu’un SHA validé.
- Vérifier périodiquement le domaine, le certificat géré, les redirections et
  les alertes Cloudflare sans ajouter de suivi utilisateur.
- Suivre l’expiration du jeton API et du service token Access, puis les faire
  tourner avec une période de chevauchement maîtrisée.
- Refaire un exercice de rollback contrôlé après une évolution importante du
  pipeline.
- Relire les pages légales si les réglages de journaux ou de sécurité
  Cloudflare, leur durée, l’hébergement, les traitements ou la mesure d’audience
  changent. Vérifier aussi périodiquement le DPA et la liste des sous-traitants
  Cloudflare.

## Références officielles

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Sites statiques et page 404](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- [En-têtes Static Assets](https://developers.cloudflare.com/workers/static-assets/headers/)
- [GitHub Actions pour Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [URL de preview Workers](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/)
- [Cloudflare Access pour Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)
- [Service tokens Access](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/)
- [Domaines personnalisés Workers](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Redirection de `www` vers l’apex](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/#redirect-between-www-and-root-domain)
- [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [Rollbacks Workers](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)
- [Cloudflare Privacy Policy](https://www.cloudflare.com/policies/privacy/)
- [Cloudflare Data Processing Addendum](https://www.cloudflare.com/cloudflare-customer-dpa/)

# Runbook SEO, indexation et visibilité du portfolio

Ce document décrit la procédure complète pour publier le portfolio avec des
signaux SEO corrects, le déclarer à Google, puis suivre son indexation. Il
complète le [runbook de déploiement](deployment-runbook.md) : ce dernier reste
la référence pour les previews, le DNS initial, les secrets et le retour
arrière.

Il ne faut ni enregistrer de jeton, ni copier une valeur de validation DNS, ni
placer d'identifiant Cloudflare dans ce document ou dans le dépôt.

## État obtenu le 8 septembre 2026

Les opérations suivantes ont été réalisées pour la première mise en ligne
indexable :

- la production a été reconstruite par GitHub Actions avec
  `SITE_URL=https://ethanbrosselard.com` et `SITE_NOINDEX=false` ;
- le domaine canonique est `https://ethanbrosselard.com/` ;
- HTTP redirige définitivement vers HTTPS ;
- `https://www.ethanbrosselard.com/` redirige définitivement vers le domaine
  canonique ;
- `https://ethanbrosselard.com/sitemap-index.xml` est publié et
  `robots.txt` le référence ;
- l'accueil publie une canonical, des alternates de langue, une URL Open Graph
  et les URL JSON-LD absolues ;
- la propriété Domaine `ethanbrosselard.com` a été validée dans Google Search
  Console, le sitemap a été envoyé et l'indexation de l'accueil a été demandée.

Ces signaux permettent à Google de découvrir et d'interpréter le site ; ils ne
garantissent ni un délai précis d'indexation ni une position donnée dans les
résultats.

## 1. Préparer une production indexable

### Règle de déploiement

Ne pas publier normalement depuis un poste local avec `wrangler deploy`.
Une publication manuelle peut construire sans `SITE_URL`, ce qui retire les
canonical, le sitemap et les URL absolues. Le chemin normal est : branche
courte, pull request, CI, fusion vers `main`, puis workflow **Deploy
production**.

Le workflow de production construit déjà avec :

```text
SITE_URL=https://ethanbrosselard.com
SITE_NOINDEX=false
```

Avant de le déclencher, vérifier dans GitHub :

1. **Settings > Secrets and variables > Actions > Variables** :
   `CLOUDFLARE_PRODUCTION_ENABLED` vaut `true`.
2. **Settings > Environments > production** :
   `CLOUDFLARE_ACCOUNT_ID` et `CLOUDFLARE_API_TOKEN` sont présents comme
   secrets d'environnement.
3. L'environnement `production` reste limité à `main` et son approbation
   humaine est conservée.

Pour redéployer un SHA déjà présent sur `main`, relancer le dernier workflow
**CI** déclenché par un `push` sur ce SHA. Une CI réussie déclenche ensuite
**Deploy production**. Approuver l'environnement `production` si GitHub le
demande.

### Jeton Cloudflare de production

Créer un jeton Cloudflare dédié à la production depuis le modèle **Edit
Cloudflare Workers**. Garder les permissions préremplies du modèle, sans
choisir « Select all » ni ajouter de droits non nécessaires. Les permissions
relatives aux routes doivent être limitées à la zone
`ethanbrosselard.com`; les permissions Workers nécessaires au déploiement sont
naturellement de portée compte.

Ne pas filtrer ce jeton par adresse IP : les exécuteurs GitHub Actions n'ont
pas une IP stable. Enregistrer sa valeur uniquement dans le secret GitHub
`production` `CLOUDFLARE_API_TOKEN`, jamais dans un fichier local, un rapport,
un journal ou un message. Après un remplacement validé, révoquer l'ancien
jeton seulement s'il n'est utilisé par aucun autre environnement.

## 2. Préparer les redirections Cloudflare

Le domaine sans `www` est le seul domaine canonique. La variante `www` ne doit
jamais servir le même contenu.

1. Conserver un enregistrement DNS `www` proxifié par Cloudflare, réservé à la
   redirection, conformément au runbook de déploiement.
2. Dans **Rules > Redirect Rules**, créer une règle permanente qui ne cible que
   `www.ethanbrosselard.com` et redirige vers
   `https://ethanbrosselard.com` en conservant le chemin et les paramètres.
   Une cible dynamique possible est :

   ```text
   concat("https://ethanbrosselard.com", http.request.uri.path)
   ```

   Utiliser le statut `301` et activer **Preserve query string**.

3. Dans **SSL/TLS > Edge Certificates**, activer **Always Use HTTPS**. Ne pas
   ajouter une seconde règle générale HTTP vers HTTPS lorsque cette option est
   active.

Ne pas modifier les enregistrements MX, SPF, DKIM, DMARC ou les autres TXT en
créant la redirection.

## 3. Vérifier la publication avant de déclarer le site à Google

Le workflow exécute ce smoke test ; il peut aussi être lancé en lecture seule
après le déploiement :

```sh
npm run test:deployment -- \
  --url https://ethanbrosselard.com \
  --mode production \
  --check-http-redirect \
  --redirect-from https://www.ethanbrosselard.com
```

Les résultats attendus sont :

| Adresse ou signal                  | Résultat attendu                                               |
| ---------------------------------- | -------------------------------------------------------------- |
| `http://ethanbrosselard.com/`      | redirection permanente vers `https://ethanbrosselard.com/`     |
| `https://www.ethanbrosselard.com/` | redirection permanente vers le domaine sans `www`              |
| `/sitemap-index.xml`               | `200`, XML indexant les sitemaps du site                       |
| `/robots.txt`                      | ligne `Sitemap: https://ethanbrosselard.com/sitemap-index.xml` |
| accueil                            | `<link rel="canonical" href="https://ethanbrosselard.com/">`   |

Vérifier aussi les routes FR et EN, les alternates, la 404, le thème, la
navigation au clavier et la console navigateur selon le
[runbook de déploiement](deployment-runbook.md#recette-de-production).

## 4. Ajouter le domaine dans Google Search Console

1. Ouvrir [Google Search Console](https://search.google.com/search-console/about).
2. Choisir **Ajouter une propriété**, puis le type **Domaine**.
3. Saisir `ethanbrosselard.com`, sans protocole et sans `www`.
4. Copier la valeur TXT donnée par Google.
5. Dans Cloudflare **DNS > Records**, ajouter un TXT au nom `@` avec cette
   valeur, sans supprimer les TXT existants.
6. Revenir dans Search Console et cliquer sur **Vérifier**.

Une propriété Domaine couvre les variantes HTTP, HTTPS, avec et sans `www`.

## 5. Envoyer le sitemap et demander l'indexation

Dans la propriété Domaine validée :

1. Ouvrir **Sitemaps**.
2. Saisir l'URL absolue suivante, puis envoyer :

   ```text
   https://ethanbrosselard.com/sitemap-index.xml
   ```

   Pour une propriété Domaine, un chemin seul tel que `sitemap-index.xml` peut
   être refusé comme adresse de sitemap invalide.

3. Attendre l'état **Success**. Une récupération réussie n'implique pas que
   toutes les pages soient indexées immédiatement.
4. Ouvrir **URL inspection**, saisir
   `https://ethanbrosselard.com/`, lancer **Test live URL**, puis choisir
   **Request indexing**.

Ne pas répéter cette demande pour la même URL. Le sitemap sert à faire
découvrir le reste des routes ; l'inspection est utile pour une poignée de
pages prioritaires, par exemple l'accueil français et anglais.

## 6. Suivre l'indexation sans surinterpréter les premiers jours

Pendant les premiers jours, les cartes **Performance**, **Pages** et **Core
Web Vitals** peuvent afficher « Processing data ». C'est normal pour une
nouvelle propriété.

Après quelques jours, vérifier :

- **Pages** : causes éventuelles d'exclusion et pages indexées ;
- **URL inspection** : canonical déclarée et canonical choisie par Google ;
- **Sitemaps** : absence d'erreur de traitement ;
- **Performance** : premières impressions, clics et requêtes ;
- **Core Web Vitals** : seulement lorsqu'il existe assez de données de terrain.

Les recherches suivantes sont des contrôles indicatifs, pas une mesure de
classement définitive :

```text
site:ethanbrosselard.com
"Ethan Brosselard"
```

Ajouter aussi `https://ethanbrosselard.com/` aux profils GitHub et LinkedIn
publics pertinents, avec le nom exact « Ethan Brosselard ». Ne pas acheter de
liens ni créer de faux profils ou d'annuaires artificiels.

## Dépannage

| Symptôme                                                       | Cause probable                               | Action sûre                                                                                                                                                      |
| -------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| canonical, sitemap et URL sociales absents                     | build lancé sans `SITE_URL`                  | redéployer via GitHub Actions, jamais par une commande locale ordinaire                                                                                          |
| `Authentication error [code: 10000]` pendant `wrangler deploy` | jeton de production insuffisant ou mal ciblé | créer un nouveau jeton dédié depuis **Edit Cloudflare Workers**, le remplacer dans le secret d'environnement `production`, puis relancer seulement le job échoué |
| `HTTP origin returned 200, expected a permanent redirect`      | HTTP n'est pas forcé vers HTTPS              | activer **Always Use HTTPS**, attendre la propagation puis relancer le job échoué                                                                                |
| `www` ne redirige pas ou perd le chemin                        | DNS proxifié ou Redirect Rule incomplets     | vérifier l'enregistrement `www`, la règle ciblée sur ce seul hôte et **Preserve query string**                                                                   |
| `Invalid sitemap address` dans une propriété Domaine           | URL de sitemap incomplète                    | soumettre l'URL absolue HTTPS du sitemap                                                                                                                         |

## Références

- [Google : rapport Sitemaps](https://support.google.com/webmasters/answer/7451001?hl=fr)
- [Google : demander une nouvelle exploration](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=fr)
- [Cloudflare : déployer des Workers avec GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Cloudflare : redirection d'un hôte vers un autre](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-all-different-hostname/)
- [Cloudflare : Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)

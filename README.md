# Portfolio — Ethan Brosselard

Portfolio bilingue d’Ethan Brosselard. La base utilise Astro, TypeScript strict, Tailwind CSS et des collections MDX typées.

## Démarrer

```sh
nvm use
npm install
npm run dev
```

## Vérifier

```sh
npm run verify
npm run generate:brand-assets
npm run test:container
npm run test:container:preview
npm run test:deployment -- --url https://preview.example --mode preview
npx playwright install --with-deps chromium firefox webkit
npm run test:lighthouse
npm run test:e2e
npm run check:links
```

La vérification teste le site avec une origine HTTPS réservée, puis recrée `dist/` sans faux domaine afin de contrôler les canonical, le sitemap et `robots.txt` sans laisser un artefact trompeur. En production, définir `SITE_URL` avec l’origine finale, sans chemin :

Les favicon, icône Apple touch et carte sociale sont des PNG déterministes générés depuis le langage visuel Violet Field avec `npm run generate:brand-assets`. Les fichiers finaux restent versionnés dans `public/` pour que le build de production ne dépende pas d’un navigateur.

Le manifeste [`docs/media-provenance.json`](docs/media-provenance.json) consigne leur origine et leur empreinte SHA-256. `npm run check:media`, inclus dans `npm run verify`, refuse tout média publiable non inventorié, toute modification non revue de ces fichiers et toute police embarquée tant que la politique reste fondée sur la pile système.

Les rôles, valeurs et règles d'évolution des tokens Violet Field sont consignés dans [`docs/design-system.md`](docs/design-system.md). Le build vérifie la présence des tokens requis et l'identité des variantes sombres explicite et système.

La promesse d'absence de suivi est contrôlée : seules les URLs de navigation externes sont autorisées, aucune ressource tierce ou API de suivi ne peut entrer dans le build, et les smoke tests locaux/distants refusent les réponses `Set-Cookie`. La préférence de thème reste l'unique valeur stockée dans le navigateur.

Les tests Playwright parcourent toutes les routes publiques en clair et sombre sur Chromium, Firefox, WebKit et leurs émulations mobiles. Le contrôle axe bloque les violations sérieuses ou critiques ; la suite vérifie aussi les noms et états des contrôles localisés, l'ordre de tabulation et la visibilité du focus, le fonctionnement sans JavaScript, le mouvement réduit, les cibles tactiles, le reflow aux équivalents CSS de zoom 200 % et 400 %, le CLS et un budget de transfert synthétique. Le contrôle des liens externes échoue uniquement lorsqu'une cible est confirmée absente (`404` ou `410`) afin de ne pas confondre limitation réseau et lien cassé.

L'audit Lighthouse mobile couvre l'accueil, la liste des projets et les deux aperçus avec le ralentissement synthétique standard et une origine HTTPS réservée pour reproduire les métadonnées de production. Il exige au moins 95 pour la performance, l'accessibilité, les bonnes pratiques et le SEO, ainsi qu'un LCP maximal de 2,5 s, un CLS maximal de 0,1 et un TBT maximal de 200 ms. Les rapports locaux sont écrits dans `lighthouse-reports/` sans être versionnés.

Les deux smoke tests Docker construisent les images publique et preview réellement utilisées par Coolify, attendent leur healthcheck, puis vérifient les en-têtes Nginx, la politique de cache, le statut de la 404 et les endpoints SEO propres à chaque mode avant de supprimer leurs conteneurs et images temporaires.

Le même moteur contrôle une URL Coolify sans modifier le déploiement. Il parcourt les douze routes FR/EN, la vraie 404, les en-têtes, les icônes et les signaux SEO propres au mode choisi :

```sh
npm run test:deployment -- \
  --url https://preview.example \
  --mode preview \
  --report deployment-reports/preview.json

npm run test:deployment -- \
  --url https://votre-domaine.example \
  --mode production \
  --check-http-redirect \
  --report deployment-reports/production.json
```

Une preview protégée peut recevoir une valeur complète d’en-tête `Authorization` via la variable d’environnement `DEPLOYMENT_AUTHORIZATION`. Cette valeur n’est ni affichée ni écrite dans le rapport et ne doit jamais être enregistrée dans le dépôt.

La préparation d’une publication et le retour arrière Coolify sont détaillés dans [`docs/deployment-runbook.md`](docs/deployment-runbook.md). Le rollback rapide dépend de la présence locale de l’ancienne image dans Coolify ; le runbook prévoit donc aussi un repli par commit `git revert`, sans réécriture de l’historique.

```sh
SITE_URL=https://votre-domaine.example npm run build
```

Pour une répétition sur une URL technique, définir également `SITE_NOINDEX=true`. Ce mode ajoute `noindex, nofollow` à toutes les pages, interdit le crawl dans `robots.txt` et supprime sitemap, canonical, alternates, JSON-LD et métadonnées sociales. Il ne remplace pas une protection d'accès Coolify. La production finale doit utiliser `SITE_NOINDEX=false`.

## Déployer sur le VPS OVHcloud

`docker-compose.production.yml` construit le site avec son domaine final, puis
le sert depuis un conteneur Nginx non privilégié sur le port interne `8080`.
Dans Coolify, créer une ressource Docker Compose depuis ce dépôt, définir
`SITE_URL=https://votre-domaine.example` et `SITE_NOINDEX=false`, puis associer le domaine au service
`portfolio` et au port `8080`. Le conteneur ne contient ni base de données ni
secret applicatif. Son système de fichiers racine est en lecture seule, toutes
les capabilities Linux sont retirées et seul un `/tmp` borné reste inscriptible.

Cloudflare Pages reste une alternative gratuite particulièrement adaptée à ce
site statique. Le chemin VPS permet toutefois d'héberger les trois projets sur
le serveur déjà acheté sans modifier l'architecture Astro.

## Architecture

- `src/pages/` contient les routes françaises et anglaises.
- `src/components/pages/` contient les pages partagées entre les langues.
- `src/content/projects/` contient une entrée MDX par projet et par langue.
- `npm run check:content` vérifie la parité factuelle et structurelle des paires de projets FR/EN.
- `src/data/profile.ts` contient les faits publics et les liens d’Ethan.
- `src/i18n/copy.ts` centralise les textes d’interface.
- `src/styles/global.css` contient les tokens et le système visuel.
- [`docs/content-backlog.md`](docs/content-backlog.md) liste les informations restant à fournir.
- [`docs/production-plan.md`](docs/production-plan.md) pilote toutes les étapes jusqu’à la mise en production et sa maintenance.
- `skills/maintain-portfolio/` guide les futures modifications assistées.

Le contenu des dépôts MyVerse et FiltreAppels est curaté dans ce dépôt. Le build ne dépend jamais de chemins locaux vers les projets sources.

## CV

Quand le contenu sera prêt, ajouter une page HTML `/cv/` et `/en/resume/`, puis générer un PDF téléchargeable depuis la même source. Tant qu’il n’existe pas, aucun lien CV n’est rendu.

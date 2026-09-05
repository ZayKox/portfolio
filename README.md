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
npm run test:deployment -- --url https://staging-portfolio.account-subdomain.workers.dev --mode preview
npx playwright install --with-deps chromium firefox webkit
npm run test:lighthouse
npm run test:e2e
npm run check:links
```

La vérification teste le site avec une origine HTTPS réservée, puis recrée `dist/` sans faux domaine afin de contrôler les canonical, le sitemap et `robots.txt` sans laisser un artefact trompeur. En production, définir `SITE_URL` avec l’origine finale, sans chemin :

```sh
SITE_URL=https://votre-domaine.example npm run build
```

`npm run check:toolchain`, inclus dans cette vérification, maintient l'alignement de Node et npm entre le poste local et GitHub Actions. Il contrôle aussi la configuration Workers statique, les workflows cloisonnés, les actions GitHub épinglées, la CI complète et la couverture Dependabot.

Le favicon, l’icône Apple touch et les cartes sociales sont des PNG déterministes générés depuis le langage visuel Violet Field avec `npm run generate:brand-assets`. Les fichiers finaux restent versionnés dans `public/` pour que le build de production ne dépende pas d’un navigateur.

Le manifeste [`docs/media-provenance.json`](docs/media-provenance.json) consigne leur origine, leurs dimensions, leur budget maximal et leur empreinte SHA-256. `npm run check:media`, inclus dans `npm run verify`, refuse tout média publiable non inventorié, toute modification non revue, tout PNG aux dimensions inattendues, tout dépassement de budget et toute police embarquée tant que la politique reste fondée sur la pile système.

Les rôles, valeurs et règles d'évolution des tokens Violet Field sont consignés dans [`docs/design-system.md`](docs/design-system.md). Le build vérifie la présence des tokens requis et l'identité des variantes sombres explicite et système.

La promesse d'absence de suivi est contrôlée : seules les URLs de navigation externes sont autorisées, aucune ressource tierce ou API de suivi ne peut entrer dans le build, et les smoke tests locaux/distants refusent les réponses `Set-Cookie`. La préférence de thème reste l'unique valeur applicative stockée dans le navigateur ; Cloudflare peut toutefois déposer un cookie strictement nécessaire si un mécanisme de sécurité est déclenché.

Les tests Playwright parcourent toutes les routes publiques en clair et sombre sur Chromium, Firefox, WebKit et leurs émulations mobiles. Le contrôle axe bloque les violations sérieuses ou critiques ; la suite vérifie aussi les noms et états des contrôles localisés, l'ordre de tabulation et la visibilité du focus, le fonctionnement sans JavaScript, le mouvement réduit, les cibles tactiles, le reflow aux équivalents CSS de zoom 200 % et 400 %, le CLS et un budget de transfert synthétique. Le contrôle des liens externes échoue uniquement lorsqu'une cible est confirmée absente (`404` ou `410`) afin de ne pas confondre limitation réseau et lien cassé.

L'audit Lighthouse mobile couvre l'accueil, la liste des projets et les deux aperçus avec le ralentissement synthétique standard et une origine HTTPS réservée pour reproduire les métadonnées de production. Il exige au moins 95 pour la performance, l'accessibilité, les bonnes pratiques et le SEO, ainsi qu'un LCP maximal de 2,5 s, un CLS maximal de 0,1 et un TBT maximal de 200 ms. Les rapports locaux sont écrits dans `lighthouse-reports/` sans être versionnés.

Le même moteur de smoke test contrôle les déploiements Cloudflare Workers sans les modifier. Il parcourt les dix-huit routes FR/EN, la vraie 404, les en-têtes, les icônes, la politique de cache et les signaux SEO propres au mode choisi :

```sh
npm run test:deployment -- \
  --url https://staging-portfolio.account-subdomain.workers.dev \
  --mode preview \
  --report deployment-reports/preview.json

npm run test:deployment -- \
  --url https://votre-domaine.example \
  --mode production \
  --check-http-redirect \
  --redirect-from https://www.votre-domaine.example \
  --report deployment-reports/production.json
```

Répéter `--redirect-from` pour chaque origine HTTPS secondaire publique. Le contrôle exige des redirections permanentes pour HTTP → HTTPS et pour chaque variante vers l’origine canonique, conserve les chemins profonds et paramètres, et refuse qu’une variante définisse un cookie. Omettre l’option tant que `www` ou une URL technique publique n’est pas configurée.

Une preview protégée est accessible à un humain via Cloudflare Access. Les smoke tests automatisés utilisent un service token Access transmis par `CF-Access-Client-Id` et `CF-Access-Client-Secret` ; ces valeurs vivent uniquement dans les secrets GitHub, ne sont ni affichées ni écrites dans les rapports et ne doivent jamais être enregistrées dans le dépôt.

La préparation d’une publication et le retour arrière Workers sont détaillés dans [`docs/deployment-runbook.md`](docs/deployment-runbook.md). Le runbook restaure d’abord une version Cloudflare validée, puis prévoit un repli Git par commit `git revert`, sans réécriture de l’historique.

Pour une preview, définir également `SITE_NOINDEX=true`. Ce mode ajoute `noindex, nofollow` à toutes les pages, interdit le crawl dans `robots.txt` et supprime sitemap, canonical, alternates, JSON-LD et métadonnées sociales. Il complète Cloudflare Access mais ne le remplace pas. La production finale utilise `SITE_NOINDEX=false`.

## Déployer sur Cloudflare Workers

Astro construit `dist/`, puis Cloudflare Workers Static Assets publie cet
artefact sans SSR, Function, base de données ni secret applicatif. Une preview
`SITE_NOINDEX=true`, protégée par Cloudflare Access, est déclenchée manuellement
depuis GitHub Actions pour une référence et un alias relus. Cette référence
construit l’artefact dans un job sans secret ; un second job recharge
l’outillage depuis `main`, revalide `dist/`, puis reçoit le jeton Cloudflare et
prouve que l’accès anonyme est bloqué. Une fusion vers `main` ne publie la
production qu’après les checks GitHub Actions requis, avec
`SITE_URL=https://ethanbrosselard.com` et `SITE_NOINDEX=false`, et si ce SHA est encore
le HEAD de `main`. Le domaine personnalisé, le DNS et TLS sont gérés dans la
zone Cloudflare ; aucune publication ou modification DNS ne doit être faite
depuis un poste local. Les secrets de déploiement restent dans les
environnements GitHub. Les previews restent inactives tant que
`CLOUDFLARE_PREVIEWS_ENABLED` ne vaut pas `true`, et la production possède son
propre verrou `CLOUDFLARE_PRODUCTION_ENABLED`.
Aucune mesure d’audience côté navigateur n’est activée au lancement ; les
métriques réseau agrégées propres à Cloudflare restent décrites dans la
politique de confidentialité.

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

Le contenu des dépôts Palimia et Ludosaic est curaté dans ce dépôt. Le build ne dépend jamais de chemins locaux vers les projets sources.

## CV

Quand le contenu sera prêt, ajouter une page HTML `/cv/` et `/en/resume/`, puis générer un PDF téléchargeable depuis la même source. Tant qu’il n’existe pas, aucun lien CV n’est rendu.

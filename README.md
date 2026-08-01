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
npm run test:container
npm run test:container:preview
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
npm run check:links
```

La vérification teste le site avec une origine HTTPS réservée, puis recrée `dist/` sans faux domaine afin de contrôler les canonical, le sitemap et `robots.txt` sans laisser un artefact trompeur. En production, définir `SITE_URL` avec l’origine finale, sans chemin :

Les tests Playwright parcourent toutes les routes publiques en clair et sombre sur Chromium, Firefox, WebKit et leurs émulations mobiles. Le contrôle axe bloque les violations sérieuses ou critiques ; la suite vérifie aussi le fonctionnement sans JavaScript, le mouvement réduit, les cibles tactiles, le CLS et un budget de transfert synthétique. Le contrôle des liens externes échoue uniquement lorsqu'une cible est confirmée absente (`404` ou `410`) afin de ne pas confondre limitation réseau et lien cassé.

Les deux smoke tests Docker construisent les images publique et preview réellement utilisées par Coolify, attendent leur healthcheck, puis vérifient les en-têtes Nginx, le statut de la 404 et les endpoints SEO propres à chaque mode avant de supprimer leurs conteneurs et images temporaires.

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
secret applicatif.

Cloudflare Pages reste une alternative gratuite particulièrement adaptée à ce
site statique. Le chemin VPS permet toutefois d'héberger les trois projets sur
le serveur déjà acheté sans modifier l'architecture Astro.

## Architecture

- `src/pages/` contient les routes françaises et anglaises.
- `src/components/pages/` contient les pages partagées entre les langues.
- `src/content/projects/` contient une entrée MDX par projet et par langue.
- `src/data/profile.ts` contient les faits publics et les liens d’Ethan.
- `src/i18n/copy.ts` centralise les textes d’interface.
- `src/styles/global.css` contient les tokens et le système visuel.
- [`docs/content-backlog.md`](docs/content-backlog.md) liste les informations restant à fournir.
- [`docs/production-plan.md`](docs/production-plan.md) pilote toutes les étapes jusqu’à la mise en production et sa maintenance.
- `skills/maintain-portfolio/` guide les futures modifications assistées.

Le contenu des dépôts MyVerse et FiltreAppels est curaté dans ce dépôt. Le build ne dépend jamais de chemins locaux vers les projets sources.

## CV

Quand le contenu sera prêt, ajouter une page HTML `/cv/` et `/en/resume/`, puis générer un PDF téléchargeable depuis la même source. Tant qu’il n’existe pas, aucun lien CV n’est rendu.

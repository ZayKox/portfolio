# Portfolio — Ethan Brosselard

Portfolio bilingue d’Ethan Brosselard, alias ZayKo. La base utilise Astro, TypeScript strict, Tailwind CSS et des collections MDX typées.

## Démarrer

```sh
nvm use
npm install
npm run dev
```

## Vérifier

```sh
npm run verify
```

La vérification teste le site avec une origine HTTPS réservée, puis recrée `dist/` sans faux domaine afin de contrôler les canonical, le sitemap et `robots.txt` sans laisser un artefact trompeur. En production, définir `SITE_URL` avec l’origine finale, sans chemin :

```sh
SITE_URL=https://votre-domaine.example npm run build
```

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

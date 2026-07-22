# Architecture du portfolio

## Principes

1. Générer un site statique rapide et simple à héberger.
2. Maintenir la parité entre le français et l’anglais.
3. Séparer les faits partagés, l’interface traduite et les récits de projets.
4. N’afficher aucun champ incomplet et ne jamais inventer de contenu personnel.
5. Ajouter du JavaScript uniquement pour une amélioration progressive utile.

## Flux de contenu

```text
profile.ts + copy.ts + projects/*.mdx
                 ↓
          composants Astro
                 ↓
          pages FR et EN
                 ↓
           build statique
```

## Internationalisation

Le français est la langue par défaut. Les routes anglaises vivent sous `/en/`. Chaque route transmet explicitement son équivalent au sélecteur de langue ; aucune redirection automatique n’est appliquée.

Le layout génère trois alternates sur les pages indexables : français, anglais et `x-default` vers le français. La validation du build contrôle leur réciprocité et leur résolution. La page 404 reste bilingue, mais ne publie ni canonical, ni alternate, ni données structurées.

## Projets

Chaque projet possède une entrée MDX par langue. Le frontmatter contient les données destinées aux cartes, métadonnées et indicateurs ; le corps contient le récit long. Les états autorisés sont :

- `draft` : non rendu ;
- `teaser` : page courte basée uniquement sur des faits validés ;
- `published` : étude de cas complète.

Le statut réel, les dates et les métriques produit restent absents tant qu’Ethan ne les a pas explicitement validés dans le questionnaire. Le format `teaser` est présenté comme un aperçu technique et ne vaut pas affirmation sur le niveau de maturité du produit.

## Domaine et SEO

Le build n’invente jamais de domaine. Sans `SITE_URL`, les liens internes restent relatifs et aucun canonical ou sitemap n’est émis. Avec une origine HTTPS finale dans `SITE_URL`, Astro produit les canonical, `og:url`, URL JSON-LD, `robots.txt` et le sitemap officiel. La 404 est exclue du sitemap.

## Sécurité

Astro génère une CSP par page. Les scripts inline sont placés après la balise CSP et chaque contenu exact est enregistré avec son hash SHA-256 ; la validation recalcule tous les hashes. `public/_headers` ajoute les protections HTTP compatibles Cloudflare Pages, notamment l’interdiction d’embarquement, `nosniff`, une politique de référent et une Permissions Policy restrictive.

Le site ne charge aucun script tiers, n’expose aucun secret et ne contient ni formulaire ni service dynamique. Toute évolution de ce périmètre doit mettre à jour la CSP et les contrôles du build.

## Validation statique

`npm run verify` contrôle le format, les types Astro, un build avec une origine HTTPS de test, puis recrée `dist/` sans faux domaine. `scripts/validate-build.mjs` vérifie les routes, liens internes, paires FR/EN, métadonnées, sitemap, robots, CSP, JSON-LD, structure HTML de base, contrastes des tokens principaux, budgets CSS/JS/HTML, placeholders et motifs de secrets courants.

## Contenu futur

Le modèle pourra accueillir sans refonte des expériences IA, outils, articles ou projets dans d’autres domaines. Le positionnement ne dépend donc pas d’une stack particulière.

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

## Projets

Chaque projet possède une entrée MDX par langue. Le frontmatter contient les données destinées aux cartes, métadonnées et indicateurs ; le corps contient le récit long. Les états autorisés sont :

- `draft` : non rendu ;
- `teaser` : page courte basée uniquement sur des faits validés ;
- `published` : étude de cas complète.

## Contenu futur

Le modèle pourra accueillir sans refonte des expériences IA, outils, articles ou projets dans d’autres domaines. Le positionnement ne dépend donc pas d’une stack particulière.

# Système visuel Violet Field — édition neutre

Ce document décrit le système effectivement rendu par le portfolio. La source exécutable reste `src/styles/global.css` : toute évolution d’une valeur doit modifier le CSS et cette référence dans le même changement.

## Principes

- Le noir, le blanc et les gris structurent l’identité, les surfaces et les actions principales.
- Le violet est une couleur secondaire : il signale le focus, les repères éditoriaux, les statuts et quelques détails de marque sans dominer les pages.
- Le vert et le jaune ne sont pas utilisés comme accents.
- La hiérarchie repose d’abord sur la typographie, l’espacement, les contrastes, les bordures et les surfaces.
- Les thèmes clair, sombre et système conservent la même structure et les mêmes rôles sémantiques.
- Les effets restent sobres, non essentiels et compatibles avec la réduction des animations.
- Les contrôles conservent un focus visible et une cible tactile d’environ 44 px.

## Couleurs

| Token                 | Clair                      | Sombre                      | Rôle                                      |
| --------------------- | -------------------------- | --------------------------- | ----------------------------------------- |
| `--bg`                | `#ecece8`                  | `#151619`                   | Fond principal neutre                     |
| `--surface`           | `#f5f5f1`                  | `#1c1d21`                   | Cartes et contrôles                       |
| `--surface-subtle`    | `#e2e2dd`                  | `#25272c`                   | Surface secondaire                        |
| `--surface-strong`    | `#d3d3cc`                  | `#2f3137`                   | Reliefs et ombres graphiques              |
| `--text`              | `#1b1c1f`                  | `#ecece8`                   | Texte principal                           |
| `--text-muted`        | `#606369`                  | `#afb1b7`                   | Texte secondaire                          |
| `--border`            | `#c4c5bf`                  | `#3a3c42`                   | Séparateurs et contours utiles            |
| `--primary`           | `#242529`                  | `#e8e8e3`                   | Actions et surfaces principales inversées |
| `--primary-hover`     | `#393b40`                  | `#d0d0cb`                   | Survol de l’action principale             |
| `--primary-contrast`  | `#f7f7f4`                  | `#1a1b1f`                   | Contenu sur surface principale            |
| `--accent`            | `#6746d6`                  | `#a890ff`                   | Signal violet secondaire et focus         |
| `--accent-hover`      | `#5033b5`                  | `#b9a6ff`                   | Survol d’un élément secondaire            |
| `--accent-soft`       | `#ebe7fb`                  | `#29223e`                   | Fond violet discret                       |
| `--accent-contrast`   | `#f7f7f4`                  | `#15111f`                   | Texte sur fond violet                     |
| `--accent-on-primary` | `#b39eff`                  | `#6746d6`                   | Accent violet sur surface principale      |
| `--info`              | `#2563eb`                  | `#60a5fa`                   | Information                               |
| `--danger`            | `#d43f5e`                  | `#ff7a8a`                   | Erreur ou danger                          |
| `--selection`         | `#d9d0f8`                  | `#4d4173`                   | Sélection de texte                        |
| `--shadow`            | `rgba(27, 28, 31, 0.1)`    | `rgba(0, 0, 0, 0.3)`        | Ombres                                    |
| `--grid-line`         | `rgba(27, 28, 31, 0.07)`   | `rgba(236, 236, 232, 0.06)` | Trame décorative                          |
| `--header-bg`         | `rgba(236, 236, 232, 0.9)` | `rgba(21, 22, 25, 0.9)`     | Fond translucide de l’en-tête             |

Le thème système réutilise exactement les valeurs sombres quand `prefers-color-scheme: dark` est actif et qu’aucun choix n’a été enregistré. Les paires texte/fond principales et violet/texte contrasté sont contrôlées au build avec un seuil de `4.5:1`. Axe et les tests navigateur complètent ce contrôle sur les composants rendus.

## Typographie

Les polices restent locales au système, sans requête tierce :

- `--font-display` : Space Grotesk si elle est présente, puis Avenir Next ou Segoe UI ;
- `--font-body` : Inter si elle est présente, puis une pile d’interfaces système ;
- `--font-mono` : JetBrains Mono si elle est présente, puis une pile monospace système.

L’échelle fluide est définie par `--display`, `--h1`, `--h2`, `--h3` et `--body-large`. Les titres sont plus amples, fortement resserrés et équilibrés. Le corps reste à `1rem` avec une hauteur de ligne de `1.65`.

## Géométrie et mise en page

| Token              | Valeur                      | Usage                       |
| ------------------ | --------------------------- | --------------------------- |
| `--radius-control` | `0.5rem`                    | Boutons et petits contrôles |
| `--radius-card`    | `0.8rem`                    | Cartes et grands panneaux   |
| `--container`      | `82rem`                     | Largeur maximale du contenu |
| `--gutter`         | `clamp(1.25rem, 4vw, 3rem)` | Marge latérale responsive   |

La composition est éditoriale et asymétrique : grands titres, filets nets, surfaces monochromes inversées et ombres graphiques sans flou excessif. Les pages doivent rester sans débordement à partir de `320px`, supporter le zoom et conserver un ordre DOM cohérent avec l’ordre visuel.

## Mouvement et interaction

| Token               | Valeur                           | Usage                      |
| ------------------- | -------------------------------- | -------------------------- |
| `--duration-fast`   | `140ms`                          | Réponse d’un contrôle      |
| `--duration-base`   | `220ms`                          | Transition de composant    |
| `--duration-reveal` | `450ms`                          | Apparition non essentielle |
| `--ease-out`        | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Courbe commune             |

Le changement de thème neutralise les transitions pendant une image afin d’éviter un contraste intermédiaire insuffisant. Avec `prefers-reduced-motion: reduce`, animations et transitions deviennent quasi instantanées. Aucun contenu ni aucune action ne dépend d’un mouvement, d’un survol ou d’une couleur seule.

Le focus clavier utilise le violet secondaire avec un contour de `0.19rem` et un décalage de `0.22rem`. Les éléments interactifs principaux visent au moins `2.75rem` ou `3rem` de hauteur.

## Marque et médias

La signature publique est `ZayKo` lorsqu’elle apporte un repère utile. Aucun monogramme abrégé n’est utilisé. Le favicon repose sur un signe géométrique sans lettres ; l’icône Apple touch et les cartes sociales sont générées de manière déterministe depuis les mêmes tokens. Ils utilisent une base sombre neutre et réservent le violet aux détails de signal et de profondeur.

Les futurs médias de projet doivent être approuvés, nettoyés de toute donnée privée, dimensionnés explicitement et optimisés avant intégration. Les images ne remplacent jamais une information textuelle essentielle.

## Règles d’évolution

1. Réutiliser un token existant avant d’ajouter une valeur locale.
2. Donner à tout nouveau token un rôle, pas le nom d’une page ou d’un composant.
3. Ajouter ensemble ses variantes clair, sombre et système lorsqu’il dépend du thème.
4. Garder les actions principales monochromes et réserver le violet aux signaux secondaires.
5. Vérifier contraste, focus, mouvement réduit, 320 px et les deux langues pour tout composant visible.
6. Mettre à jour ce document et la validation du build lorsqu’un token requis change.

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

| Token                 | Clair                       | Sombre                       | Rôle                                      |
| --------------------- | --------------------------- | ---------------------------- | ----------------------------------------- |
| `--bg`                | `#d8d6cf`                   | `#1b1c20`                    | Fond principal neutre                     |
| `--surface`           | `#e0ded7`                   | `#222328`                    | Cartes et contrôles                       |
| `--surface-subtle`    | `#d2d0c9`                   | `#2a2c32`                    | Surface secondaire                        |
| `--surface-strong`    | `#bebbb4`                   | `#34363d`                    | Reliefs et ombres graphiques              |
| `--text`              | `#292a2e`                   | `#d0cfc9`                    | Texte principal                           |
| `--text-muted`        | `#56595e`                   | `#989aa0`                    | Texte secondaire                          |
| `--border`            | `#adaea8`                   | `#42444b`                    | Séparateurs et contours utiles            |
| `--primary`           | `#2b2c30`                   | `#cecdc7`                    | Actions et surfaces principales inversées |
| `--primary-hover`     | `#3f4146`                   | `#b8b7b1`                    | Survol de l’action principale             |
| `--primary-contrast`  | `#e9e8e2`                   | `#202126`                    | Contenu sur surface principale            |
| `--accent`            | `#6241cc`                   | `#9e88ed`                    | Signal violet secondaire et focus         |
| `--accent-hover`      | `#4d31aa`                   | `#ae9af5`                    | Survol d’un élément secondaire            |
| `--accent-soft`       | `#ddd7f0`                   | `#302944`                    | Fond violet discret                       |
| `--accent-contrast`   | `#f1f0eb`                   | `#18151f`                    | Texte sur fond violet                     |
| `--accent-on-primary` | `#b39eff`                   | `#593abd`                    | Accent violet sur surface principale      |
| `--info`              | `#2563eb`                   | `#60a5fa`                    | Information                               |
| `--danger`            | `#d43f5e`                   | `#ff7a8a`                    | Erreur ou danger                          |
| `--selection`         | `#c9bfee`                   | `#4d4173`                    | Sélection de texte                        |
| `--shadow`            | `rgba(41, 42, 46, 0.13)`    | `rgba(0, 0, 0, 0.3)`         | Ombres                                    |
| `--grid-line`         | `rgba(41, 42, 46, 0.07)`    | `rgba(216, 215, 209, 0.055)` | Trame décorative                          |
| `--header-bg`         | `rgba(216, 214, 207, 0.92)` | `rgba(27, 28, 32, 0.92)`     | Fond translucide de l’en-tête             |

Le thème système réutilise exactement les valeurs sombres quand `prefers-color-scheme: dark` est actif et qu’aucun choix n’a été enregistré. Les paires texte/fond principales et violet/texte contrasté sont contrôlées au build avec un seuil de `4.5:1`. Axe et les tests navigateur complètent ce contrôle sur les composants rendus.

Les grandes compositions décoratives ne sont plus inversées en clair dans le thème sombre : le panneau de signature et le bandeau de contact restent sur des surfaces anthracite. Les contrastes fortement inversés sont réservés aux contrôles et aux accents de petite taille afin de limiter les pics de luminance.

## Typographie

Les polices restent locales au système, sans requête tierce :

- `--font-display` : Space Grotesk si elle est présente, puis Avenir Next ou Segoe UI ;
- `--font-body` : Inter si elle est présente, puis une pile d’interfaces système ;
- `--font-mono` : JetBrains Mono si elle est présente, puis une pile monospace système.

L’échelle fluide est définie par `--display`, `--h1`, `--h2`, `--h3` et `--body-large`. Les titres sont plus amples, fortement resserrés et équilibrés. Le corps reste à `1rem` avec une hauteur de ligne de `1.65`.

## Géométrie et mise en page

| Token                     | Valeur                         | Usage                                             |
| ------------------------- | ------------------------------ | ------------------------------------------------- |
| `--radius-control`        | `0.5rem`                       | Boutons et petits contrôles                       |
| `--radius-card`           | `0.8rem`                       | Cartes et grands panneaux                         |
| `--container`             | `82rem`                        | Largeur maximale du contenu                       |
| `--gutter`                | `clamp(1.25rem, 4vw, 3rem)`    | Marge latérale responsive                         |
| `--section-space`         | `clamp(2.25rem, 4vw, 3.75rem)` | Rythme vertical des sections                      |
| `--section-heading-space` | `clamp(1.25rem, 2.5vw, 2rem)`  | Écart entre introduction et contenu d’une section |

La composition est éditoriale et asymétrique : grands titres, filets nets, surfaces monochromes inversées et ombres graphiques sans flou excessif. Le rythme vertical est volontairement compact : les marges des sections, de leurs introductions et de leurs cartes sont réduites d’environ 60 % par rapport à la première composition, tout en conservant des séparateurs visuels nets. Ce rythme s’applique aussi aux bandeaux d’introduction, au CV, aux documents légaux et aux études de cas. Le header desktop est ramené à `3.6rem` sans réduire les cibles interactives de `2.75rem`. Sur l’accueil, le héros est plafonné à `38rem` et le bandeau de contact utilise le même rythme resserré afin de ne pas créer de plages vides aux extrémités de la page. Les pages doivent rester sans débordement à partir de `320px`, supporter le zoom et conserver un ordre DOM cohérent avec l’ordre visuel.

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

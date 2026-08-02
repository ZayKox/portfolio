# Système visuel Violet Field

Ce document décrit le système effectivement rendu par le portfolio. La source exécutable reste `src/styles/global.css` : toute évolution d'une valeur doit modifier le CSS et cette référence dans le même changement.

## Principes

- Le violet porte l'identité et les actions principales ; le vert et le jaune ne sont pas utilisés comme accents.
- La hiérarchie repose d'abord sur la typographie, l'espacement, les bordures et les surfaces.
- Les thèmes clair, sombre et système proposent la même structure et les mêmes rôles sémantiques.
- Les effets restent sobres, non essentiels et compatibles avec la réduction des animations.
- Les contrôles conservent un focus visible et une cible tactile d'environ 44 px.

## Couleurs

| Token               | Clair                       | Sombre                      | Rôle                              |
| ------------------- | --------------------------- | --------------------------- | --------------------------------- |
| `--bg`              | `#f8f7fc`                   | `#0e0b14`                   | Fond principal                    |
| `--surface`         | `#ffffff`                   | `#16111f`                   | Cartes et contrôles               |
| `--surface-subtle`  | `#f1eef8`                   | `#1e172a`                   | Surface secondaire                |
| `--text`            | `#17131f`                   | `#f7f3fc`                   | Texte principal                   |
| `--text-muted`      | `#655f70`                   | `#b9b0c5`                   | Texte secondaire                  |
| `--border`          | `#ded9e8`                   | `#332a40`                   | Séparateurs et contours utiles    |
| `--accent`          | `#6d28d9`                   | `#b595ff`                   | Action, focus et repère principal |
| `--accent-hover`    | `#5420a8`                   | `#c7b4ff`                   | État de survol de l'accent        |
| `--accent-soft`     | `#ede7ff`                   | `#291d40`                   | Fond violet discret               |
| `--accent-contrast` | `#ffffff`                   | `#170d22`                   | Texte sur fond accentué           |
| `--info`            | `#2563eb`                   | `#60a5fa`                   | Information                       |
| `--danger`          | `#d43f5e`                   | `#ff7a8a`                   | Erreur ou danger                  |
| `--selection`       | `#dacbff`                   | `#4b2b75`                   | Sélection de texte                |
| `--shadow`          | `rgba(50, 27, 78, 0.12)`    | `rgba(0, 0, 0, 0.32)`       | Ombres                            |
| `--grid-line`       | `rgba(87, 70, 112, 0.09)`   | `rgba(213, 196, 238, 0.07)` | Trame décorative                  |
| `--header-bg`       | `rgba(248, 247, 252, 0.84)` | `rgba(14, 11, 20, 0.84)`    | Fond translucide de l'en-tête     |

Le thème système réutilise exactement les valeurs sombres quand `prefers-color-scheme: dark` est actif et qu'aucun choix n'a été enregistré. Les paires texte/fond principales et accent/texte contrasté sont contrôlées au build avec un seuil de `4.5:1`. Axe et les tests navigateur complètent ce contrôle sur les composants rendus.

## Typographie

Les polices restent locales au système, sans requête tierce :

- `--font-display` : Space Grotesk si elle est présente, puis Avenir Next ou Segoe UI ;
- `--font-body` : Inter si elle est présente, puis une pile d'interfaces système ;
- `--font-mono` : JetBrains Mono si elle est présente, puis une pile monospace système.

L'échelle fluide est définie par `--display`, `--h1`, `--h2`, `--h3` et `--body-large`. Les titres utilisent une graisse `650`, un interlettrage resserré et `text-wrap: balance`. Le corps reste à `1rem` avec une hauteur de ligne de `1.65`.

## Géométrie et mise en page

| Token              | Valeur                      | Usage                       |
| ------------------ | --------------------------- | --------------------------- |
| `--radius-control` | `0.75rem`                   | Boutons et petits contrôles |
| `--radius-card`    | `1.25rem`                   | Cartes et grands panneaux   |
| `--container`      | `80rem`                     | Largeur maximale du contenu |
| `--gutter`         | `clamp(1.25rem, 4vw, 3rem)` | Marge latérale responsive   |

Les compositions doivent rester sans débordement à partir de `320px`, supporter le zoom et conserver un ordre DOM cohérent avec l'ordre visuel.

## Mouvement et interaction

| Token               | Valeur                           | Usage                      |
| ------------------- | -------------------------------- | -------------------------- |
| `--duration-fast`   | `140ms`                          | Réponse d'un contrôle      |
| `--duration-base`   | `220ms`                          | Transition de composant    |
| `--duration-reveal` | `450ms`                          | Apparition non essentielle |
| `--ease-out`        | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Courbe commune             |

Le changement de thème neutralise les transitions pendant une image afin d'éviter un contraste intermédiaire insuffisant. Avec `prefers-reduced-motion: reduce`, animations et transitions deviennent quasi instantanées. Aucun contenu ni aucune action ne doit dépendre d'un mouvement, d'un survol ou d'une couleur seule.

Le focus clavier utilise un contour violet de `0.19rem` avec un décalage de `0.22rem`. Les éléments interactifs principaux visent au moins `2.75rem` ou `3rem` de hauteur.

## Marque et médias

Le monogramme public actuel est `EB`. Le favicon, l'icône Apple touch et la carte sociale sont générés de manière déterministe depuis les tokens Violet Field. Ils ne constituent pas une validation définitive d'un logo ou d'une signature personnelle.

Les futurs médias de projet doivent être approuvés, nettoyés de toute donnée privée, dimensionnés explicitement et optimisés avant intégration. Les images ne remplacent jamais une information textuelle essentielle.

## Règles d'évolution

1. Réutiliser un token existant avant d'ajouter une valeur locale.
2. Donner à tout nouveau token un rôle, pas le nom d'une page ou d'un composant.
3. Ajouter ensemble ses variantes clair, sombre et système lorsqu'il dépend du thème.
4. Vérifier contraste, focus, mouvement réduit, 320 px et les deux langues pour tout composant visible.
5. Mettre à jour ce document et la validation du build lorsqu'un token requis change.

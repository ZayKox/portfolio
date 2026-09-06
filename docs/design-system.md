# Système visuel Violet Field — édition éditoriale

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
| `--bg`                | `#faf9f7`                   | `#141418`                    | Fond principal neutre                     |
| `--surface`           | `#ffffff`                   | `#1d1d23`                    | Cartes et contrôles                       |
| `--surface-subtle`    | `#f0efed`                   | `#25252d`                    | Surface secondaire                        |
| `--surface-strong`    | `#e4e2e8`                   | `#32323c`                    | Reliefs et ombres graphiques              |
| `--text`              | `#202024`                   | `#f0eff4`                    | Texte principal                           |
| `--text-muted`        | `#606069`                   | `#aaa9b5`                    | Texte secondaire                          |
| `--border`            | `#d9d8de`                   | `#3e3d48`                    | Séparateurs et contours utiles            |
| `--primary`           | `#242329`                   | `#f0eff4`                    | Actions et surfaces principales inversées |
| `--primary-hover`     | `#3f4146`                   | `#b8b7b1`                    | Survol de l’action principale             |
| `--primary-contrast`  | `#ffffff`                   | `#1d1d23`                    | Contenu sur surface principale            |
| `--accent`            | `#6241cc`                   | `#9e88ed`                    | Signal violet secondaire et focus         |
| `--accent-hover`      | `#4d31aa`                   | `#ae9af5`                    | Survol d’un élément secondaire            |
| `--accent-soft`       | `#eee9fb`                   | `#302944`                    | Fond violet discret                       |
| `--accent-contrast`   | `#ffffff`                   | `#18151f`                    | Texte sur fond violet                     |
| `--accent-on-primary` | `#b39eff`                   | `#593abd`                    | Accent violet sur surface principale      |
| `--info`              | `#2563eb`                   | `#60a5fa`                    | Information                               |
| `--danger`            | `#d43f5e`                   | `#ff7a8a`                    | Erreur ou danger                          |
| `--selection`         | `#c9bfee`                   | `#4d4173`                    | Sélection de texte                        |
| `--shadow`            | `rgba(41, 42, 46, 0.13)`    | `rgba(0, 0, 0, 0.3)`         | Ombres                                    |
| `--grid-line`         | `rgba(41, 42, 46, 0.07)`    | `rgba(216, 215, 209, 0.055)` | Trame décorative                          |
| `--header-bg`         | `rgba(250, 249, 247, 0.94)` | `rgba(20, 20, 24, 0.94)`     | Fond translucide de l’en-tête             |

Le thème système réutilise exactement les valeurs sombres quand `prefers-color-scheme: dark` est actif et qu’aucun choix n’a été enregistré. Les paires texte/fond principales et violet/texte contrasté sont contrôlées au build avec un seuil de `4.5:1`. Axe et les tests navigateur complètent ce contrôle sur les composants rendus.

Les grandes compositions ne sont plus inversées en clair dans le thème sombre : le panneau d’identité et de navigation du héros ainsi que le bandeau de contact restent sur des surfaces anthracite. Le panneau du héros combine la signature publique avec des liens vers les projets sélectionnés afin que cette surface soit informative et interactive, plutôt que seulement décorative. Les contrastes fortement inversés sont réservés aux contrôles et aux accents de petite taille afin de limiter les pics de luminance.

## Typographie

Les polices restent locales au système, sans requête tierce :

- `--font-display` : Avenir Next ou Segoe UI si présentes, puis Helvetica ou Arial ;
- `--font-body` : Inter si elle est présente, puis une pile d’interfaces système ;
- `--font-mono` : JetBrains Mono si elle est présente, puis une pile monospace système.

L’échelle fluide est définie par `--display`, `--h1`, `--h2`, `--h3` et `--body-large`. Les titres sont amples, fortement resserrés et équilibrés, avec le même niveau `--h1` pour l’accueil et les titres de page, puis des niveaux distincts pour les sections et les cartes. Le corps reste à `1rem` avec une hauteur de ligne de `1.65` ; `--text-small` et `--text-meta` normalisent les textes secondaires et les repères éditoriaux.

## Géométrie et mise en page

| Token                     | Valeur                        | Usage                                             |
| ------------------------- | ----------------------------- | ------------------------------------------------- |
| `--radius-control`        | `0.6rem`                      | Boutons et petits contrôles                       |
| `--radius-card`           | `1.25rem`                     | Cartes et grands panneaux                         |
| `--container`             | `76rem`                       | Largeur maximale du contenu                       |
| `--gutter`                | `clamp(1.25rem, 4vw, 3rem)`   | Marge latérale responsive                         |
| `--space-1`               | `0.6rem`                      | Micro-écart                                       |
| `--space-2`               | `0.75rem`                     | Écart compact                                     |
| `--space-3`               | `1rem`                        | Écart courant                                     |
| `--space-4`               | `clamp(1.25rem, 2vw, 1.5rem)` | Espacement interne des cartes                     |
| `--space-5`               | `clamp(1.75rem, 3vw, 2.5rem)` | Écart entre groupes de contenu                    |
| `--space-6`               | `clamp(1.75rem, 3.5vw, 3rem)` | Rythme vertical majeur                            |
| `--section-space`         | `clamp(3.5rem, 7vw, 6.5rem)`  | Rythme vertical partagé des sections              |
| `--section-heading-space` | `var(--space-5)`              | Écart entre introduction et contenu d’une section |
| `--page-hero-top-space`   | `clamp(2.5rem, 5vw, 4.5rem)`  | Écart entre le header et le début d’une page      |

La composition utilise un fond blanc cassé, des surfaces blanches et des séparateurs discrets en clair ; le sombre transpose cette hiérarchie sur trois niveaux anthracite. Les ombres sont diffuses, les angles adoucis et les accents violets limités aux repères, aux contrôles et à la profondeur des visuels.

Le conteneur est limité à 76rem. Le header desktop mesure au moins 4.75rem ; les contrôles gardent leurs cibles de 2.75rem et le sélecteur de thème est circulaire. Sur mobile, la navigation reste visible sur une seconde ligne, sans menu à ouvrir. Le pied de page sépare les liens de navigation des informations secondaires avec un filet et une seconde rangée.

L’accueil présente l’introduction et le panneau de signature, puis les projets, la méthode, le parcours et le contact. Le panneau conserve sa fonction de navigation, avec deux liens séparés par des filets. Sur tablette, il devient horizontal ; sur téléphone, il retrouve une seule colonne. Le titre reste à la même échelle que les autres pages : `--h1` vaut `clamp(2.75rem, 5.4vw, 5.25rem)`, avec une hauteur de ligne de 1.04. Les titres de section utilisent `clamp(2.1rem, 3.6vw, 3.5rem)`.

Les cartes de projets forment deux colonnes au-dessus de 48rem et une colonne en dessous. Une sous-grille aligne leurs visuels et le début des textes malgré des compositions de hauteurs différentes. Chaque carte conserve son ordre DOM : visuel, titre, statut, résumé, technologies, lien. Les actions s’alignent au bas des cartes. Les compositions CSS existantes de Palimia et Ludosaic restent des évocations, masquées aux technologies d’assistance ; aucune capture réelle ni nouvelle fonctionnalité n’est revendiquée. Les visuels adaptent leur hauteur au contenu pour ne rogner aucun libellé.

Les sections utilisent un rythme de 3.5rem à 6.5rem. L’enchaînement entre le héros d’accueil et les projets réduit l’espace supérieur de la seconde section pour éviter le cumul de deux grandes marges. Les pages intérieures partagent le composant `PageHero.astro`, le même écart supérieur et les mêmes alignements de titres ; les aperçus projet suivent également cette grille. Le récit conserve une colonne de lecture centrée. Les styles d’impression du CV restent dédiés au papier et les PDF sont régénérés après tout changement de source.

Les accueils FR/EN utilisent aussi `--h1` et un alignement supérieur fixe. À 480 px et moins, les repères des héros réservent deux lignes, y compris quand leur texte est court, pour garder les titres à la même hauteur lorsque le libellé d’accueil se replie. Le test d’alignement couvre les dix-huit routes, accueils inclus.

## Mouvement et interaction

| Token               | Valeur                           | Usage                      |
| ------------------- | -------------------------------- | -------------------------- |
| `--duration-fast`   | `140ms`                          | Réponse d’un contrôle      |
| `--duration-base`   | `220ms`                          | Transition de composant    |
| `--duration-reveal` | `450ms`                          | Apparition non essentielle |
| `--ease-out`        | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Courbe commune             |

Le changement de thème neutralise les transitions pendant une image afin d’éviter un contraste intermédiaire insuffisant. Avec `prefers-reduced-motion: reduce`, animations et transitions deviennent quasi instantanées. Aucun contenu ni aucune action ne dépend d’un mouvement, d’un survol ou d’une couleur seule.

Le focus clavier utilise le violet secondaire avec un contour de `0.19rem` et un décalage de `0.22rem`. Les éléments interactifs principaux visent au moins `2.75rem` ou `3rem` de hauteur. Le thème suit les changements de préférence système tant qu’aucun choix valide n’a été enregistré ; un stockage indisponible ne bloque pas le contrôle. Les boutons de thème et de copie restent masqués sans JavaScript. La copie d’adresse annonce son succès ou son refus dans une région de statut accessible.

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

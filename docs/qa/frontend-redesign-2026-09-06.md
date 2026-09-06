# Refonte frontend — 6 septembre 2026

## Périmètre

Refonte autorisée par Ethan pour présenter le portfolio à des entreprises, avec conservation du contenu. État initial : branche `develop`, worktree et index propres.

- Palette claire blanc cassé/blanc, sombre anthracite et contrastes renforcés ; violet secondaire conservé.
- Typographie, largeur de lecture, navigation, boutons, surfaces et pied de page retravaillés.
- Projets placés après l’introduction de l’accueil ; cartes en deux colonnes avec visuels et actions alignés, puis une colonne sur mobile.
- Compositions CSS Palimia et Ludosaic affinées sans image tierce ni nouvelle affirmation produit.
- Sources éditoriales runtime, récits, faits, liens, statuts et métadonnées inchangés. Aucun JavaScript ni dépendance ajouté.
- Dix-huit routes FR/EN et la 404 affectées par les styles partagés. PDF et cinq images de marque régénérés ; empreintes mises à jour.

## Validation locale

| Contrôle                                      | Résultat                                                                      |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| `npm run format` et `npm run verify`          | Réussite, dont types, parité, médias, fraîcheur PDF et trois modes de build   |
| Playwright Chromium, Firefox, mobile Chromium | 120 réussis, 15 ignorés selon le profil                                       |
| Playwright WebKit et mobile WebKit            | 77 réussis, 13 ignorés selon le profil                                        |
| Lighthouse mobile, six routes représentatives | 100/100 en performance, accessibilité, bonnes pratiques et SEO                |
| Budgets Lighthouse                            | LCP 902–903 ms, CLS maximal 0,001, TBT 0 ms                                   |
| Liens externes                                | 4 vérifiés, 0 cassé, LinkedIn non concluant (HTTP 999)                        |
| PDF FR/EN                                     | Deux pages par langue, quatre pages relues visuellement sans rognage constaté |

La première exécution native ne pouvait pas lancer WebKit faute de bibliothèques système. La recette a ensuite réussi dans l’image déjà disponible `mcr.microsoft.com/playwright:v1.62.1-noble`, avec l’utilisateur local et le dépôt monté dans `/work`. Aucune bibliothèque système n’a été installée.

Les tests couvrent les erreurs JavaScript/CSP, axe, les thèmes clair/sombre/système, le stockage indisponible, le clavier et le focus, la copie d’adresse, le mode sans JavaScript, la réduction des animations, les cibles tactiles et le reflow à partir de 320 px. Le nouveau scénario de `page-layout.spec.ts` contrôle les alignements des visuels/actions et l’ordre vertical mobile sur les accueils et listes de projets FR/EN. Les contrôles d’alignement des titres couvrent notamment 320, 375, 480, 768, 769, 1024 et 1440 px dans Chromium.

Relecture de captures de l’accueil FR clair/sombre et mobile, de l’accueil EN à 768 px, de la liste EN à 1024 px, d’À propos EN, de Contact FR et EN mobile, du CV FR, de Palimia sombre et des trois cartes sociales. Les captures et journaux intermédiaires sont des artefacts locaux non versionnés. Les rapports Lighthouse sont dans `lighthouse-reports/`, également ignoré par Git.

## Limites

Ces mesures sont des preuves techniques locales, pas des résultats utilisateurs ou de production. Les émulations ne remplacent pas un téléphone réel, Safari sur matériel Apple, le zoom réel du navigateur ou une recette au lecteur d’écran. La validation esthétique finale appartient à Ethan. Aucun déploiement ni publication externe n’a été effectué.

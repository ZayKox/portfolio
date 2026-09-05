# Audit de préparation à la production — 5 septembre 2026

## Verdict

Les défauts techniques confirmés par cette revue ont été corrigés localement. Le site conserve son architecture Astro statique et sa parité FR/EN. **Le GO de production reste ouvert** : certaines validations factuelles, la recette humaine et les preuves sur l’infrastructure réelle manquent encore.

État initial : branche `develop`, HEAD `3dddafdffa3879a40f16e86d5b76935a52f6d21d`, arbre de travail et index propres. Aucun push, déploiement, changement DNS ou modification de compte externe réalisé dans cette tâche.

## Périmètre

- Code Astro/TypeScript, composants, CSS, JavaScript progressif, schéma et collections MDX.
- Dix-huit routes publiques : accueil, Projets, À propos, CV, Contact, légal, confidentialité et deux aperçus dans chaque langue ; 404 bilingue séparée.
- Rendu clair/sombre, thème système, clavier, absence de JavaScript, presse-papiers, mobile et reflow ; captures des dix-neuf documents dans les deux thèmes, en 1440 et 320 px, mesures complémentaires à 800 px.
- Alignement des seize pages intérieures ; Chromium couvre aussi 1024 px et les deux côtés du breakpoint 768 px. L’accueil conserve son titre de héros plus grand, la 404 sa composition spécifique.
- SEO, liens, CSP, dépendances, confidentialité technique, configurations CI/Workers, PDF et médias.
- Questionnaire canonique, décisions prioritaires des sections 21–24, backlog et plan de production. La revue ne vaut pas certification juridique ou WCAG.

## Défauts corrigés

| Priorité | Constat vérifié                                                                                                                                                                                          | Correction et preuve                                                                                                                                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Titres décalés selon la page : à 1440 px, Projets/À propos commencent à y = 147,39 px, CV à 127,39 px et Contact/légal à 119,39 px. Les aperçus ajoutent encore une rangée de navigation avant le titre. | `PageHero.astro` partagé, retrait des surcharges locales de padding et du cumul marge/gap, même taille `--h1` sur les pages intérieures. Retour aux projets placé après le résumé. Après correction, ces titres commencent à x = 80 px, y = 131,39 px à 1440 px. Régression couverte dans `page-layout.spec.ts`. |
| P1       | Le visuel Palimia annonce cinq médias, alors que le périmètre validé le 31 août couvre films, séries et jeux vidéo. Le même écart existe dans le héros d’accueil, le CV et la carte sociale.             | Textes et composition FR/EN limités aux trois médias, compteur dérivé, carte sociale et PDF régénérés. Les MDX continuent d’expliquer explicitement les catégories différées.                                                                                                                                    |
| P1       | Le cadre à ratio fixe peut rogner les libellés internes de Palimia sur mobile sans provoquer de débordement de page.                                                                                     | Hauteur déterminée par le contenu pour cette composition ; test des bords supérieur et inférieur de la bibliothèque dans son cadre.                                                                                                                                                                              |
| P2       | WebKit mobile ajoute une bordure de 3 px à la racine après navigation dans l’environnement testé, décalant tous les contenus.                                                                            | Réinitialisation explicite `html { border: 0; }`, contrôlée par le test d’alignement interpages.                                                                                                                                                                                                                 |
| P2       | Le thème accepte une valeur persistée invalide, ne suit pas un changement du système pendant la visite et son initialisation dépend de l’accès au stockage.                                              | Valeurs `light`/`dark` seules admises, repli système indépendant du stockage, écoute de la préférence système jusqu’au choix visiteur, état accessible synchronisé. Tests FR/EN sur stockage refusé et préférence invalide.                                                                                      |
| P2       | Les styles d’affichage peuvent neutraliser `hidden`, laissant des boutons inopérants visibles sans JavaScript.                                                                                           | Masquage explicite des boutons de thème et de copie ; navigation et lien email restent utilisables.                                                                                                                                                                                                              |
| P2       | La copie d’email ne dispose pas d’annonce de statut et son refus est silencieux.                                                                                                                         | Région `role="status"`, succès et erreur localisés, prévention des appels concurrents, lien mail conservé. Tests de succès, refus puis nouvelle tentative, et absence de JavaScript.                                                                                                                             |
| P2       | Les PDF générés ne portent ni langue, ni structure balisée, ni plan de navigation.                                                                                                                       | Génération Playwright avec `tagged: true` et `outline: true`. Contrôle des deux PDF : langue `fr`/`en`, balisage, plan, deux pages A4, texte extractible et trois liens. Cela ne constitue pas une certification PDF/UA.                                                                                         |
| P2       | Le vérificateur de liens considère certaines réponses non-2xx, notamment 401/403, comme réussies.                                                                                                        | Statuts non-2xx classés indéterminés ; 404/410 restent des erreurs. Bilan distinguant vérifiés, indéterminés et cassés. Douze scénarios de réponse/repli/erreur réseau contrôlés pendant la revue.                                                                                                               |
| P2       | Le backlog demande encore des décisions déjà validées ; le plan présente les pages et téléchargements CV comme absents.                                                                                  | Documents dérivés actualisés sans inventer de nouvelle validation éditoriale.                                                                                                                                                                                                                                    |
| P2       | Lighthouse n’inclut pas les CV pourtant publics.                                                                                                                                                         | Ajout des CV FR/EN aux quatre routes représentatives existantes.                                                                                                                                                                                                                                                 |

La mention « solo » des deux projets dans le CV a aussi été retirée, faute de validation retrouvée. Le statut d’aperçu est désormais conditionné à `publication: teaser` dans les cartes et détails.

## Points restant avant publication

### P0 — Relire la traçabilité de certains détails personnels

Ces éléments préexistent à l’audit. Ils ne sont pas démontrés faux, mais leur validation explicite n’a pas été retrouvée dans les sources canoniques. Les dispositions d’`AGENTS.md` réservent la publication aux faits validés ; les décisions des sections 21–24 ne couvrent pas les détails ci-dessous. Il faut les confirmer et enregistrer cette décision dans le questionnaire, ou retirer les passages concernés des deux langues et régénérer les PDF.

| Source actuelle                                                     | Détails à confirmer                                                                                                     | Source canonique examinée                                                            |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/i18n/copy.ts`, `about.paragraphs[0]` FR/EN                     | Déclic pour l’informatique en cherchant à comprendre le fonctionnement des jeux vidéo.                                  | Questionnaire §4, questions sur le parcours d’origine encore sans réponse.           |
| `src/i18n/copy.ts`, `about.paragraphs[3]` FR/EN                     | Palimia serait né d’une inspiration liée à Letterboxd.                                                                  | Questionnaire §9, motivation et alternative antérieure non renseignées.              |
| `src/i18n/copy.ts`, `home.interests` et `about.paragraphs[3]` FR/EN | Liste des centres d’intérêt personnels.                                                                                 | Questionnaire §3 : `PUBLIC — À RELIRE`, pas `PUBLIC — VALIDÉ`.                       |
| `src/data/resume.json`, expérience Intento FR/EN                    | Application principale, collaboration avec le maître d’apprentissage, première expérience collective et C++.            | §21 valide poste, entreprise, dates et Paris, sans ces précisions.                   |
| `src/data/resume.json`, expérience Studio Beyowi FR/EN              | Attribution de Svelte, Docker, Git et PL/SQL à cette expérience.                                                        | §23 valide une autre liste détaillée ; ces quatre attributions n’y figurent pas.     |
| `src/data/resume.json`, études FR/EN                                | Sites précis, parcours détaillé du BUT et spécialités/options du bac (NSI, mathématiques, EPS, mathématiques expertes). | §21 valide établissements, diplômes, dates et mention ; §23 précise le nom du lycée. |

Le titre reste provisoire et large conformément aux instructions du dépôt. La signature ZayKo, l’email public, son exclusion du JSON-LD et le caractère personnel du site sont déjà validés : ils ne nécessitent pas une nouvelle décision pour cette revue.

### P0 — Prouver la bascule et le fonctionnement de l’hébergement

Les sondes publiques du 5 septembre confirment HTTP → HTTPS (308), mais l’apex HTTPS redirige encore vers un autre service (301) et `www` ne résout pas. Le portfolio n’est donc pas actuellement vérifié sur son domaine cible. Les détails du service existant ne sont pas reproduits ici.

Suivre `docs/deployment-runbook.md` pour :

1. Vérifier sur les comptes réels la CI du SHA final, les environnements GitHub, leurs protections et les secrets ; aucune inspection authentifiée de ces réglages n’a été réalisée ici.
2. Déployer la preview privée et prouver le refus des visiteurs anonymes par Access, puis le succès du smoke test authentifié.
3. Préserver les enregistrements existants, notamment la messagerie, avant toute bascule Cloudflare/DNS. Tester HTTP → HTTPS et `www` → apex avec conservation du chemin et de la requête.
4. Après le GO de release, vérifier les dix-huit routes, vraie 404, TLS, cache, en-têtes, canonical, alternates, robots, sitemap et JSON-LD sur Workers avec `test:deployment`.
5. Documenter la version déployée, la CI, la validation éditoriale et effectuer l’exercice de retour arrière.

Les contrats locaux de sécurité sont cohérents : génération statique, CSP hashée, JSON-LD échappé sans email, actions épinglées, séparation des secrets de preview et vérification du SHA de production. Les règles d’en-têtes et d’Access ont été confrontées aux documentations [Static Assets headers](https://developers.cloudflare.com/workers/static-assets/headers/) et [Cloudflare Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/). Leur configuration réelle reste à tester.

### P0 — Compléter la recette humaine requise par le plan

Les vérifications automatisées et les captures ne remplacent pas un lecteur d’écran, le zoom réel du navigateur et un téléphone physique. Aucun essai sur Safari macOS, iPhone réel ou Android réel n’est revendiqué. Relire également les textes légaux avec les réglages Cloudflare réellement déployés ; la conformité juridique complète n’est pas certifiée par cet audit.

### P2 — Maintenance et preuve documentaire

- Les PDF ont été comparés à leur source pour les passages modifiés, mais aucune vérification automatique de fraîcheur ne relie encore les fichiers téléchargés à l’ensemble des sources. Toute évolution du CV exige toujours `npm run generate:resume-pdfs`.
- LinkedIn refuse le contrôle automatisé avec HTTP 999 : vérification manuelle requise. Aucun lien cassé n’est démontré par ce refus.
- La CI bloque les violations axe sérieuses/critiques. La passe complémentaire de cet audit examine aussi les niveaux mineurs/modérés ; elle ne remplace pas les contrôles humains.

## Résultats et limites de validation

Les résultats finaux sont consignés ci-dessous après exécution des contrôles sur les fichiers corrigés. Ce sont des mesures locales et synthétiques, distinctes d’un impact utilisateur ou de résultats de production.

| Contrôle                                              | Résultat                                                                                                                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format`, `npm run verify`                    | Réussis : format, chaîne Node/npm, collections FR/EN, médias, redirections, typage Astro, builds indexable/preview/sans domaine. Dix-neuf documents HTML et dix-huit routes atteignables validés. |
| Playwright Chromium, Firefox, mobile Chromium         | **117 réussis, 15 non applicables ignorés**, 44,3 s.                                                                                                                                              |
| Playwright WebKit desktop et mobile, image officielle | **75 réussis, 13 non applicables ignorés**, 30,9 s.                                                                                                                                               |
| Total matrice navigateur                              | **192 réussis, 28 non applicables ignorés, zéro échec** sur la dernière exécution de chaque profil.                                                                                               |
| Passe visuelle complémentaire                         | 114 combinaisons route/thème/largeur mesurées (19 × 2 × 3), aucun débordement à 320, 800 ou 1440 px ; captures desktop/mobile examinées sur les gabarits principaux.                              |
| Axe complémentaire, tous niveaux                      | Aucune violation sur les 19 documents en clair/sombre à 1440 px, via le contrôle réel de changement de thème. Les tests E2E couvrent également les deux profils mobiles.                          |
| `npm run test:lighthouse`                             | **100/100** dans les quatre catégories sur chacune des six routes ; LCP 903–904 ms, CLS maximal arrondi 0,001, TBT 0 ms.                                                                          |
| Liens HTTPS externes                                  | 4 réponses 200, LinkedIn 999 indéterminé, aucun lien cassé confirmé.                                                                                                                              |
| `npm audit --json`                                    | **0 vulnérabilité** connue dans l’arbre installé, outillage de développement/déploiement inclus.                                                                                                  |
| PDF FR/EN                                             | Deux pages A4 chacun, texte extrait, liens présents, titre, langue, balisage et plan vérifiés avec pypdf ; quatre pages rendues et examinées avec pypdfium2.                                      |
| Git                                                   | Diff et format contrôlés ; seuls les fichiers de cette tâche sont destinés au commit local.                                                                                                       |

Environnement hôte : Node.js 22.23.0, npm 10.9.8, Playwright 1.62.1. WebKit natif échoue au démarrage faute de bibliothèques GTK/GStreamer ; les tests ont été exécutés avec succès dans l’image Playwright déjà disponible, sans modifier les bibliothèques de l’hôte. Le premier test d’alignement WebKit mobile a ensuite révélé le décalage de 3 px corrigé ci-dessus ; sa dernière exécution est verte.

Commandes de recette navigateur :

```sh
npm run test:e2e -- --project=chromium --project=firefox --project=mobile-chromium --workers=4

docker run --rm --init --ipc=host \
  --user 1000:1000 --env HOME=/tmp \
  --volume /home/ethan/Development/portfolio:/work --workdir /work \
  mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e \
  npx playwright test --project=webkit --project=mobile-webkit --workers=4

npm run test:lighthouse
node scripts/check-external-links.mjs
npm audit --json
```

Lighthouse conserve ses six rapports HTML/JSON sous `lighthouse-reports/`. Les rapports Playwright sont sous `playwright-report/` et `test-results/` (la dernière commande remplace le rapport précédent). Cette revue utilise l’installation locale existante ; l’installation depuis un checkout propre et la CI distante du commit final restent à joindre à la preuve de release.

Les captures et rapports détaillés sont des artefacts locaux non versionnés. Le présent rapport conserve les constats, le périmètre et les résultats ; les contrôles sont reproductibles depuis les scripts et tests du dépôt.

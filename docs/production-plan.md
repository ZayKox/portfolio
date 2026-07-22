# Plan de production du portfolio

> Feuille de route exécutable de l’état actuel jusqu’à la mise en production, puis à la maintenance.

## Pilotage

| Élément                     | Valeur                                                       |
| --------------------------- | ------------------------------------------------------------ |
| Propriétaire                | Ethan Brosselard                                             |
| Dépôt                       | <https://github.com/ZayKox/portfolio>                        |
| Branche de travail actuelle | `develop`                                                    |
| Branche de production       | `main`                                                       |
| Hébergement cible           | Cloudflare Pages, site Astro statique                        |
| Domaine recommandé          | `ethanbrosselard.dev`, à acheter et à revérifier avant achat |
| Langues                     | Français à la racine, anglais sous `/en/`                    |
| Dernière mise à jour        | 22 juillet 2026                                              |

### Légende

- `[x]` : terminé et vérifié localement.
- `[ ]` : à faire.
- **P0** : bloque la prochaine mise en production.
- **P1** : nécessaire pour la V1 éditoriale complète, mais peut rester masqué lors du premier lancement.
- **P2** : amélioration post-lancement.
- `[Ethan]` : information, achat, accès externe ou validation humaine nécessaire.
- `[Dev]` : changement dans le dépôt.
- `[QA]` : contrôle automatisé ou manuel.

Ne cocher une tâche qu’avec une preuve : commit, capture, URL, rapport de test ou validation écrite.

## Résultat visé

Le portfolio doit présenter Ethan comme un développeur polyvalent qui peut intervenir sur plusieurs types de produits. L’IA est un domaine d’intérêt, pas une spécialisation exclusive revendiquée. Le site vise d’abord la visibilité personnelle en France, reste intégralement bilingue et ne donne pas l’impression d’une recherche d’emploi active.

Deux jalons évitent de bloquer la publication sur les contenus qui seront fournis plus tard.

### Jalon A — lancement public minimal

Le site peut être publié lorsque :

- les pages principales FR/EN sont cohérentes et factuelles ;
- MyVerse et FiltreAppels sont clairement présentés comme des aperçus ;
- le CV, les expériences et tout contenu incomplet sont masqués ;
- le domaine, le SEO technique, les pages légales, la sécurité, l’accessibilité et les tests P0 sont terminés ;
- le déploiement et le retour arrière ont été testés.

### Jalon B — V1 éditoriale complète

La V1 est atteinte lorsque :

- la biographie et le parcours sont finalisés ;
- les deux projets ont une étude de cas FR/EN avec de vrais médias ;
- le CV HTML et ses PDF FR/EN sont publiés depuis une source unique ;
- la relecture factuelle et éditoriale complète est terminée.

Le jalon B est indépendant de la première mise en ligne. Une rubrique incomplète reste absente au lieu d’afficher un faux contenu ou un placeholder.

## Architecture de production retenue

```text
Ethan / contributeurs
        │
        ▼
GitHub : feature/* ou codex/* → develop → PR vers main
        │                              │
        │                              ├── GitHub Actions : format + types + build + tests
        │                              │
        ▼                              ▼
Cloudflare Preview               Cloudflare Production
URL de prévisualisation          ethanbrosselard.dev
                                       │
                                       ▼
                         HTML/CSS/JS/images statiques dans dist/
```

Choix structurants :

- Astro en génération statique, sans serveur, base de données, authentification ni CMS pour la V1.
- Tailwind CSS et TypeScript strict conservés.
- Contenus versionnés dans Git : faits partagés dans `src/data/`, interface dans `src/i18n/`, projets dans les fichiers MDX FR/EN.
- GitHub Actions valide le code ; Cloudflare Pages construit et sert `dist/`.
- `main` représente exactement la production. `develop` sert à intégrer les changements avant une pull request de release.
- Les déploiements de prévisualisation servent à la recette ; ils ne deviennent jamais la référence canonique.
- Aucun chemin local vers MyVerse ou FiltreAppels ne doit être requis pendant le build.

## État initial constaté

### Déjà en place

- [x] Astro 7, TypeScript strict, Tailwind CSS et MDX.
- [x] Génération entièrement statique.
- [x] Routes françaises et anglaises.
- [x] Navigation entre les langues.
- [x] Thèmes clair et sombre avec préférence système.
- [x] Direction artistique « Violet Field » sans vert ni jaune.
- [x] Données publiques centralisées dans `src/data/profile.ts`.
- [x] Textes d’interface centralisés dans `src/i18n/copy.ts`.
- [x] MyVerse et FiltreAppels disponibles en mode `teaser`.
- [x] Canonical, `hreflang`, métadonnées sociales de base et JSON-LD préparés dans le layout.
- [x] CI GitHub de base : installation propre, format, contrôle Astro/TypeScript et build.
- [x] Dependabot configuré.
- [x] Remote local corrigé vers le dépôt GitHub attendu.
- [x] Auteur du commit initial : `Ethan Brosselard <ethan.brosselard@gmail.com>`.
- [x] `main` suit `origin/main` localement.

### Restant avant le jalon A

- [ ] Configurer et vérifier le workflow GitHub distant.
- [ ] Acheter et connecter le domaine.
- [ ] Ajouter l’URL de production à Astro.
- [ ] Ajouter sitemap, `robots.txt` final et images sociales.
- [ ] Ajouter pages légales et confidentialité adaptées.
- [ ] Durcir les en-têtes et activer/tester la CSP.
- [ ] Ajouter les tests navigateur, accessibilité et liens.
- [ ] Faire la recette complète sur une prévisualisation Cloudflare.
- [ ] Tester le déploiement et le retour arrière.

## Chemin critique

```text
Périmètre de lancement validé
  → GitHub et branches sécurisés
  → domaine acheté
  → URL finale injectée dans Astro
  → SEO + légal + sécurité terminés
  → tests automatisés et recette humaine
  → preview Cloudflare acceptée
  → PR develop → main
  → déploiement production
  → smoke test
  → tag du jalon (`v0.1.0` minimal ou `v1.0.0` complet)
```

Les contenus longs, médias et CV avancent en parallèle. Ils ne bloquent le jalon A que si Ethan décide explicitement de les inclure au lancement.

## Phase 0 — figer le périmètre de lancement

**Priorité : P0**

- [ ] `[Ethan]` Choisir le jalon de lancement : A minimal ou B complet.
- [ ] `[Ethan]` Valider le titre temporaire « Développeur logiciel & créateur numérique », ou fournir le titre final.
- [ ] `[Ethan]` Valider qu’aucune recherche d’emploi n’est affichée.
- [ ] `[Ethan]` Valider que l’intérêt pour l’IA reste secondaire tant qu’aucun projet public ne le démontre.
- [ ] `[Ethan]` Confirmer les faits déjà publics : nom, Paris/France, français/anglais, email, GitHub et LinkedIn ; conserver le pseudo absent du site.
- [ ] `[Ethan]` Choisir si le portrait reste absent au lancement ; conserver le monogramme s’il n’y en a pas.
- [ ] `[Ethan]` Décider si le CV et les études de cas complètes sont requis pour le premier lancement.
- [ ] `[Dev]` Inscrire la décision de périmètre en haut de ce document.

**Gate 0 :** le contenu affichable au lancement est listé, et tout le reste est explicitement masqué.

## Phase 1 — sécuriser GitHub et le flux Git

**Priorité : P0**

### Identité et accès

- [x] `[QA]` Vérifier l’URL du remote local avec `git remote -v`.
- [x] `[QA]` Vérifier le nom et l’email du commit initial.
- [ ] `[Ethan]` Tester la clé SSH dédiée avec l’alias configuré localement.
- [ ] `[Ethan]` Vérifier dans GitHub que le dépôt appartient bien au compte lié depuis le portfolio.
- [ ] `[Ethan]` Activer l’authentification à deux facteurs du compte GitHub.
- [ ] `[Dev]` Publier `develop` et lui ajouter son upstream : `git push -u origin develop`.
- [ ] `[QA]` Vérifier sur GitHub que `main` et `develop` pointent vers les commits attendus.

### Branches et intégration

- [ ] `[Ethan]` Garder `main` comme branche par défaut et branche de production.
- [ ] `[Ethan]` Créer une règle de protection ou un ruleset pour `main`.
- [ ] `[Ethan]` Protéger aussi `develop` contre les force-pushes et suppressions si elle reste la branche d’intégration durable.
- [ ] `[Ethan]` Exiger une pull request avant fusion.
- [ ] `[Ethan]` Exiger le check GitHub Actions `verify`.
- [ ] `[Ethan]` Bloquer les force-pushes et la suppression de `main`.
- [ ] `[Ethan]` Appliquer les règles aux administrateurs si le plan GitHub le permet.
- [x] `[Dev]` Ajouter l’événement `push` sur `develop` à la CI si l’on veut aussi valider chaque intégration distante.
- [x] `[Dev]` Épingler les actions GitHub sur des SHA complets et laisser Dependabot proposer leurs mises à jour.
- [ ] `[QA]` Ouvrir une pull request de test vers `main` et confirmer que la fusion est bloquée tant que la CI n’est pas verte.

Convention :

- `feature/<sujet>` ou `codex/<sujet>` pour une évolution ;
- `fix/<sujet>` pour un correctif ;
- `develop` pour l’intégration ;
- `main` pour la production ;
- commits Conventional Commits, par exemple `docs: add production roadmap`.

**Gate 1 :** dépôt accessible avec le bon compte, branches distantes correctes, `main` protégée, PR de test et CI réussies.

## Phase 2 — constituer la vérité éditoriale

**Priorité : P1, sauf les textes déjà affichés qui sont P0**

### Identité et parcours

- [ ] `[Ethan]` Fournir une présentation brute en deux phrases.
- [ ] `[Ethan]` Fournir une biographie de trois à six paragraphes.
- [ ] `[Ethan]` Expliquer le point de départ dans l’informatique.
- [ ] `[Ethan]` Décrire la manière de travailler et les problèmes préférés.
- [ ] `[Ethan]` Lister les domaines déjà pratiqués et ceux seulement explorés.
- [ ] `[Ethan]` Confirmer les centres d’intérêt publiables.
- [ ] `[Ethan]` Fournir les expériences, études et certifications publiables.
- [ ] `[Ethan]` Identifier toute information confidentielle à exclure.
- [ ] `[Dev]` Rédiger d’abord la version française.
- [ ] `[Ethan]` Relire et valider chaque fait en français.
- [ ] `[Dev]` Traduire ensuite en anglais naturel.
- [ ] `[QA]` Vérifier la parité des deux langues.

Gabarit pour chaque expérience :

```text
Entreprise :
Intitulé exact :
Type de contrat :
Lieu / télétravail :
Dates :
Description publiable :
Responsabilités :
Résultats mesurables et source :
Technologies réellement utilisées :
Informations confidentielles à exclure :
```

Gabarit pour chaque formation ou certification :

```text
Établissement / organisme :
Intitulé exact :
Dates :
Diplôme ou certification obtenu :
Lien public éventuel :
Publication autorisée : oui/non
```

### Règles éditoriales

- [ ] Aucun fait inventé, aucune fausse métrique, aucun faux témoignage.
- [ ] Chaque chiffre indique sa date, son environnement et sa source.
- [ ] Les preuves locales sont nommées « validation locale », jamais « résultat de production ».
- [ ] Une section vide est masquée.
- [ ] Les libellés provisoires visibles, dont « Cette page évoluera » / « This page will evolve », sont remplacés par une information utile ou supprimés.
- [ ] Une technologie n’est mise en avant que si un projet ou une expérience la prouve.
- [ ] Les textes anglais sont localisés, pas traduits mot à mot.
- [ ] Chaque page possède un titre et une description uniques.

**Gate 2 :** les faits publiés sont validés par Ethan et identiques dans les deux langues.

## Phase 3 — produire les études de cas

**Priorité : P1 pour le jalon A, P0 pour le jalon B**

Les questionnaires détaillés restent dans `docs/content-backlog.md`. Le statut d’un projet ne passe de `teaser` à `published` qu’après le gate de cette phase.

### MyVerse

- [ ] `[Ethan]` Motivation et problème personnel initial.
- [ ] `[Ethan]` Public cible.
- [ ] `[Ethan]` Rôle exact et projet solo/équipe.
- [ ] `[Ethan]` Dates et temps consacré si publiables.
- [ ] `[Ethan]` Statut réel : utiliser « MVP avancé / bêta privée » tant qu’une production publique n’est pas prouvée.
- [ ] `[Ethan]` Visibilité du dépôt et lien éventuel.
- [ ] `[Ethan]` Démo accessible ou raison de son absence.
- [ ] `[Ethan]` Testeurs, retours et changements réellement induits.
- [ ] `[Ethan]` Décision technique la plus difficile.
- [ ] `[Ethan]` Fausse piste, compromis et enseignements.
- [ ] `[Ethan]` Résultat dont il est le plus fier.
- [ ] `[Ethan]` Limites et prochaines étapes.
- [ ] `[Ethan]` Détails de sécurité ou d’exploitation à ne pas publier.
- [ ] `[Dev]` Raconter le problème, le produit, l’architecture et trois deep dives techniques.
- [ ] `[Dev]` Montrer la normalisation multi-source, la frontière privé/public et les recommandations explicables si leur publication est autorisée.
- [ ] `[QA]` Étiqueter les tests et chiffres existants comme preuves locales datées.

### FiltreAppels

- [ ] `[Ethan]` Motivation et problème initial.
- [ ] `[Ethan]` Rôle exact et projet solo/équipe.
- [ ] `[Ethan]` Dates.
- [ ] `[Ethan]` État réel dans la Play Console.
- [ ] `[Ethan]` Date de publication visée.
- [ ] `[Ethan]` Visibilité du dépôt et décision sur un APK public.
- [ ] `[Ethan]` Appareils, constructeurs et versions Android testés.
- [ ] `[Ethan]` Scénarios d’appels réels validés.
- [ ] `[Ethan]` Bêta-testeurs et retours publiables.
- [ ] `[Ethan]` Décision technique difficile, compromis et limites.
- [ ] `[Ethan]` Résultat le plus important et prochaines étapes.
- [ ] `[Dev]` Raconter le modèle local-first, la priorité des règles, la normalisation des numéros, le chemin Telecom et la stratégie de repli.
- [ ] `[QA]` Séparer les tests automatisés des validations sur appareils et appels réels.

### Structure de chaque étude

1. Résumé : rôle, dates, statut et technologies essentielles.
2. Problème réel et contexte.
3. Contraintes et objectifs.
4. Réponse produit et parcours principal.
5. Architecture lisible.
6. Deux ou trois décisions techniques approfondies.
7. Qualité : tests, accessibilité, sécurité et performance.
8. Résultats vérifiables et limites.
9. Ce qui a été appris et prochaine étape.

**Gate 3 :** récit FR validé, traduction EN complète, médias disponibles, liens publics fonctionnels, statut exact et aucun détail sensible.

## Phase 4 — produire et assainir les médias

**Priorité : P1 pour le jalon A, P0 pour le jalon B**

### Inventaire MyVerse

- [ ] Couverture 16:9.
- [ ] Recherche multi-source.
- [ ] Import d’une œuvre.
- [ ] Fiche média.
- [ ] Bibliothèque personnelle.
- [ ] Statistiques.
- [ ] Recommandation avec explication.
- [ ] Profil ou liste publique.
- [ ] Deux à quatre vues mobiles.
- [ ] Démonstration vidéo courte.
- [ ] Diagramme d’architecture et de données.

### Inventaire FiltreAppels

- [ ] Couverture 16:9.
- [ ] Accueil et état de protection.
- [ ] Liste de règles.
- [ ] Création ou modification d’une règle.
- [ ] Testeur et règle gagnante.
- [ ] Plages ARCEP.
- [ ] Statistiques ou paramètres.
- [ ] Démonstration vidéo courte.
- [ ] Diagramme du chemin d’un appel.

### Traitement commun

- [ ] `[Dev]` Copier les médias retenus dans le portfolio ; ne jamais les importer depuis les dépôts voisins au build.
- [ ] `[QA]` Utiliser uniquement des données de démonstration.
- [ ] `[QA]` Retirer emails, numéros réels, clés, identifiants et notifications privées.
- [ ] `[QA]` Vérifier les droits sur les logos, affiches et œuvres visibles.
- [ ] `[QA]` Supprimer les métadonnées inutiles.
- [ ] `[Dev]` Produire WebP/AVIF, variantes responsives et dimensions explicites.
- [ ] `[Dev]` Ajouter un poster aux vidéos et éviter la lecture automatique avec son.
- [ ] `[Dev]` Écrire des alternatives FR/EN et une transcription quand la vidéo porte de l’information.
- [ ] `[QA]` Vérifier la netteté, le poids et l’absence de décalage de mise en page.

**Gate 4 :** aucun média sensible ou sans droit, toutes les dimensions sont définies et toute information visuelle a une alternative utile.

## Phase 5 — finaliser le design

**Priorité : P0 pour la cohérence actuelle, P1 pour les médias avancés**

- [ ] `[Dev]` Formaliser palette, typographies, espacements, rayons, bordures, ombres et mouvement dans les tokens existants.
- [ ] `[Ethan]` Choisir entre la pile système et des polices auto-hébergées avec licences vérifiées.
- [ ] `[Dev]` Finaliser le monogramme/signature si aucun logo n’est fourni.
- [ ] `[Dev]` Créer favicon SVG/PNG et icône Apple touch.
- [ ] `[Dev]` Créer une image Open Graph globale de 1200 × 630 px.
- [ ] `[Dev]` Créer une image Open Graph par projet si les visuels sont assez solides.
- [ ] `[Dev]` Intégrer les captures sans surcharger l’interface.
- [ ] `[Dev]` Présenter les compétences par domaines et preuves, jamais en pourcentages.
- [ ] `[Dev]` Rendre les captures agrandissables au clavier et au tactile si une lightbox est ajoutée.
- [ ] `[QA]` Vérifier toutes les routes en clair, sombre et préférence système.
- [ ] `[QA]` Vérifier mobile, tablette, desktop et écrans larges.
- [ ] `[QA]` Vérifier `prefers-reduced-motion`.

**Gate 5 :** aucun écran factice, aucune dépendance au survol, thèmes cohérents et direction « Violet Field » reconnaissable sans décor gratuit.

## Phase 6 — construire le CV depuis une source unique

**Priorité : P1 ; ne bloque pas le jalon A si tous ses liens restent masqués**

### Données requises

- [ ] `[Ethan]` Titre professionnel et résumé.
- [ ] `[Ethan]` Expériences et résultats autorisés.
- [ ] `[Ethan]` Formation et certifications.
- [ ] `[Ethan]` Compétences réellement pratiquées.
- [ ] `[Ethan]` Langues et niveaux exacts.
- [ ] `[Ethan]` Projets sélectionnés.
- [ ] `[Ethan]` Coordonnées à publier.

### Implémentation

- [ ] `[Dev]` Créer une source structurée unique, par exemple `src/data/resume.ts`.
- [ ] `[Dev]` Créer `/cv/` et `/en/resume/`.
- [ ] `[Dev]` Concevoir une version une colonne, lisible par les ATS et sans dépendance au graphisme.
- [ ] `[Dev]` Ajouter une feuille d’impression A4.
- [ ] `[Dev]` Générer un PDF FR et un PDF EN depuis la même source.
- [ ] `[Dev]` Conserver du texte sélectionnable et des liens cliquables.
- [ ] `[Dev]` Définir la langue, le titre et les métadonnées de chaque PDF.
- [ ] `[QA]` Vérifier ordre de lecture, coupures, marges et rendu en niveaux de gris.
- [ ] `[QA]` Comparer automatiquement ou manuellement HTML et PDF.
- [ ] `[Dev]` Activer les liens CV uniquement lorsque pages et PDF existent ensemble.

Ne pas publier adresse complète, date de naissance ou téléphone sans raison explicite.

**Gate 6 :** HTML et PDF FR/EN sont factuellement identiques, accessibles, imprimables et disponibles sans lien mort.

## Phase 7 — terminer SEO et partage

**Priorité : P0**

Cette phase dépend de l’achat du domaine, car Astro a besoin de l’URL finale pour les URL absolues et le sitemap.

- [ ] `[Ethan]` Acheter le domaine après une dernière vérification de disponibilité et de prix.
- [ ] `[Ethan]` Activer 2FA, verrouillage du domaine, renouvellement automatique et moyen de paiement de secours chez le registrar.
- [ ] `[Ethan/Dev]` Définir `SITE_URL` dans Cloudflare avec l’origine HTTPS du domaine finalement choisi.
- [x] `[Dev]` Installer et configurer `@astrojs/sitemap` conditionnellement à `SITE_URL`.
- [x] `[Dev]` Générer `robots.txt` depuis `Astro.site` ou synchroniser son URL manuellement.
- [x] `[Dev]` Ajouter `<link rel="sitemap">` lorsque `SITE_URL` est défini.
- [x] `[Dev]` Ajouter `x-default` aux alternates de langue.
- [x] `[QA]` Vérifier automatiquement canonical absolu et `hreflang` réciproque sur chaque paire FR/EN avec une origine de test ; répéter sur le domaine final.
- [x] `[QA]` Exclure du sitemap les pages réellement `noindex` et le contrôler dans le build avec domaine de test.
- [ ] `[Dev]` Ajouter `og:image`, dimensions, type MIME et texte alternatif social lorsque pertinent.
- [ ] `[Dev]` Choisir `summary_large_image` quand l’image 1200 × 630 est prête.
- [ ] `[QA]` Valider le JSON-LD et ne conserver que les propriétés vraies.
- [ ] `[Ethan]` Décider si l’email doit rester dans le JSON-LD ; le retrait est recommandé pour réduire le scraping, même si l’adresse reste visible sur la page Contact.
- [x] `[QA]` Vérifier automatiquement que chaque route importante est atteignable par des liens HTML depuis l’accueil.
- [ ] `[QA]` Tester les liens internes et externes, redirections comprises.
- [x] `[Dev]` Créer une 404 bilingue ou une 404 neutre permettant de choisir la langue.
- [ ] `[QA]` Vérifier que Cloudflare sert réellement cette page avec un statut 404.

**Gate 7 :** sitemap et robots accessibles, canonical/hreflang corrects, données structurées valides, aperçu social final et aucun lien cassé.

## Phase 8 — légal, données personnelles et consentement

**Priorité : P0**

Cette checklist organise le travail ; elle ne remplace pas un avis juridique adapté au statut exact d’Ethan.

- [ ] `[Ethan]` Déterminer si le site est édité à titre strictement personnel ou dans un cadre professionnel.
- [ ] `[Ethan]` Vérifier les mentions obligatoires applicables à ce statut auprès d’une source officielle ou d’un professionnel.
- [ ] `[Dev]` Créer `/mentions-legales/` et `/en/legal-notice/`.
- [ ] `[Dev]` Créer `/confidentialite/` et `/en/privacy/`.
- [ ] `[Dev]` Identifier l’éditeur, le moyen de contact et l’hébergeur avec les informations réellement exigées.
- [ ] `[Dev]` Expliquer les traitements existants : email public, journaux techniques de l’hébergeur et éventuelle mesure d’audience.
- [ ] `[Dev]` Indiquer finalités, bases, destinataires, durées, droits et moyen d’exercice lorsqu’ils s’appliquent.
- [ ] `[QA]` Confirmer qu’aucun formulaire, tracker ou service tiers n’est chargé sans être documenté.
- [ ] `[Ethan]` Accepter explicitement le risque de spam lié à l’email public, ou choisir une adresse dédiée.
- [ ] `[Ethan]` Décider de lancer sans analytics. C’est l’option P0 recommandée.
- [ ] `[Dev]` Si des analytics sont ajoutés plus tard, documenter la configuration et vérifier les critères CNIL avant de conclure à une exemption de consentement.
- [ ] `[Dev]` Si un traceur requiert le consentement, ne le charger qu’après choix positif et offrir un refus aussi simple.
- [ ] `[QA]` Vérifier les droits et crédits des polices, icônes, images, vidéos et contenus de tiers.

**Gate 8 :** statut de l’éditeur clarifié, pages légales publiées dans les deux langues, traitements réels documentés et aucun traceur non maîtrisé.

## Phase 9 — sécurité et confidentialité technique

**Priorité : P0**

Le site est statique et n’a besoin d’aucun secret en production. Toute future variable secrète doit rester côté serveur et ne jamais être préfixée pour être exposée au client.

- [x] `[Dev]` Activer `security.csp` dans Astro avec des directives minimales adaptées au site.
- [ ] `[QA]` Tester la CSP avec `npm run build` puis `npm run preview` ; Astro ne la simule pas en mode `dev`.
- [x] `[QA]` Vérifier que le bootstrap du thème et le JSON-LD inline sont placés après la CSP, couverts par leurs hashes exacts et sans `unsafe-inline`.
- [x] `[Dev]` Ajouter `public/_headers` pour les en-têtes servis par Cloudflare Pages.
- [x] `[Dev]` Interdire l’embarquement avec `frame-ancestors 'none'` dans un en-tête CSP et/ou `X-Frame-Options: DENY`.
- [x] `[Dev]` Ajouter `X-Content-Type-Options: nosniff`.
- [x] `[Dev]` Définir `Referrer-Policy: strict-origin-when-cross-origin` ou une politique plus restrictive validée.
- [x] `[Dev]` Désactiver les API inutiles avec `Permissions-Policy`, notamment caméra, microphone et géolocalisation.
- [x] `[Dev]` Ajouter `base-uri 'self'`, `object-src 'none'` et `form-action 'none'` tant qu’aucun formulaire n’existe ; passer à `'self'` seulement si un formulaire same-origin est ajouté.
- [ ] `[QA]` Vérifier les en-têtes avec `curl -I` sur la prévisualisation et la production.
- [ ] `[QA]` Vérifier la console navigateur sur toutes les routes pour détecter les violations CSP.
- [x] `[QA]` Rechercher automatiquement les placeholders et motifs de secrets courants dans le build `dist/` ; conserver une relecture humaine avant production.
- [x] `[QA]` Exécuter `npm audit --omit=dev --audit-level=high` et analyser chaque résultat, sans appliquer aveuglément un correctif majeur. Zéro vulnérabilité au 22 juillet 2026.
- [ ] `[Ethan]` Activer 2FA sur Cloudflare et utiliser des jetons à privilèges minimaux si une automatisation est ajoutée.
- [ ] `[QA]` Confirmer que les previews Cloudflare ne sont pas indexables.
- [ ] `[Dev]` Rediriger le domaine de production `*.pages.dev` vers le domaine canonique après connexion du domaine.

**Gate 9 :** aucune fuite de secret, aucune violation CSP fonctionnelle, en-têtes confirmés sur le réseau et previews non indexées.

## Phase 10 — accessibilité WCAG 2.2 AA

**Priorité : P0**

L’automatisation détecte seulement une partie des problèmes ; la recette humaine reste obligatoire.

### Automatisation

- [x] `[Dev]` Contrôler dans le build les contrastes des principaux tokens clair/sombre, le lien d’évitement, les noms de boutons, les alternatives d’images et les identifiants dupliqués.
- [ ] `[Dev]` Ajouter Playwright.
- [ ] `[Dev]` Ajouter `@axe-core/playwright`.
- [ ] `[Dev]` Tester toutes les routes publiques FR/EN.
- [ ] `[QA]` Refuser les violations axe `serious` et `critical`.
- [ ] `[QA]` Conserver le rapport comme preuve de release.

### Recette humaine

- [ ] `[QA]` Parcourir tout le site au clavier seul.
- [ ] `[QA]` Vérifier l’ordre de focus et sa visibilité en clair/sombre.
- [ ] `[QA]` Vérifier le lien d’évitement.
- [ ] `[QA]` Vérifier titres, régions, listes, liens et boutons sémantiques.
- [ ] `[QA]` Vérifier les noms accessibles du changement de langue et du thème.
- [ ] `[QA]` Vérifier contraste du texte, focus, bordures utiles et états interactifs.
- [ ] `[QA]` Vérifier que la couleur n’est jamais la seule information.
- [ ] `[QA]` Vérifier les cibles tactiles d’au moins 44 × 44 px lorsque possible.
- [ ] `[QA]` Tester 320 px de large sans défilement horizontal.
- [ ] `[QA]` Tester zoom navigateur à 200 %, puis reflow à 400 % sur les pages essentielles.
- [ ] `[QA]` Tester avec réduction des animations.
- [ ] `[QA]` Vérifier les alternatives des images et transcriptions des vidéos.
- [ ] `[QA]` Faire une passe lecteur d’écran sur l’accueil, un projet, le contact et le CV.
- [ ] `[QA]` Vérifier la prononciation avec `lang="fr"` et `lang="en"`.
- [ ] `[QA]` Vérifier que les erreurs éventuelles sont identifiées sans dépendre de la couleur.

**Gate 10 :** zéro violation axe sérieuse/critique, parcours clavier complet et checklist humaine WCAG 2.2 AA signée.

## Phase 11 — tests fonctionnels et qualité

**Priorité : P0**

### Tests à ajouter

- [x] `[Dev]` Ajouter une validation statique de toutes les routes et des budgets HTML/CSS/JS.
- [ ] `[Dev]` Ajouter `npm run test:e2e`.
- [ ] `[Dev]` Ajouter un smoke test de chaque route publique.
- [x] `[Dev]` Tester que chaque lien de langue mène à l’équivalent attendu.
- [ ] `[Dev]` Tester que le thème persiste et respecte la préférence système au premier chargement.
- [ ] `[Dev]` Tester les liens email, GitHub, LinkedIn et les CTA projet.
- [x] `[Dev]` Tester les canonical, alternates, titres et descriptions, avec et sans `SITE_URL`.
- [ ] `[Dev]` Tester la page 404 et son statut en environnement Cloudflare.
- [x] `[Dev]` Ajouter un contrôle des liens internes et de l’atteignabilité des routes.
- [ ] `[Dev]` Ajouter un contrôle séparé des liens externes avec une gestion explicite des faux positifs réseau.
- [ ] `[Dev]` Ajouter les tests E2E et accessibilité à GitHub Actions.
- [ ] `[Dev]` Ajouter ESLint seulement avec un jeu de règles utile et sans dupliquer les contrôles Astro/TypeScript.
- [ ] `[Dev]` Conserver les rapports Playwright en artefact seulement en cas d’échec ou pour une release.

### Matrice navigateur

- [ ] Chromium desktop et mobile.
- [ ] Firefox desktop.
- [ ] WebKit desktop et émulation mobile.
- [ ] Au moins un téléphone réel Android.
- [ ] Safari/iPhone réel si disponible ; sinon noter explicitement l’absence de preuve réelle.

### Commandes de base

```sh
nvm use
npm ci
npm run format
npm run verify
```

Commandes à rendre disponibles avant la release :

```sh
npm run test:e2e
npm run check:links
```

**Gate 11 :** installation depuis un checkout propre, CI verte, tests multi-navigateurs verts et aucun lien bloquant cassé.

## Phase 12 — performance et robustesse

**Priorité : P0**

Budgets de référence au 75e percentile réel après collecte suffisante :

- LCP ≤ 2,5 s ;
- INP ≤ 200 ms ;
- CLS ≤ 0,1.

Pour la recette synthétique avant lancement : viser un score Lighthouse d’au moins 95 sur performance, accessibilité, bonnes pratiques et SEO pour les pages représentatives, sans considérer le score comme une preuve suffisante à lui seul.

- [ ] `[Dev]` Garder le JavaScript client au strict nécessaire.
- [ ] `[Dev]` Dimensionner chaque image et utiliser les formats modernes.
- [ ] `[Dev]` Charger les médias sous la ligne de flottaison paresseusement.
- [ ] `[Dev]` Ne pas précharger de ressource sans bénéfice mesuré.
- [ ] `[Dev]` Auto-héberger les polices retenues et limiter graisses/sous-ensembles, ou conserver la pile système.
- [ ] `[QA]` Mesurer accueil, liste de projets, chaque étude et CV en mobile et desktop.
- [ ] `[QA]` Tester sous réseau et CPU ralentis.
- [ ] `[QA]` Vérifier l’absence de CLS lors du chargement des polices, images et vidéos.
- [ ] `[QA]` Vérifier le site sans JavaScript : lecture, navigation et contact doivent rester utiles.
- [ ] `[QA]` Vérifier le poids total des pages et documenter toute exception média.
- [ ] `[QA]` Tester la prévisualisation Cloudflare, pas seulement `localhost`.

**Gate 12 :** budgets synthétiques atteints ou écarts expliqués et acceptés, aucune régression visible sur réseau lent.

## Phase 13 — configurer Cloudflare Pages

**Priorité : P0**

Astro étant entièrement statique, aucun adaptateur Cloudflare n’est nécessaire.

### Compte et projet

- [ ] `[Ethan]` Créer ou sécuriser le compte Cloudflare avec 2FA.
- [ ] `[Ethan]` Dans Workers & Pages, créer un projet Pages connecté au dépôt GitHub.
- [ ] `[Ethan]` Autoriser uniquement le dépôt nécessaire dans l’application GitHub Cloudflare.
- [ ] `[Ethan]` Choisir `main` comme branche de production.
- [ ] `[Ethan]` Activer les previews pour les pull requests et `develop`.
- [ ] `[Ethan]` Choisir le preset Astro ou saisir les paramètres manuels ci-dessous.

Configuration attendue :

| Paramètre              | Valeur                                            |
| ---------------------- | ------------------------------------------------- |
| Production branch      | `main`                                            |
| Build command          | `npm run build`                                   |
| Build output directory | `dist`                                            |
| Root directory         | `/`                                               |
| Node.js                | version compatible avec `.nvmrc`, actuellement 22 |
| Variables secrètes     | aucune                                            |

### Premier déploiement de prévisualisation

- [ ] `[QA]` Vérifier que `npm ci` et le build réussissent dans les logs Cloudflare.
- [ ] `[QA]` Noter l’URL, l’identifiant du déploiement et le SHA Git.
- [ ] `[QA]` Exécuter les phases 7 à 12 sur cette URL.
- [ ] `[QA]` Confirmer que les previews portent une directive `noindex`.
- [ ] `[QA]` Vérifier que le build ne dépend d’aucun fichier non suivi.

### Domaine et DNS

- [ ] `[Ethan]` Ajouter le domaine apex dans Cloudflare Pages > Custom domains.
- [ ] `[Ethan]` Si l’apex est utilisé, ajouter la zone Cloudflare et configurer les nameservers demandés.
- [ ] `[Ethan]` Ajouter `www` comme domaine secondaire si souhaité.
- [ ] `[Ethan]` Choisir un canonical unique : apex recommandé.
- [ ] `[Dev]` Rediriger `www` vers l’apex et le domaine Pages de production vers l’apex.
- [ ] `[QA]` Vérifier DNS, certificat TLS, HTTP → HTTPS et absence de boucle de redirection.
- [ ] `[QA]` Vérifier que le domaine final correspond exactement à `Astro.site`.

**Gate 13 :** preview validée, domaine actif en HTTPS, canonical unique et configuration Cloudflare documentée sans secret.

## Phase 14 — répétition de release

**Priorité : P0**

- [ ] `[Dev]` Créer une branche de release depuis `develop` si des corrections de recette sont nécessaires.
- [ ] `[Dev]` Geler le contenu pendant la répétition.
- [ ] `[QA]` Partir d’un checkout propre et lancer `npm ci`.
- [ ] `[QA]` Lancer `npm run verify`.
- [ ] `[QA]` Lancer tests E2E, axe et liens.
- [ ] `[QA]` Lancer l’audit de dépendances de production.
- [ ] `[QA]` Lancer Lighthouse sur les pages représentatives.
- [ ] `[QA]` Relire les pages FR puis EN.
- [ ] `[QA]` Vérifier les deux thèmes et la matrice d’écrans.
- [ ] `[QA]` Vérifier la console et les en-têtes réseau.
- [ ] `[QA]` Vérifier le contenu de `dist/` pour les secrets et placeholders.
- [ ] `[QA]` Faire un test de restauration Cloudflare vers un ancien déploiement de production non critique, ou documenter la procédure avant la première prod.
- [ ] `[Ethan]` Donner un GO explicite sur l’URL de preview.

**Gate 14 :** toutes les preuves P0 sont réunies et le GO d’Ethan est enregistré.

## Phase 15 — mise en production

**Priorité : P0**

### Avant fusion

- [ ] `[Dev]` Ouvrir une pull request `develop` vers `main`.
- [ ] `[QA]` Vérifier le diff complet, particulièrement contenu, scripts, dépendances, workflow et configuration.
- [ ] `[QA]` Vérifier que la CI requise est verte sur le dernier SHA.
- [ ] `[Ethan]` Relire la preview attachée à la pull request.
- [ ] `[Ethan]` Approuver la release.

### Publication

- [ ] `[Dev]` Fusionner la pull request vers `main`.
- [ ] `[QA]` Suivre le déploiement Cloudflare jusqu’au succès.
- [ ] `[QA]` Confirmer que le SHA déployé est celui fusionné.
- [ ] `[QA]` Exécuter le smoke test production immédiatement.
- [ ] `[QA]` Tester accueil FR/EN, projets, contact, légal, confidentialité, 404, thème et langue.
- [ ] `[QA]` Vérifier HTTPS, redirections, canonical, sitemap, robots, CSP et autres en-têtes.
- [ ] `[QA]` Vérifier les logs de build et la console navigateur.
- [ ] `[Dev]` Créer le tag `v0.1.0` pour le jalon A ou `v1.0.0` pour le jalon B, uniquement après le smoke test réussi.
- [ ] `[Dev]` Renseigner la fiche de preuve de release ci-dessous.

### Fiche de preuve de release

```text
Version :
Date et heure Europe/Paris :
SHA Git :
Pull request :
URL de preview validée :
URL de production :
Identifiant Cloudflare :
CI :
E2E / axe / liens :
Lighthouse :
Validation éditoriale :
GO donné par :
Déploiement de retour arrière :
Observations :
```

**Gate 15 :** production accessible et vérifiée, tag créé, preuves conservées et rollback identifié.

## Procédure de retour arrière

Déclencher un rollback en cas de page blanche, navigation principale cassée, fuite de donnée, violation CSP bloquante, erreur de domaine/canonical, régression d’accessibilité majeure ou taux élevé d’erreurs constaté.

1. Suspendre toute nouvelle fusion vers `main`.
2. Identifier le dernier déploiement de production Cloudflare validé.
3. Dans Pages > Deployments, sélectionner ce déploiement puis **Rollback to this deployment**.
4. Vérifier immédiatement domaine, accueil FR/EN, navigation, contact et en-têtes.
5. Revenir dans Git avec un commit de revert sur une branche dédiée, puis passer par une PR ; ne pas réécrire l’historique de `main`.
6. Corriger, refaire les gates concernés et redéployer normalement.
7. Documenter cause, impact, durée, SHA fautif, déploiement restauré et prévention.

Notes :

- Cloudflare ne permet de cibler pour un rollback que des déploiements de production déjà construits avec succès ; une preview n’est pas une cible de rollback.
- Ne pas supprimer le projet Cloudflare, le dépôt ou les enregistrements DNS pour corriger un incident applicatif.
- Le rollback Cloudflare remet le site en ligne rapidement ; le revert Git remet ensuite `main` en cohérence avec la production.

## Phase 16 — indexation et suivi post-lancement

**Priorité : P1 juste après la production**

- [ ] `[Ethan]` Ajouter et vérifier la propriété de domaine dans Google Search Console.
- [ ] `[Ethan]` Soumettre `sitemap-index.xml` dans le rapport Sitemaps.
- [ ] `[QA]` Inspecter l’accueil FR, l’accueil EN et les deux projets.
- [ ] `[QA]` Vérifier dans les jours suivants l’indexation, les canonical choisies et les erreurs structurées.
- [ ] `[QA]` Vérifier les Core Web Vitals lorsqu’il existe assez de données terrain.
- [ ] `[QA]` Vérifier les liens sociaux et les aperçus de partage après cache des plateformes.
- [ ] `[QA]` Surveiller les erreurs 404 sans ajouter de tracker non décidé.
- [ ] `[Ethan]` Ajouter le domaine au profil GitHub et à LinkedIn.
- [ ] `[Dev]` Publier les études de cas et le CV progressivement via le même flux PR → preview → `main`.

## Maintenance

### À chaque changement

- [ ] Mettre à jour les faits FR et EN ensemble.
- [ ] Vérifier les liens et médias touchés.
- [ ] Lancer `npm run format` puis `npm run verify`.
- [ ] Passer par une preview avant `main`.

### Chaque mois

- [ ] Examiner et fusionner prudemment les PR Dependabot.
- [ ] Vérifier les alertes de sécurité GitHub et Cloudflare.
- [ ] Vérifier les formulaires de contact inexistants ou, s’ils sont ajoutés, leur bon fonctionnement.
- [ ] Contrôler les principaux liens externes.

### Chaque trimestre

- [ ] Refaire une passe accessibilité manuelle.
- [ ] Refaire Lighthouse et comparer aux preuves précédentes.
- [ ] Vérifier toutes les pages FR/EN et les informations devenues obsolètes.
- [ ] Mettre à jour statuts, captures et résultats des projets.
- [ ] Vérifier le renouvellement du domaine et les accès 2FA.
- [ ] Restaurer un ancien déploiement dans un exercice contrôlé si le risque le justifie.

### Chaque année

- [ ] Revoir positionnement, biographie, CV et sélection de projets.
- [ ] Revoir les pages légales et la politique de confidentialité.
- [ ] Vérifier les licences des médias et polices.
- [ ] Revoir les versions majeures Astro, Node et Tailwind dans une branche dédiée.

## Décisions ouvertes

| Décision                               | Responsable    | Échéance            | Valeur par défaut sûre                        |
| -------------------------------------- | -------------- | ------------------- | --------------------------------------------- |
| Jalon A ou B pour le premier lancement | Ethan          | Phase 0             | Jalon A                                       |
| Titre professionnel final              | Ethan          | Avant gel éditorial | « Développeur logiciel & créateur numérique » |
| Domaine effectivement acheté           | Ethan          | Avant phase 7       | `ethanbrosselard.dev` si disponible           |
| Portrait public                        | Ethan          | Avant design final  | Aucun portrait, monogramme                    |
| Logo ou signature                      | Ethan + design | Avant design final  | Monogramme existant                           |
| CV requis au lancement                 | Ethan          | Phase 0             | Non, liens masqués                            |
| Dépôts projets publics                 | Ethan          | Avant études de cas | Aucun lien si privé                           |
| Démo/APK publics                       | Ethan          | Avant études de cas | Aucun lien si non validé                      |
| Analytics                              | Ethan          | Avant pages légales | Aucun analytics                               |
| Formulaire de contact                  | Ethan          | Après lancement     | Email direct uniquement                       |
| Polices                                | Ethan + design | Phase 5             | Pile système                                  |

## Définition globale de « terminé »

Le jalon choisi est terminé uniquement si toutes les conditions suivantes sont vraies :

- [ ] Tous les P0 du jalon sont cochés avec preuve.
- [ ] Le build est reproductible avec `npm ci` puis `npm run verify`.
- [ ] La CI distante est verte sur le SHA de production.
- [ ] Les contenus affichés sont vrais, autorisés, bilingues et relus.
- [ ] Aucun placeholder, faux lien ou information confidentielle n’est publié.
- [ ] Les projets sont honnêtement `teaser` ou entièrement `published`.
- [ ] Le CV est complet dans ses quatre formats, ou totalement masqué.
- [ ] La recette accessibilité, fonctionnelle, sécurité et performance est acceptée.
- [ ] Le domaine canonique répond en HTTPS et redirige ses variantes.
- [ ] SEO, sitemap, robots, données structurées et partage social sont vérifiés.
- [ ] Pages légales et confidentialité reflètent le site réellement livré.
- [ ] La production correspond au SHA annoncé.
- [ ] Le rollback est possible et son déploiement cible est identifié.
- [ ] La fiche de release est archivée.

## Commandes de contrôle

```sh
# Identité Git et état local
git status --short
git remote -v
git branch -vv
git log -1 --format='%H%n%an <%ae>%n%s'

# Installation et validation locale
nvm use
npm ci
npm run format
npm run verify

# Audit des dépendances livrées
npm audit --omit=dev --audit-level=high

# Après ajout des scripts prévus
npm run test:e2e
npm run check:links

# Vérification réseau sur la production
curl -I https://ethanbrosselard.dev/
```

Ne jamais lancer `git push`, fusionner `main`, acheter un domaine, modifier le DNS ou publier sur Cloudflare sans l’action ou l’accord explicite d’Ethan.

## Références officielles

- [Déployer Astro sur Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Déploiements de prévisualisation Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Contrôle des branches Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
- [Domaines personnalisés Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [En-têtes Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/)
- [Rollbacks Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)
- [Configuration CSP Astro](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)
- [Sitemap officiel Astro](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Protection des branches GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Tests d’accessibilité Playwright](https://playwright.dev/docs/accessibility-testing)
- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/)
- [Seuils Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [Premières étapes RGPD — CNIL](https://www.cnil.fr/fr/passer-laction/rgpd-les-premieres-etapes)
- [Mesure d’audience et consentement — CNIL](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience)
- [Rapport Sitemaps de Google Search Console](https://support.google.com/webmasters/answer/7451001)

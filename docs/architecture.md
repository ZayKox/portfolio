# Architecture du portfolio

## Principes

1. Générer un site statique rapide et simple à héberger.
2. Maintenir la parité entre le français et l’anglais.
3. Séparer les faits partagés, l’interface traduite et les récits de projets.
4. N’afficher aucun champ incomplet et ne jamais inventer de contenu personnel.
5. Ajouter du JavaScript uniquement pour une amélioration progressive utile.

Le système visuel effectivement implémenté est décrit dans `docs/design-system.md`. `src/styles/global.css` reste la source exécutable de ses tokens.

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

`scripts/validate-content-parity.mjs` contrôle directement les sources MDX. Il impose une paire FR/EN par slug, l'identité du statut de publication, de l'ordre, de la mise en avant, de la stack, du visuel et des valeurs métriques, ainsi qu'une structure narrative de même profondeur. Les libellés et récits restent volontairement localisables.

## Domaine et SEO

Le build n’invente jamais de domaine. Sans `SITE_URL`, les liens internes restent relatifs et aucun canonical, sitemap ou URL d’image sociale n’est émis. Avec une origine HTTPS finale dans `SITE_URL`, Astro produit les canonical, `og:url`, URL JSON-LD, `robots.txt`, le sitemap officiel et l’URL absolue de la carte sociale. La 404 est exclue du sitemap.

`scripts/generate-brand-assets.mjs` rend le favicon 64 × 64, l’icône Apple touch 180 × 180, la carte sociale générale et une carte 1200 × 630 dédiée à chaque projet depuis du HTML/CSS déterministe fondé sur les tokens Violet Field et les compositions déjà présentes dans l'interface. Les PNG générés sont versionnés dans `public/` ; le build n’exécute pas Chromium. Les chemins et alternatives localisées des projets vivent dans leurs frontmatters MDX. La validation contrôle la présence des images, leur format, leurs dimensions, leur poids, leur parité FR/EN et leurs métadonnées par route.

`docs/media-provenance.json` inventorie chaque média publiable avec sa source, son empreinte SHA-256, ses dimensions lorsqu’il s’agit d’un PNG et un budget maximal en octets. Le contrôle associé refuse un fichier absent du manifeste, une empreinte ou des dimensions modifiées, un dépassement de budget ou une police embarquée. En dehors des cinq éléments de marque générés et inventoriés, l’interface actuelle utilise uniquement du texte, du CSS, le caractère Unicode du sélecteur de thème et les polices disponibles sur le système ; elle ne distribue ni police, capture, vidéo ou contenu visuel tiers.

Une répétition technique utilise `SITE_NOINDEX=true`. Toutes les pages deviennent alors `noindex, nofollow`, `robots.txt` interdit le crawl et aucun sitemap, canonical, alternate, JSON-LD ou aperçu social n'est généré. `npm run verify` contrôle séparément ce mode, la production indexable et le build sans origine. Cette défense contre l'indexation accidentelle ne remplace pas une authentification ou une restriction réseau de la preview.

## Sécurité

Astro génère une CSP par page. Les scripts inline sont placés après la balise CSP et chaque contenu exact est enregistré avec son hash SHA-256 ; la validation recalcule tous les hashes. `public/_headers` ajoute les protections HTTP prises en charge par Workers Static Assets. Le domaine personnalisé Cloudflare termine TLS et annonce HSTS pendant un an, sans étendre encore la politique aux sous-domaines ni demander son préchargement avant la décision finale concernant `www`. La production ne contient aucun code Worker, Function ou service d’origine : seules les ressources statiques de `dist/` sont exposées.

Le site ne charge aucune ressource tierce, n’expose aucun secret et ne contient ni formulaire, embed ou service dynamique. Le seul stockage navigateur autorisé est la préférence `portfolio-theme` ; aucun cookie n'est émis par l’artefact. La validation bloque les ressources externes, les API de stockage ou d'envoi non prévues et les réponses `Set-Cookie`. La configuration désactive explicitement Workers Logs, la télémétrie Wrangler et l’inventaire de dépendances envoyé par Wrangler ; aucun export de journaux ni outil de mesure d’audience côté navigateur n’est prévu. Cloudflare traite néanmoins les données réseau nécessaires au service et produit des métriques techniques agrégées, décrites avec les transferts et critères de conservation dans la politique de confidentialité. Toute évolution de ce périmètre doit mettre à jour la CSP, les pages légales applicables et les contrôles du build.

## Hébergement

Node.js 22 génère `dist/`, puis Cloudflare Workers Static Assets publie uniquement cet artefact. La configuration Wrangler pointe vers `dist/`, conserve les URL Astro avec barre finale et sert la page `404.html` avec le statut HTTP 404. Aucun adaptateur Astro Cloudflare, SSR, binding, Function ou script Worker n’est requis tant que le site reste statique. `SITE_URL` est une donnée de build et tout changement de domaine impose donc une nouvelle version.

GitHub Actions est l’unique chemin normal de publication. Les pull requests exécutent la validation sans secret Cloudflare. Après relecture, un mainteneur déclenche manuellement la définition du workflow de preview présente sur `main`, avec une référence et un alias explicites ; le workflow refuse de s’exécuter lui-même depuis une autre branche. Un premier job exécute la référence demandée sans secret, la valide, construit `dist/` avec `SITE_NOINDEX=true` et transmet uniquement cet artefact. Un second job cloisonné dans l’environnement `preview` charge l’outillage de confiance depuis `main`, revalide l’artefact, puis reçoit le jeton nécessaire pour envoyer une version Workers non promue. Il exige qu’une requête anonyme soit bloquée par Cloudflare Access avant le smoke test authentifié. Cette frontière empêche la référence demandée de s’exécuter avec les secrets de déploiement. Une fusion vers `main` ne déploie qu’après la validation complète, avec `SITE_URL=https://zaykohub.com` et `SITE_NOINDEX=false`, et uniquement si le SHA validé est encore le HEAD de `main`. Les secrets Cloudflare restent dans les environnements GitHub, jamais dans le dépôt ou l’artefact. Les workflows de preview et de production sont en plus neutralisés tant que leur variable de déploiement distincte n’est pas activée explicitement.

Workers attache par défaut `Cache-Control: public, max-age=0, must-revalidate` et un ETag aux ressources statiques. `public/_headers` remplace cette valeur par un cache navigateur d’un an et `immutable` uniquement pour les fichiers `/_astro/` empreintés. La recette distante contrôle les deux politiques. Le domaine personnalisé est déclaré sur la zone Cloudflare, qui gère le DNS associé et le certificat TLS ; `www` redirige définitivement vers l’apex canonique en conservant chemin et paramètres.

## Validation statique

`npm run verify` contrôle le format, la cohérence de la chaîne Node/npm/CI, la configuration Workers, la parité factuelle des sources de projets, la provenance des médias, les types Astro, un build indexable avec une origine HTTPS de test, un build de preview entièrement `noindex`, puis recrée `dist/` sans faux domaine. `scripts/validate-toolchain.mjs` aligne les moteurs, les fichiers de verrouillage, les actions GitHub, les commandes CI et Dependabot. `scripts/validate-build.mjs` vérifie les routes, liens internes, paires FR/EN, titres, descriptions et locales de partage, sitemap, robots, CSP, JSON-LD, langue du document, hiérarchie des titres, régions principales, page courante, noms des contrôles, absence de ressource tierce ou mécanisme de suivi non autorisé, présence des tokens Violet Field requis, parité du thème sombre explicite/système, contrastes principaux, budgets CSS/JS/HTML, placeholders et motifs de secrets courants.

## Validation navigateur

`npm run test:e2e` démarre une prévisualisation du build puis teste les routes publiques dans Chromium, Firefox, WebKit et des émulations mobiles Chromium et WebKit. La suite contrôle le rendu, les erreurs JavaScript et CSP, les deux thèmes, la persistance du choix, les noms et états dynamiques des contrôles localisés, les principaux liens, le statut 404, le lien d'évitement au clavier, l'ordre DOM de tabulation et la visibilité du focus en clair/sombre, le mouvement réduit, les cibles tactiles, l'absence de débordement à 320 px et les violations axe sérieuses ou critiques. Un contrôle Chromium desktop redimensionne aussi le viewport à 640 puis 320 pixels CSS, équivalents de reflow d'une fenêtre de 1280 pixels zoomée à 200 % et 400 % ; la validation statique interdit les métadonnées qui bloquent le zoom. Le site doit également rester lisible et navigable sans JavaScript. Ces preuves complètent sans remplacer le test manuel avec le zoom réel du navigateur. Des mesures Chromium bloquent un CLS supérieur à 0,1 ou plus de 300 Kio encodés sur les pages représentatives ; elles complètent sans remplacer Lighthouse, les mesures de production et la recette humaine au clavier ou avec un lecteur d'écran. `npm run check:links` contrôle séparément les liens HTTPS externes et distingue les cibles réellement absentes des refus ou incidents réseau non concluants.

`npm run test:lighthouse` audite en mobile ralenti quatre pages représentatives avec une origine HTTPS réservée afin de reproduire les métadonnées de production, puis conserve des rapports HTML/JSON non versionnés. La release exige des scores d'au moins 95 dans les quatre catégories, un LCP inférieur ou égal à 2,5 s, un CLS inférieur ou égal à 0,1 et un TBT inférieur ou égal à 200 ms. Cette preuve synthétique ne remplace pas les Core Web Vitals de terrain, notamment l'INP réel.

## Validation du déploiement

La validation de la configuration confirme que Workers ne reçoit que `dist/`, sert une vraie 404, conserve les URL avec barre finale et n’introduit ni script d’exécution, binding ou secret applicatif. Le build local reste servi par `astro preview` pour les contrôles navigateur ; il ne prétend pas reproduire le réseau Cloudflare.

`npm run test:deployment -- --url <origine-https> --mode <production|preview>` exécute les assertions en lecture seule contre une URL Workers : dix-huit routes bilingues, vraie 404, CSP et en-têtes, politique de cache HTML/ressources hashées, favicon, canonical, alternates, JSON-LD, robots, sitemap exact et carte sociale en production, ou suppression de tous les signaux d’indexation en preview. En production, `--canonical-url` peut distinguer l’origine appelée du domaine final attendu dans les métadonnées. `--check-http-redirect` exige une redirection permanente HTTP → HTTPS et chaque option répétable `--redirect-from <origine-https>` exige qu’une variante `www` redirige définitivement vers l’URL canonique en conservant chemin et paramètres. Avant le smoke test authentifié, le workflow de preview effectue une sonde distincte sans identifiant et exige un refus ou une redirection vers la connexion Access. Le smoke test reçoit ensuite les deux en-têtes du service token depuis des secrets externes ; leur valeur n’est jamais incluse dans le rapport JSON optionnel.

## Contenu futur

Le modèle pourra accueillir sans refonte des expériences IA, outils, articles ou projets dans d’autres domaines. Le positionnement ne dépend donc pas d’une stack particulière.

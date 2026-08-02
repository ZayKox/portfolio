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

Astro génère une CSP par page. Les scripts inline sont placés après la balise CSP et chaque contenu exact est enregistré avec son hash SHA-256 ; la validation recalcule tous les hashes. `public/_headers` ajoute les protections HTTP compatibles Cloudflare Pages. Pour le chemin VPS, `nginx.conf` sert les mêmes en-têtes depuis un conteneur non privilégié et masque la version de Nginx ; Coolify termine TLS et ne publie que le port HTTP interne `8080`. Les deux chemins annoncent HSTS pendant un an, sans étendre encore la politique aux sous-domaines ni demander son préchargement avant la décision finale de domaine. Compose retire toutes les capabilities Linux, interdit l'acquisition de nouveaux privilèges et rend le système de fichiers racine non inscriptible ; seul un `/tmp` borné en mémoire reste disponible au processus.

Le site ne charge aucune ressource tierce, n’expose aucun secret et ne contient ni formulaire, embed ou service dynamique. Le seul stockage navigateur autorisé est la préférence `portfolio-theme` ; aucun cookie n'est émis par l'artefact ou le conteneur. La validation bloque les ressources externes, les API de stockage ou d'envoi non prévues et les réponses `Set-Cookie`. Le journal d'accès Nginx conserve uniquement l'heure, la méthode, le chemin normalisé sans paramètres, le statut, le volume et la durée ; un test par sentinelles refuse IP transmise, query string, référent et user-agent. Cette minimisation ne couvre pas les journaux du proxy Coolify ou de l'hébergeur, qui devront rester décrits séparément dans la politique de confidentialité. Toute évolution de ce périmètre doit mettre à jour la CSP, les pages légales applicables et les contrôles du build.

## Hébergement

Le déploiement VPS est un build multi-étapes : Node.js 22 génère `dist/`, puis
Nginx sert uniquement les fichiers statiques. Les deux images de base conservent un tag lisible mais sont figées par digest multi-architecture ; Dependabot propose leurs mises à jour mensuelles pour éviter tout changement silencieux lors d'un rebuild. `SITE_URL` est une donnée de
build et tout changement de domaine impose donc une reconstruction. Cloudflare
Pages reste une solution de repli adaptée au même artefact statique.

Sur le chemin VPS, Nginx force la revalidation des documents HTML afin qu'un déploiement soit visible immédiatement, tandis que les ressources `/_astro/` dont le nom contient une empreinte reçoivent un cache navigateur d'un an. Le smoke test local et la recette distante contrôlent ces deux politiques.

## Validation statique

`npm run verify` contrôle le format, la cohérence de la chaîne Node/npm/Docker/CI, la parité factuelle des sources de projets, la provenance des médias, les types Astro, un build indexable avec une origine HTTPS de test, un build de preview entièrement `noindex`, puis recrée `dist/` sans faux domaine. `scripts/validate-toolchain.mjs` aligne les moteurs, les fichiers de verrouillage, les images par digest, les actions GitHub, les commandes CI, Dependabot et le contexte Docker. `scripts/validate-build.mjs` vérifie les routes, liens internes, paires FR/EN, métadonnées, sitemap, robots, CSP, JSON-LD, langue du document, hiérarchie des titres, régions principales, page courante, noms des contrôles, absence de ressource tierce ou mécanisme de suivi non autorisé, présence des tokens Violet Field requis, parité du thème sombre explicite/système, contrastes principaux, budgets CSS/JS/HTML, placeholders et motifs de secrets courants.

## Validation navigateur

`npm run test:e2e` démarre une prévisualisation du build puis teste les routes publiques dans Chromium, Firefox, WebKit et des émulations mobiles Chromium et WebKit. La suite contrôle le rendu, les erreurs JavaScript et CSP, les deux thèmes, la persistance du choix, les noms et états dynamiques des contrôles localisés, les principaux liens, le statut 404, le lien d'évitement au clavier, l'ordre DOM de tabulation et la visibilité du focus en clair/sombre, le mouvement réduit, les cibles tactiles, l'absence de débordement à 320 px et les violations axe sérieuses ou critiques. Un contrôle Chromium desktop redimensionne aussi le viewport à 640 puis 320 pixels CSS, équivalents de reflow d'une fenêtre de 1280 pixels zoomée à 200 % et 400 % ; la validation statique interdit les métadonnées qui bloquent le zoom. Le site doit également rester lisible et navigable sans JavaScript. Ces preuves complètent sans remplacer le test manuel avec le zoom réel du navigateur. Des mesures Chromium bloquent un CLS supérieur à 0,1 ou plus de 300 Kio encodés sur les pages représentatives ; elles complètent sans remplacer Lighthouse, les mesures de production et la recette humaine au clavier ou avec un lecteur d'écran. `npm run check:links` contrôle séparément les liens HTTPS externes et distingue les cibles réellement absentes des refus ou incidents réseau non concluants.

`npm run test:lighthouse` audite en mobile ralenti quatre pages représentatives avec une origine HTTPS réservée afin de reproduire les métadonnées de production, puis conserve des rapports HTML/JSON non versionnés. La release exige des scores d'au moins 95 dans les quatre catégories, un LCP inférieur ou égal à 2,5 s, un CLS inférieur ou égal à 0,1 et un TBT inférieur ou égal à 200 ms. Cette preuve synthétique ne remplace pas les Core Web Vitals de terrain, notamment l'INP réel.

## Validation du conteneur

`npm run test:container` construit l'image publique de production tandis que `npm run test:container:preview` construit sa variante `noindex`. Chaque contrôle valide d'abord la configuration Compose, ses arguments, son unique port interne, l'absence de port hôte, volume, secret ou namespace privilégié et son confinement. Il démarre ensuite Nginx avec les mêmes restrictions, confirme l'utilisateur non privilégié de l'image sur un port local aléatoire, attend le healthcheck et appelle le même moteur que la recette distante. Ce moteur refuse aussi toute réponse qui crée un cookie. Le script utilise des noms temporaires uniques et supprime uniquement son conteneur et son image à la fin du contrôle.

`npm run test:deployment -- --url <origine-https> --mode <production|preview>` exécute les assertions en lecture seule contre une URL Coolify : douze routes bilingues, vraie 404, CSP et en-têtes, politique de cache HTML/ressources hashées, absence de version serveur, favicon, canonical, alternates, JSON-LD, robots, sitemap exact et carte sociale en production, ou suppression de tous les signaux d’indexation en preview. Une preview protégée peut recevoir un en-tête `Authorization` par variable d’environnement ; sa valeur n’est jamais incluse dans le rapport JSON optionnel.

## Contenu futur

Le modèle pourra accueillir sans refonte des expériences IA, outils, articles ou projets dans d’autres domaines. Le positionnement ne dépend donc pas d’une stack particulière.

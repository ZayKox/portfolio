# Contenu restant à préparer

Cette liste n’est pas affichée sur le site.

## Minimum à valider pour publier la version actuelle

- Relire les textes visibles en français et en anglais après la prochaine évolution éditoriale.
- Relire les aperçus factuels (`teaser`) de Palimia et Ludosaic ; leur sélection, leur ordre et le retrait de FiltreAppels ont été validés le 29 août 2026.
- Valider l’identité visuelle actuelle, dont le monogramme et les trois cartes de partage Violet Field.
- Configurer l’origine canonique HTTPS `https://zaykohub.com` dans l’environnement de déploiement Docker Compose.
- Confirmer l’adresse de contact publique et accepter le risque de spam, ou fournir une adresse dédiée.
- Décider si l’adresse email doit rester absente du JSON-LD, comme recommandé pour limiter le scraping.
- Confirmer un lancement sans analytics, cookie, formulaire ni contenu tiers embarqué.
- Indiquer si le site est édité à titre personnel ou professionnel. Transmettre séparément, sans les committer, les éventuelles informations légales privées requises.
- Confirmer les informations publiques exactes de l’hébergeur et les règles de conservation des journaux du proxy Caddy/VPS au déploiement, puis mettre à jour les pages légales si nécessaire.

Le portrait, les études de cas complètes et les captures peuvent rester masqués. Le CV, les expériences et les formations sont maintenant publiés dans les deux langues.

## Identité

- Affiner le titre professionnel final si nécessaire.
- Ajouter des certifications lorsqu’elles seront disponibles et publiables.
- Ajouter un portrait uniquement si Ethan décide d’en publier un.

## CV

- Mettre à jour le CV à partir de sa source structurée unique lorsqu’une expérience, une formation ou un projet évolue.

## Palimia

- Valider explicitement le statut produit, les dates et chaque métrique avant de les afficher.
- Motivation et problème personnel initial.
- Rôle exact, dates et temps consacré.
- État public, lien de démonstration et visibilité du dépôt.
- Retours de testeurs et résultats réels.
- Décisions, fausses pistes, compromis et enseignements.
- Captures récentes et vidéo de démonstration.
- Autorisation de publier les détails de sécurité et d’exploitation.

## Ludosaic

- Valider explicitement le statut produit, les dates et chaque métrique avant de les afficher.
- Motivation, public cible, rôle exact et dates.
- Visibilité du dépôt, URL de démonstration éventuelle et état de déploiement.
- Retours de testeurs et résultats réels, séparés des validations locales.
- Décisions, compromis et enseignements sur les règles déterministes, le hors-ligne et le multijoueur.
- Captures de Reflex Rush, Merge Forge et Grid Duel avec des profils et scores de démonstration.
- Décision concernant la publication du dépôt et les détails d’exploitation.

## Publication

- Domaine retenu : `zaykohub.com` ; la version canonique choisie est sans `www`.
- Définir `SITE_URL=https://zaykohub.com` dans l’environnement de déploiement Docker Compose ; canonical, sitemap et `robots.txt` sont déjà conditionnés à cette valeur.
- Relire les mentions légales et la confidentialité après le déploiement, en particulier l’hébergeur réellement retenu et la conservation des journaux techniques.
- Décider si une mesure d’audience est réellement utile.
- Valider visuellement la carte Open Graph Violet Field déjà intégrée.

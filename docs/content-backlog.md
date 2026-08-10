# Contenu restant à préparer

Cette liste n’est pas affichée sur le site.

## Minimum à valider pour publier la version actuelle

- Relire les textes visibles en français et en anglais après la prochaine évolution éditoriale.
- Confirmer que MyVerse et FiltreAppels peuvent rester publiés comme aperçus factuels (`teaser`) sans dépôt, démonstration, métrique ni téléchargement public.
- Valider l’identité visuelle actuelle, dont le monogramme et les trois cartes de partage Violet Field.
- Configurer l’origine canonique HTTPS `https://zaykohub.com` dans l’environnement de build Coolify.
- Confirmer l’adresse de contact publique et accepter le risque de spam, ou fournir une adresse dédiée.
- Décider si l’adresse email doit rester absente du JSON-LD, comme recommandé pour limiter le scraping.
- Confirmer un lancement sans analytics, cookie, formulaire ni contenu tiers embarqué.
- Indiquer si le site est édité à titre personnel ou professionnel. Transmettre séparément, sans les committer, les éventuelles informations légales privées requises.
- Fournir les informations publiques exactes de l’hébergeur et les règles de conservation des journaux du proxy Coolify/VPS nécessaires aux pages légales.

Le portrait, les études de cas complètes et les captures peuvent rester masqués. Le CV, les expériences et les formations sont maintenant publiés dans les deux langues.

## Identité

- Affiner le titre professionnel final si nécessaire.
- Ajouter des certifications lorsqu’elles seront disponibles et publiables.
- Ajouter un portrait uniquement si Ethan décide d’en publier un.

## CV

- Mettre à jour le CV à partir de sa source structurée unique lorsqu’une expérience, une formation ou un projet évolue.

## MyVerse

- Valider explicitement le statut produit, les dates et chaque métrique avant de les afficher.
- Motivation et problème personnel initial.
- Rôle exact, dates et temps consacré.
- État public, lien de démonstration et visibilité du dépôt.
- Retours de testeurs et résultats réels.
- Décisions, fausses pistes, compromis et enseignements.
- Captures récentes et vidéo de démonstration.
- Autorisation de publier les détails de sécurité et d’exploitation.

## FiltreAppels

- Valider explicitement le statut produit, les dates et chaque métrique avant de les afficher.
- Motivation, rôle exact et dates.
- État Play Console et date de publication visée.
- Appareils, constructeurs et appels réels testés.
- Retours de bêta-testeurs et résultats réels.
- Décisions, compromis et enseignements.
- Captures avec règles réalistes et vidéo de démonstration.
- Décision concernant la publication du dépôt ou d’un APK.

## Publication

- Domaine retenu : `zaykohub.com` ; la version canonique choisie est sans `www`.
- Définir `SITE_URL=https://zaykohub.com` dans l’environnement de build Coolify ; canonical, sitemap et `robots.txt` sont déjà conditionnés à cette valeur.
- Rédiger les mentions légales adaptées au statut de l’éditeur.
- Décider si une mesure d’audience est réellement utile.
- Valider visuellement la carte Open Graph Violet Field déjà intégrée.

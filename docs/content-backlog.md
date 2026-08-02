# Contenu restant à préparer

Cette liste n’est pas affichée sur le site.

## Minimum à valider pour publier la version actuelle

- Choisir le titre professionnel public final, ou accepter explicitement de conserver le positionnement généraliste actuel.
- Relire et valider les textes visibles en français, puis confirmer que la version anglaise conserve le même sens.
- Confirmer que MyVerse et FiltreAppels peuvent rester publiés comme aperçus factuels (`teaser`) sans dépôt, démonstration, métrique ni téléchargement public.
- Valider l’identité visuelle actuelle, dont le monogramme et les trois cartes de partage Violet Field.
- Choisir le domaine final et l’origine canonique HTTPS à fournir dans `SITE_URL`.
- Confirmer l’adresse de contact publique et accepter le risque de spam, ou fournir une adresse dédiée.
- Décider si l’adresse email doit rester absente du JSON-LD, comme recommandé pour limiter le scraping.
- Confirmer un lancement sans analytics, cookie, formulaire ni contenu tiers embarqué.
- Indiquer si le site est édité à titre personnel ou professionnel. Transmettre séparément, sans les committer, les éventuelles informations légales privées requises.
- Fournir les informations publiques exactes de l’hébergeur et les règles de conservation des journaux du proxy Coolify/VPS nécessaires aux pages légales.

Le CV, le portrait, les études de cas complètes, les captures et les expériences détaillées peuvent rester masqués : leur absence ne bloque pas cette version minimale si Ethan la valide explicitement.

## Identité

- Confirmer le titre professionnel final.
- Écrire la biographie longue et l’histoire du parcours.
- Ajouter expériences, études et certifications si elles doivent être publiques.
- Choisir ou créer une signature visuelle.
- Ajouter un portrait uniquement si Ethan décide d’en publier un.

## CV

- Refaire le contenu depuis une source structurée unique.
- Produire une page HTML accessible en français et en anglais.
- Générer un PDF téléchargeable depuis le même contenu.

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

- Domaine recommandé : `ethanbrosselard.dev`. Le registre `.dev` ne retournait aucune inscription le 22 juillet 2026 ; revérifier au moment de l’achat.
- Définir `SITE_URL` avec le domaine final dans l’environnement de build Coolify ; canonical, sitemap et `robots.txt` sont déjà conditionnés à cette valeur.
- Rédiger les mentions légales adaptées au statut de l’éditeur.
- Décider si une mesure d’audience est réellement utile.
- Valider visuellement la carte Open Graph Violet Field déjà intégrée.

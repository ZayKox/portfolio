# Contenu restant à préparer

Cette liste n’est pas affichée sur le site.

## Minimum à valider pour publier la version actuelle

- Relire les textes visibles en français et en anglais après la prochaine évolution éditoriale.
- Relire les aperçus factuels (`teaser`) de Palimia et Ludosaic ; leur sélection, leur ordre et le retrait de FiltreAppels ont été validés le 29 août 2026.
- Relire le rendu de la refonte éditoriale autorisée le 6 septembre 2026 et des trois cartes de partage Violet Field ; la signature ZayKo est déjà validée.
- La production GitHub Actions, ses secrets d’environnement et sa variable de
  pilotage ont été configurés et validés le 8 septembre 2026. La recette d’une
  preview protégée par Cloudflare Access reste à exécuter et à consigner.
- Conserver l’adresse de contact publique validée ; une adresse dédiée reste un choix éventuel.
- Garder l’adresse email absente du JSON-LD, conformément à la décision validée pour limiter le scraping.
- Conserver le lancement validé sans mesure d’audience côté navigateur, cookie
  de suivi, formulaire ni contenu tiers embarqué.
- Conserver l’édition à titre personnel validée. Transmettre séparément, sans les committer, les éventuelles informations légales privées requises.
- Vérifier que l’entité Cloudflare indiquée sur le compte ou la facture reste
  Cloudflare, Inc., puis confirmer les réglages réels de journaux, métriques et
  sécurité lors du premier déploiement.

Le portrait, les études de cas complètes et les captures peuvent rester masqués. Le CV, les expériences et les formations sont maintenant publiés dans les deux langues.

## Identité

- Affiner le titre professionnel final si nécessaire.
- Ajouter des certifications lorsqu’elles seront disponibles et publiables.
- Ajouter un portrait uniquement si Ethan décide d’en publier un.

## CV

- Mettre à jour le CV à partir de sa source structurée unique lorsqu’une expérience, une formation ou un projet évolue.

## Palimia

- Obtenir et examiner les autorisations écrites requises pour le périmètre de données retenu avant toute mise en production.
- Compléter et valider les preuves de déploiement, d'exploitation et de revue juridique sur l'environnement cible.
- Valider explicitement les dates et chaque métrique avant de les afficher.
- Motivation et problème personnel initial.
- Rôle exact, dates et temps consacré.
- État public, lien de démonstration et visibilité du dépôt.
- Retours de testeurs et résultats réels.
- Décisions, fausses pistes, compromis et enseignements.
- Captures récentes et vidéo de démonstration.
- Autorisation de publier les détails de sécurité et d’exploitation.

## Ludosaic

- Terminer et valider les critères du MVP pour les trois jeux et les services connectés.
- Réaliser un premier déploiement externe puis valider sauvegarde, restauration, TLS/WSS, supervision et parcours critiques avant toute production.
- Valider explicitement les dates et chaque métrique avant de les afficher.
- Motivation, public cible, rôle exact et dates.
- Visibilité du dépôt, URL de démonstration éventuelle et état de déploiement.
- Retours de testeurs et résultats réels, séparés des validations locales.
- Décisions, compromis et enseignements sur les règles déterministes, le hors-ligne et le multijoueur.
- Captures de Reflex Rush, Merge Forge et Grid Duel avec des profils et scores de démonstration.
- Décision concernant la publication du dépôt et les détails d’exploitation.

## Publication

- Domaine retenu : `ethanbrosselard.com` ; la version canonique choisie est sans `www`.
- Migrer la zone vers les nameservers Cloudflare après avoir inventorié et
  recopié tous les enregistrements existants, notamment ceux de messagerie ;
  réaffecter ensuite l’apex au Custom Domain du Worker si un service web y est
  actuellement configuré.
- `www.ethanbrosselard.com` redirige vers l’apex canonique en conservant chemin
  et paramètres ; HTTP redirige aussi vers HTTPS.
- Les paramètres de production `SITE_URL=https://ethanbrosselard.com` et
  `SITE_NOINDEX=false` ont été validés sur le déploiement. Les previews doivent
  conserver `SITE_NOINDEX=true` et Cloudflare Access.
- Les mentions légales et la confidentialité ont été relues le 8 septembre
  2026 pour refléter Workers Static Assets, TLS, les redirections et la
  désactivation de l’observabilité configurée. Les durées réelles de
  conservation côté Cloudflare restent à confirmer auprès du fournisseur.
- Ne pas activer de mesure d’audience côté navigateur au lancement ; distinguer
  ce choix des métriques réseau agrégées produites par Cloudflare.
- Valider visuellement la carte Open Graph Violet Field déjà intégrée.

## Détails retirés après l’audit du 5 septembre

Les centres d’intérêt, le récit du déclic informatique et l’inspiration Letterboxd restent masqués jusqu’à validation explicite. Les CV conservent les postes, dates, établissements et compétences validés ; les précisions non validées sur Intento, les cursus et certaines technologies Beyowi ont été retirées dans les deux langues. Une future réintroduction exige la mise à jour du questionnaire, des sources FR/EN et des PDF.

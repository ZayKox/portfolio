# Recette visuelle locale — 2 août 2026

## Périmètre

- Révision inspectée : `0f8c3f6`.
- Navigateur : Chromium headless fourni avec Playwright 1.62.1.
- Serveur : artefact Astro statique servi localement par `astro preview`.
- Routes : les douze routes publiques françaises et anglaises.

## Matrice exécutée

### Thèmes

Trente-six captures pleine page ont été générées à 1440 × 900 px :

- douze routes avec préférence explicite claire ;
- douze routes avec préférence explicite sombre ;
- douze routes sans préférence enregistrée et avec le système en mode sombre.

Chaque rendu possédait un titre principal et une région principale visibles. Aucun débordement horizontal ni message d’erreur console n’a été détecté. Les planches de contact et plusieurs captures pleine résolution ont été relues : la hiérarchie, les contrastes visuels, les espacements, les compositions de projet et les états actifs restent cohérents en français et en anglais.

### Formats d’écran

Trente captures supplémentaires ont couvert l’accueil FR/EN, la page projet devenue Palimia et le contact dans les deux thèmes :

| Profil        | Zone d’affichage |
| ------------- | ---------------- |
| Mobile étroit | 320 × 800 px     |
| Tablette      | 768 × 900 px     |
| Écran large   | 1920 × 1080 px   |

Aucun débordement horizontal, contenu rogné, collision de navigation ou rupture de composition n’a été relevé. À 320 px, la navigation passe sur une deuxième ligne, les grilles deviennent monocolonnes et les boutons, cartes, libellés techniques et adresses restent lisibles.

### Mouvement réduit

Dix contrôles ont couvert les cinq pages représentatives dans les deux thèmes avec `prefers-reduced-motion: reduce`. Les durées maximales calculées étaient de `0,00001 s` pour les animations comme pour les transitions. Aucun contenu ou état utile ne dépend du mouvement.

## Résultat

La recette locale ne révèle aucun défaut visuel bloquant pour le jalon A. Elle confirme la cohérence actuelle de Violet Field sur les routes, thèmes et largeurs inspectés.

## Limites conservées

Cette preuve ne remplace pas :

- un test sur téléphone Android physique ou sur iPhone/Safari ;
- la matrice WebKit, indisponible localement faute de bibliothèques système ;
- le zoom réel du navigateur à 200 % et 400 % ;
- le parcours clavier humain complet et la passe lecteur d’écran ;
- la recette distante sur la ressource Coolify.

Ces éléments restent ouverts dans `docs/production-plan.md`.

# Recette WebKit automatisée — 2 août 2026

## Périmètre

Cette preuve complète la recette locale Chromium et Firefox. Elle couvre les projets Playwright `webkit` (profil Desktop Safari) et `mobile-webkit` (profil iPhone 13) sur les douze routes publiques françaises et anglaises.

Elle ne constitue pas un test sur Safari macOS, un iPhone réel ou un moteur WebKit fourni par Apple. Ces preuves matérielles restent explicitement absentes.

## Environnement

- Playwright : `1.62.1` ;
- image officielle : `mcr.microsoft.com/playwright:v1.62.1-noble` ;
- digest observé : `sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e` ;
- workspace monté en lecture/écriture avec l’utilisateur local `1000:1000` ;
- système hôte inchangé : l’installation native des bibliothèques WebKit a été abandonnée lorsque `sudo` a demandé un mot de passe interactif.

Commande exécutée :

```sh
docker run --rm --init --ipc=host \
  --user 1000:1000 \
  --env HOME=/tmp \
  --volume /home/ethan/Development/portfolio:/work \
  --workdir /work \
  mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e \
  npx playwright test --project=webkit --project=mobile-webkit
```

## Résultat

- 36 tests réussis ;
- 12 tests ignorés par leurs conditions de projet ;
- 0 échec ;
- durée Playwright : 18,9 s.

Les contrôles exécutés couvrent notamment :

- rendu sans erreur d’exécution, violation CSP ou violation axe sérieuse/critique sur les douze routes dans les deux profils ;
- préférence et persistance du thème ;
- destinations des liens principaux ;
- vraie page 404 bilingue ;
- lien d’évitement au clavier ;
- réduction des animations ;
- absence de débordement horizontal en émulation mobile ;
- cibles tactiles principales d’au moins 44 px en émulation mobile.

Les scénarios ignorés sont volontairement limités à d’autres profils par la suite Playwright, par exemple les budgets Chromium, les contrôles desktop réservés au clavier ou les contrôles mobiles exécutés uniquement sur le projet mobile correspondant.

## Conclusion

La matrice WebKit desktop et mobile automatisée est verte pour l’état testé. Un téléphone Android réel et Safari/iPhone réel restent à vérifier séparément avant de revendiquer une recette matérielle complète.

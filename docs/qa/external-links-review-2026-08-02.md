# Contrôle des liens externes — 2 août 2026

## Périmètre

`npm run check:links` construit le site puis extrait les destinations HTTPS publiées dans les documents générés. Le contrôle échoue lorsqu’une cible est confirmée absente avec un statut `404` ou `410` ; les refus réseau, limitations de débit et protections anti-automatisation restent non concluants afin d’éviter les faux positifs.

Commande exécutée :

```sh
npm run check:links
```

## Résultats

| Destination                                               | Résultat | Conclusion                                    |
| --------------------------------------------------------- | -------- | --------------------------------------------- |
| `https://github.com/ZayKox`                               | `200`    | cible accessible                              |
| `https://www.linkedin.com/in/ethan-brosselard-507334237/` | `999`    | refus anti-automatisation, résultat incertain |

Aucune cible définitivement cassée n’a été détectée parmi les deux liens HTTPS publiés.

## Limites

Le statut LinkedIn `999` ne prouve ni que le profil est absent ni qu’il est accessible à tous les visiteurs. Le lien doit être ouvert manuellement dans un navigateur lors de la répétition privée puis de la recette de production.

Les liens `mailto:` sont validés structurellement par le build et testés par Playwright, mais ne déclenchent volontairement aucun envoi d’email pendant cette recette.

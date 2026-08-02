# Audit des dépendances de production — 2 août 2026

## Commande

```sh
npm audit --omit=dev --audit-level=high --json
```

La commande interroge la base d’avis de sécurité du registre npm à partir de `package-lock.json` et exclut les dépendances utilisées uniquement pendant le développement.

## Résultat

| Sévérité  | Vulnérabilités connues |
| --------- | ---------------------- |
| Info      | 0                      |
| Faible    | 0                      |
| Modérée   | 0                      |
| Élevée    | 0                      |
| Critique  | 0                      |
| **Total** | **0**                  |

La commande s’est terminée avec le code `0`. Les métadonnées npm comptent 320 entrées de dépendances de production dans la résolution auditée.

## Limites

Ce résultat décrit uniquement les avis connus de npm au moment du contrôle. Il ne couvre pas les dépendances de développement omises, les images de base Docker, le système hôte, une mauvaise configuration ou une vulnérabilité encore inconnue. La CI répète cet audit, tandis que Dependabot surveille séparément npm, les actions GitHub et les images Docker.

Aucun correctif automatique ni mise à jour majeure n’a été appliqué pendant cet audit.

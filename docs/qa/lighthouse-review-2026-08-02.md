# Audit Lighthouse synthétique — 2 août 2026

## Périmètre

Audit mobile local des quatre pages représentatives du jalon A :

- accueil `/` ;
- liste `/projets/` ;
- aperçu `/projets/myverse/` ;
- aperçu `/projets/filtre-appels/`.

Le build utilise `SITE_URL=https://portfolio.example` et `SITE_NOINDEX=false` afin de reproduire les métadonnées indexables. Les pages sont ensuite servies sur une origine locale temporaire pour la mesure.

## Environnement et seuils

- Lighthouse : `13.4.1` ;
- navigateur : Headless Chrome `151.0.0.0` via Playwright ;
- profil : mobile ;
- ralentissement : simulation Lighthouse du réseau et du processeur ;
- scores minimaux : 95 pour performance, accessibilité, bonnes pratiques et SEO ;
- LCP maximal : 2 500 ms ;
- CLS maximal : 0,1 ;
- TBT maximal : 200 ms.

Commande exécutée :

```sh
npm run test:lighthouse
```

## Résultats

| Route                     | Performance | Accessibilité | Bonnes pratiques | SEO | LCP    | CLS   | TBT  |
| ------------------------- | ----------- | ------------- | ---------------- | --- | ------ | ----- | ---- |
| `/`                       | 100         | 100           | 100              | 100 | 903 ms | 0,000 | 0 ms |
| `/projets/`               | 100         | 100           | 100              | 100 | 903 ms | 0,000 | 0 ms |
| `/projets/myverse/`       | 100         | 100           | 100              | 100 | 902 ms | 0,000 | 0 ms |
| `/projets/filtre-appels/` | 100         | 100           | 100              | 100 | 903 ms | 0,000 | 0 ms |

Les quatre pages respectent tous les seuils bloquants configurés dans `scripts/run-lighthouse.mjs`.

## Limites

Cette preuve est une mesure de laboratoire locale et ponctuelle. Elle ne prouve ni les performances du proxy Coolify, du réseau public ou du VPS, ni l’INP et les Core Web Vitals de terrain. L’audit doit être répété sur la preview privée puis sur la production, et les données réelles ne pourront être interprétées qu’après un volume de visites suffisant.

Les rapports HTML et JSON détaillés restent dans `lighthouse-reports/`, ignoré par Git, afin de ne pas versionner des artefacts volumineux et dépendants de la machine.

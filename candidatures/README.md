# CV de candidature

Trois bases existent en français et en anglais, au format PDF d’une page et HTML consultable hors ligne. Elles reprennent les mêmes faits que le CV général ; le titre, le résumé et l’ordre des réalisations et compétences varient selon la cible.

| Cible                          | PDF français                                              | PDF anglais                                               | HTML français                                              | HTML anglais                                               |
| ------------------------------ | --------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| Backend Python et API          | [FR](ethan-brosselard-backend-python-api-fr.pdf)          | [EN](ethan-brosselard-backend-python-api-en.pdf)          | [FR](ethan-brosselard-backend-python-api-fr.html)          | [EN](ethan-brosselard-backend-python-api-en.html)          |
| Backend IA appliquée et RAG    | [FR](ethan-brosselard-backend-ia-rag-fr.pdf)              | [EN](ethan-brosselard-backend-ia-rag-en.pdf)              | [FR](ethan-brosselard-backend-ia-rag-fr.html)              | [EN](ethan-brosselard-backend-ia-rag-en.html)              |
| Backend données et intégration | [FR](ethan-brosselard-backend-donnees-integration-fr.pdf) | [EN](ethan-brosselard-backend-donnees-integration-en.pdf) | [FR](ethan-brosselard-backend-donnees-integration-fr.html) | [EN](ethan-brosselard-backend-donnees-integration-en.html) |

Ces fichiers sont versionnés dans le projet et ne sont pas servis par le portfolio : seul le CV général FR/EN reste proposé sur le site. Le dossier local d’origine est conservé.

Avant chaque candidature, choisir la base la plus proche de l’offre et adapter ses mots-clés et son emphase sans ajouter de compétence ou de réalisation non validée. Les critères de télétravail, de français comme langue de travail et de contrat restent identiques dans les deux langues. Aucune candidature n’est envoyée par ces outils.

## Régénérer les variantes

Depuis la racine du projet, avec Node 24 et les dépendances installées :

```sh
npm run generate:resume-variants
```

La commande reconstruit le portfolio puis génère et vérifie les six PDF et leurs HTML. `validation.json`, ignoré par Git, conserve le résultat local : une page par PDF, langue, structure et contenu attendus.

Les faits communs viennent de `src/data/resume.json`. Modifier `variantes.json` pour les titres, résumés et ordres propres aux candidatures, puis régénérer ; ne pas éditer directement les PDF ou les HTML. Le générateur n’utilise aucun chemin personnel absolu et les HTML embarquent leurs styles.

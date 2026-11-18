# flyn.fr

Site vitrine de **Flyn**, copilote IA consultatif pour l'aviation légère.
HTML, CSS et JavaScript statiques, sans build. Le boîtier Flyn One est un modèle 3D (three.js r170,
hébergé dans `assets/vendor/three`, licence MIT) qui pivote au fil du scroll.

## Voir le site en local

Le modèle 3D est un module JavaScript : il ne se charge pas en double-cliquant sur `index.html`
(le navigateur bloque les modules en `file://`, le site affiche alors l'illustration de secours).
Lancer un petit serveur :

```bash
python -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Organisation

| Fichier | Rôle |
|---|---|
| `index.html` | La page |
| `assets/css/site.css` | Styles (charte Flyn) |
| `assets/js/flyn-one.js` | Modèle 3D du boîtier, caméras par étape, barre lumineuse |
| `assets/img/` | Captures de l'app (prototype, vol simulé) |
| `assets/vendor/three/` | three.js et deux modules d'exemple, versions figées |

## Mettre en ligne (GitHub Pages)

Settings > Pages > Source : *Deploy from a branch* > `main` / `(root)`.
Le site sera servi sur `https://stevvvvvv.github.io/flyn.fr/`.

Nom de domaine `flyn.fr` (seulement si tu l'as acheté) : Settings > Pages > Custom domain, puis
chez le registrar des enregistrements `A` vers les IP GitHub Pages et un `CNAME` `www` vers
`stevvvvvv.github.io` (voir la doc GitHub Pages).

## Brancher le formulaire (5 minutes)

1. Crée un compte gratuit sur formspree.io, puis un formulaire « Tests Flyn ».
2. Copie son adresse (`https://formspree.io/f/xxxxxx`) et remplace `[URL_DU_FORMULAIRE]` dans `index.html`.
3. Envoie un test depuis le site : l'inscription arrive par e-mail et dans le tableau Formspree.

Tant que l'adresse n'est pas remplacée, le bouton affiche un message au lieu d'envoyer dans le vide.
Le champ caché `_gotcha` bloque les robots.

## À compléter avant d'annoncer le site

- `index.html` : `[URL_DU_FORMULAIRE]`, `[LIEN LINKEDIN]`, `[LIEN LINKEDIN STEVEN]`, `[contact@domaine]`, `[RAISON SOCIALE · SIREN]`.
- `mentions-legales.html` et `confidentialite.html` : les champs surlignés en jaune (société, adresse, SIREN,
  service de formulaire). Ces deux pages sont des modèles : à faire relire avant publication.

Rechercher `[` dans `index.html` pour trouver tous les champs à remplir.

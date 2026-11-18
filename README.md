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

## À compléter avant d'annoncer le site

- `[URL_DU_FORMULAIRE]` : l'adresse du service qui reçoit les inscriptions (Tally, Formspree ou Brevo). Un site statique ne peut pas enregistrer un formulaire tout seul.
- `[LIEN LINKEDIN]`, `[LIEN LINKEDIN STEVEN]`, `[contact@domaine]`.
- `[RAISON SOCIALE · SIREN]` une fois la SASU immatriculée.
- Pages *Mentions légales* et *Confidentialité* (obligatoires dès qu'on collecte des e-mails, RGPD).

Rechercher `[` dans `index.html` pour trouver tous les champs à remplir.

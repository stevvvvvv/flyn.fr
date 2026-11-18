# flyn.fr

Site vitrine de **Flyn**, copilote IA consultatif pour l'aviation légère.
HTML et CSS statiques, sans build : ouvrir `index.html` dans un navigateur suffit.

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

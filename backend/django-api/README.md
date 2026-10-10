# Django API - CareerVerse

Cette application Django constitue le backend de CareerVerse. Elle sert aussi le modèle
de deep learning **CareerNet**, qui recommande un métier IT à partir du profil de l'étudiant
et de ses résultats aux Career Labs.

## Modules principaux

- `users` : inscription, connexion, jeton d'authentification
- `profiles` : profil étudiant et questionnaire (notes, auto-évaluations, intérêts)
- `simulations` : tentatives des Career Labs (score, temps, validations, indices, plaisir)
- `results` : recommandations calculées
- `recommendations` : construit l'entrée du modèle et lance la prédiction
- `ai` : modèle CareerNet (`careernet.py`), inférence (`predictor.py`), vocabulaire partagé (`catalog.py`)
- `careers` : catalogue des métiers

## Démarrage

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows (source .venv/bin/activate sous Linux / Mac)
pip install -r requirements.txt # installe aussi torch et numpy pour le modèle
python manage.py migrate
python manage.py runserver
```

## API

Toutes les routes sauf `auth/login`, `auth/register`, `health` et `labs/` demandent
l'en-tête `Authorization: Token <jeton>` (jeton renvoyé par login et register).

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/auth/register/` | crée un compte, renvoie `token` |
| POST | `/api/auth/login/` | connexion, renvoie `token` |
| POST | `/api/auth/logout/` | invalide le jeton |
| GET | `/api/auth/me/` | utilisateur connecté |
| GET / PUT | `/api/profile/` | questionnaire ; renvoie `completion` (%) et `missing_fields` |
| GET | `/api/labs/` | les 9 Career Labs connus du modèle |
| GET / POST | `/api/labs/attempts/` | dernières tentatives par lab / enregistrer une tentative |
| GET / POST | `/api/recommendations/` | dernière recommandation / lancer le modèle |

`POST /api/recommendations/` renvoie 400 avec `missing_fields` si le questionnaire est
incomplet, et 503 si PyTorch n'est pas installé.

## Le modèle

- Fichiers : `apps/ai/model_files/careernet.pt` (poids) et `preprocess.json` (normalisation).
  Ils viennent du projet d'entraînement `DL_CareerVerser/project/artifacts/`. Après un
  réentraînement, recopier ces deux fichiers.
- Le temps réel passé sur un lab est ramené sur l'échelle d'entraînement
  (`REFERENCE_SECONDS_PER_MISSION` dans `apps/ai/catalog.py`). Ce calibrage est à
  réajuster quand de vraies données d'étudiants seront disponibles.

## Tests

```bash
python manage.py test apps
```

Les tests vérifient notamment que le backend donne exactement le même résultat que le
code de recherche (98,8 % Cybersecurity Analyst pour l'étudiant d'exemple).

# CareerVerse

CareerVerse est une plateforme de découverte de parcours professionnels destinée aux étudiants et jeunes diplômés. L’objectif est d’accompagner chaque utilisateur dans la compréhension de ses forces, de ses centres d’intérêt et des métiers qui correspondent le mieux à son profil, à travers une expérience claire, interactive et orientée carrière.

Le projet a été conçu avec une architecture modulaire, séparant clairement le frontend, le backend, la logique métier et les données. Cette structure permet d’ajouter facilement de nouvelles fonctionnalités telles que les recommandations IA, les simulations, les parcours d’apprentissage ou la gestion avancée des profils.

## 1. Concept du projet

CareerVerse aide l’utilisateur à :

- créer un compte et se connecter
- compléter son profil étudiant
- visualiser son dashboard personnalisé
- explorer des parcours professionnels pertinents
- simuler des scénarios de carrière
- recevoir des recommandations de compétences et de parcours d’apprentissage
- suivre sa progression dans une logique orientée coaching professionnel

L’application est pensée comme un assistant de carrière numérique : elle ne se contente pas d’afficher des données, mais guide l’utilisateur dans une réflexion sur son avenir professionnel.

## 2. Objectifs du projet

### Objectif principal
Favoriser la prise de décision sur le parcours académique et professionnel grâce à une expérience digitale intelligente et accessible.

### Objectifs fonctionnels
- authentification sécurisée
- gestion du profil utilisateur
- dashboard avec indicateurs clés
- simulation de métiers et scénarios
- recommandations personnalisées
- parcours de formation associés aux ambitions de carrière

### Objectifs techniques
- architecture claire et maintenable
- backend API REST robuste
- frontend mobile-friendly avec Ionic + Angular
- séparation des responsabilités par modules
- préparation pour évolution avec IA et base de données production

## 3. Stack technique

### Frontend
- Ionic
- Angular
- TypeScript
- Mobile-first / web app UI

### Backend
- Django
- Django REST Framework
- Python

### Base de données
- SQLite pour le développement local
- architecture compatible avec PostgreSQL pour la production

### Conteneurisation
- Docker
- Docker Compose

## 4. Architecture du projet

Le projet suit une architecture claire et structurée :

- frontend/ionic-app : interface utilisateur, navigation, screens, logique front
- backend/django-api : API backend, business logic, authentification, modules métier
- docs : documentation projet et architecture
- docker : configuration de conteneurisation

### Vue d’ensemble

- Couche Frontend : interface utilisateur, pages login/register, dashboard, profile, simulation, learning
- Couche Backend : API REST, validation, gestion des utilisateurs et modèles métiers
- Couche Données : persistance des données utilisateur et résultats d’analyse
- Couche Services / IA : point d’entrée pour recommandations et simulations avancées

## 5. Structure du projet

```text
CareerVerse/
├── backend/
│   └── django-api/
│       ├── api/
│       ├── apps/
│       ├── config/
│       ├── manage.py
│       ├── requirements.txt
│       ├── db.sqlite3
│       └── README.md
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── docs/
│   └── architecture.md
├── frontend/
│   └── ionic-app/
│       ├── src/
│       ├── angular.json
│       ├── package.json
│       └── tsconfig.json
├── .gitignore
├── README.md
└── .oxlintrc.json
```

## 6. Modules applicatifs

### Authentification
- inscription
- connexion
- gestion des comptes utilisateurs
- validation des données de formulaire

### Dashboard
- vue d’ensemble de l’utilisateur
- indicateurs clés
- statut du profil
- accès rapide vers les principales sections

### Profil utilisateur
- informations personnelles
- intérêts
- compétences
- préférences de parcours

### Simulation de carrière
- scénarios métier
- décisions utilisateur
- conseils et recommandations

### Parcours d’apprentissage
- modules de formation
- progression
- recommandations pédagogiques

## 7. Flux utilisateur

1. L’utilisateur ouvre l’application.
2. Il crée un compte ou se connecte.
3. Il accède au dashboard principal.
4. Il consulte son profil et ses intérêts.
5. Il lance une simulation de carrière.
6. Il reçoit une recommandation adaptée.
7. Il peut ensuite suivre un parcours d’apprentissage ciblé.

## 8. Installation et démarrage

### Prérequis
- Python 3.10+
- Node.js 18+
- npm
- Git

### 1) Backend Django

```bash
cd backend/django-api
python -m venv .venv
source .venv/bin/activate   # Linux / Mac
# ou .venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Le backend tourne généralement sur :

```text
http://localhost:8000
```

### 2) Frontend Ionic / Angular

```bash
cd frontend/ionic-app
npm install
npm start
```

Le frontend est accessible sur :

```text
http://localhost:4200
```

### 3) Docker

```bash
docker-compose up --build
```

## 9. API de base

Le backend expose une API REST structurée par modules, notamment :

- auth/login
- auth/register
- users
- profiles
- careers
- simulations
- recommendations

## 10. Règles de conception suivies

Ce projet favorise :

- clarté des responsabilités
- architecture modulaire
- séparation frontend/backend
- scalabilité progressive
- simplicité de maintenance
- préparation pour intégration IA

## 11. Points à améliorer dans la suite du projet

Les prochaines évolutions envisagées sont :

- base de données PostgreSQL en production
- authentification JWT avancée
- profil complet avec données métier
- moteur de recommandation IA
- historique de simulations
- parcours personnalisé par niveau d’études
- tableau de bord analytique

## 12. Conclusion

CareerVerse est un projet de plateforme de guidance professionnelle orienté étudiant. Sa force réside dans sa structure claire, son architecture modulaire et son potentiel d’évolution. Il permet de présenter une solution complète, cohérente et évolutive avec un frontend moderne, un backend fiable et une logique métier orientée métier / carrière.



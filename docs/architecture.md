# Architecture CareerVerse

## Vue d'ensemble

CareerVerse est une application destinée à accompagner les étudiants dans la découverte de métiers via des simulations, des évaluations et des recommandations personnalisées.

## Stack technique

- Frontend : Ionic + Angular
- Backend : Django + DRF
- Base de données : PostgreSQL
- IA : module backend dédié pour scoring et recommandations

## Couches

### 1. Couche Frontend

Le frontend gère :

- authentification
- profil utilisateur
- parcours étudiant
- simulations
- recommandations
- dashboard

### 2. Couche Backend

Le backend expose une API REST sécurisée et centralise :

- gestion des utilisateurs
- gestion des profils
- gestion des métiers
- simulations et résultats
- logique de recommandation

### 3. Couche Données

PostgreSQL stocke :

- utilisateurs
- profil étudiant
- compétences
- métiers
- simulations
- résultats
- recommandations

# Lunchline - Application de Gestion de Restaurant

Lunchline est une application complète de gestion de restaurant développée pour le Centre de Formation Professionnelle et Technique Sénégal-Japon. Elle permet de gérer les commandes, le menu, les utilisateurs et les profils.

## Fonctionnalités

- Gestion complète du menu (ajout, modification, suppression)
- Système de commande en ligne
- Gestion des utilisateurs avec authentification
- Profil utilisateur personnalisable
- Interface moderne et responsive

## Technologies Utilisées

- Frontend: Angular 17
- Backend: Node.js avec Express
- Base de données: MongoDB
- Authentification: JWT
- UI: Tailwind CSS
- State Management: RxJS

## Installation du Frontend

### Prérequis
- Node.js (version 16 ou supérieure)
- npm (vient avec Node.js)
- MongoDB Cloud (MongoDB Atlas)

## Installation

1. Cloner le repository
2. Installer les dépendances du frontend :
   ```bash
   cd frontend
   npm install @angular/common @angular/forms @angular/http --legacy-peer-deps
   ```
3. Installer les dépendances du backend :
   ```bash
   cd backend
   npm install
   ```
4. Configurer les variables d'environnement dans le fichier `.env` avec les valeurs suivantes :
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://mouhamadousarr4:VDeaOLNMoA4e7Nj1@cluster0.cgaiagd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=e0643f4d14c1a969c0c54694858ba873
   ```

## Démarrage

Pour démarrer l'application :

1. Démarrer le backend :
   ```bash
   cd backend
   npm start
   ```
2. Démarrer le frontend :
   ```bash
   cd frontend
   npm start
   ```

L'application sera accessible à l'adresse http://localhost:4200

## Structure du Projet

```
lunchline/
├── backend/           # API Node.js/Express
│   ├── src/          # Code source
│   └── package.json  # Dépendances backend
├── frontend/         # Application Angular
│   ├── src/         # Code source Angular
│   └── package.json # Dépendances frontend
└── README.md        # Documentation
```

## Fonctionnalités

- Gestion des menus (CRUD)
  - Affichage de la liste des plats
  - Ajout de nouveaux plats
  - Modification des plats existants
  - Suppression des plats
- Gestion des commandes
  - Affichage de l'historique des commandes
  - Détails des commandes
  - Statut des commandes (En cours, Préparation, Annulé, Terminé)
- Gestion des utilisateurs
  - Profil utilisateur
  - Modification des informations personnelles
- Interface utilisateur moderne avec Tailwind CSS
- Communication avec le backend via API REST

## Sécurité

- Authentification JWT
- Validation des données
- Protection des routes sensibles

## Contribuer

1. Clonez le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez la branche (`git push origin feature/amazing-feature`)

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
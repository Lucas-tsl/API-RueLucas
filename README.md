# 🏨 API-RueLucas

API REST pour la gestion des réservations et avis d'un établissement hôtelier.

## 🚀 Fonctionnalités

- 🏨 **Réservations** : CRUD complet avec codes uniques (RL-ABC123)
- ⭐ **Avis clients** : Gestion des commentaires et notes
- 🔍 **Recherche** : Filtrage par statut, nom, email
- 📊 **Pagination** : Navigation efficace des données
- 🔒 **CORS** : Compatible SwiftUI et Next.js

## 🛠️ Technologies

- Node.js + Express.js + MongoDB + Mongoose

## ⚡ Installation

```bash
git clone https://github.com/Lucas-tsl/API-RueLucas.git
cd API-RueLucas
npm install
```

Créer un fichier `.env` :
```env
MONGO_URI=mongodb://127.0.0.1:27017/rue_lucas
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

Démarrer l'API :
```bash
npm run dev  # développement
npm start    # production
```

**🌐 API** : http://localhost:4000

## 🔗 Endpoints

### Réservations
- `GET /reservations` - Liste avec filtres (`?q=`, `?status=`, `?page=`)
- `POST /reservations` - Créer une réservation
- `GET /reservations/:id` - Détails d'une réservation
- `PATCH /reservations/:id` - Modifier (statut, etc.)
- `DELETE /reservations/:id` - Supprimer

### Avis
- `GET /api/reviews` - Liste des avis
- `POST /api/reviews` - Ajouter un avis

### Utilitaires
- `GET /health` - Statut de l'API

## 📝 Exemples

### Créer une réservation
```bash
curl -X POST http://localhost:4000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "firstName": "Jean",
    "surname": "Dupont",
    "phoneNumber": "+33123456789",
    "street": "123 Rue de la Paix",
    "postcode": "75001",
    "city": "Paris",
    "country": "France",
    "startDate": "2025-12-15T14:00:00.000Z",
    "endDate": "2025-12-22T10:00:00.000Z",
    "paymentMethod": "card",
    "amountTotal": 1200.50
  }'
```

### Rechercher
```bash
curl "http://localhost:4000/reservations?q=Jean&status=paid"
```

### Ajouter un avis
```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Marie",
    "rating": 5,
    "comment": "Excellent séjour !"
  }'
```

## 📊 Statuts

- `200` Succès • `201` Créé • `400` Erreur • `404` Non trouvé

## 🚀 Déploiement Vercel

### ⚡ Déploiement en 3 étapes

#### 1. 📋 Prérequis
- Compte GitHub (déjà fait ✅)
- Compte Vercel gratuit : [vercel.com](https://vercel.com)
- Base MongoDB Atlas gratuite : [cloud.mongodb.com](https://cloud.mongodb.com)

#### 2. 🗄️ Configuration MongoDB Atlas
1. **Créer un cluster gratuit** → "M0 Sandbox" (gratuit)
2. **Database Access** → Add User (nom/mot de passe)
3. **Network Access** → Add IP → `0.0.0.0/0`
4. **Connect** → Drivers → Copier l'URI : `mongodb+srv://...`

#### 3. 🚀 Déploiement Vercel
1. Aller sur [vercel.com](https://vercel.com) → "Sign Up" avec GitHub
2. "New Project" → Import `Lucas-tsl/API-RueLucas`
3. **Variables d'environnement** :
   ```
   MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/rue_lucas
   CORS_ORIGIN = *
   NODE_ENV = production
   ```
4. "Deploy" 🚀

### 🌍 URLs de production
- **Production** : `https://api-rue-lucas.vercel.app`
- **Développement** : `http://localhost:4000`

### ✅ Test de production
```bash
curl https://api-rue-lucas.vercel.app/health
```

### 🔄 CI/CD Automatique
- Push sur `main` → Déploiement automatique
- Push sur autres branches → Preview automatique

---

💻 **Par** [Lucas-tsl](https://github.com/Lucas-tsl) • 🏨 **Projet** Rue Lucas APP

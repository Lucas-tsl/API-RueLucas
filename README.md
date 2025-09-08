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

## ⚡ Installation locale

```bash
git clone https://github.com/Lucas-tsl/API-RueLucas.git
cd API-RueLucas
npm install
```

Créer un fichier `.env` :
```env
MONGO_URI=mongodb://127.0.0.1:27017/rue_lucas
PORT=4000
CORS_ORIGIN=*
```

Démarrer l'API :
```bash
npm run dev  # développement
npm start    # production
```

**🌐 Local** : http://localhost:4000 • **🌍 Production** : https://api-rue-lucas.vercel.app

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

```bash
# Créer une réservation
curl -X POST https://api-rue-lucas.vercel.app/reservations \
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

# Rechercher des réservations
curl "https://api-rue-lucas.vercel.app/reservations?q=Jean&status=paid"

# Ajouter un avis
curl -X POST https://api-rue-lucas.vercel.app/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Marie",
    "rating": 5,
    "comment": "Excellent séjour !"
  }'
```

##  Déploiement Vercel

### Configuration rapide :
1. **MongoDB Atlas** : Créer cluster gratuit → Copier URI
2. **Vercel** : Import GitHub repo → Variables d'environnement :
   ```
   MONGO_URI = mongodb+srv://user:pass@cluster.mongodb.net/rue_lucas
   CORS_ORIGIN = *
   NODE_ENV = production
   ```
3. **Deploy** 🚀

### CI/CD automatique :
- Push sur `main` → Déploiement production
- Push sur branches → Preview automatique

---

💻 **Par** [Lucas-tsl](https://github.com/Lucas-tsl) • 🏨 **Projet** Rue Lucas APP

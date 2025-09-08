# 🏨 API-RueLucas

API REST pour la gestion des avis d'un établissement hôtelier.

## 🚀 Fonctionnalités

- **Gestion des avis** : Récupération et ajout d'avis clients
- **Base MongoDB** : Stockage sécurisé des données
- **API REST** : Endpoints simples et efficaces

## 🛠️ Technologies

- Node.js + Express.js
- MongoDB + Mongoose
- CORS

## ⚡ Installation

```bash
git clone https://github.com/Lucas-tsl/API-RueLucas.git
cd API-RueLucas
npm install
npm start
```

**URL** : http://localhost:3000

## 🔗 Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/reviews` | Récupère tous les avis |
| `POST` | `/api/reviews` | Ajoute un nouvel avis |

### Exemple POST `/api/reviews`
```json
{
  "author": "Jean Dupont",
  "rating": 5,
  "comment": "Excellent séjour !"
}
```

## � À venir
- Système de réservation
- Notifications email/SMS
- Authentification

---

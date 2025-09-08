# 🚀 Déploiement Vercel - API Rue Lucas

## ⚡ Déploiement en 3 étapes

### 1. � Prérequis
- Compte GitHub (déjà fait ✅)
- Compte Vercel gratuit : [vercel.com](https://vercel.com)
- Base MongoDB Atlas gratuite : [cloud.mongodb.com](https://cloud.mongodb.com)

### 2. 🗄️ Configuration MongoDB Atlas

1. **Créer un cluster gratuit** :
   - Aller sur MongoDB Atlas → "Build a Database"
   - Choisir "M0 Sandbox" (gratuit)
   - Région : Europe (Ireland)

2. **Configuration réseau** :
   - Database Access → Add User → Nom/mot de passe
   - Network Access → Add IP → `0.0.0.0/0` (accès mondial)

3. **Récupérer l'URI** :
   - Connect → Drivers → Node.js
   - Copier l'URI : `mongodb+srv://username:password@cluster.mongodb.net/rue_lucas`

### 3. � Déploiement Vercel

#### Option A : Interface Web (Recommandé)
1. Aller sur [vercel.com](https://vercel.com)
2. "Sign Up" avec GitHub
3. "New Project" → Import `Lucas-tsl/API-RueLucas`
4. **Variables d'environnement** :
   ```
   MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/rue_lucas
   CORS_ORIGIN = *
   NODE_ENV = production
   ```
5. "Deploy" 🚀

#### Option B : CLI Vercel
```bash
# Installation CLI
npm install -g vercel

# Login
vercel login

# Déploiement
vercel

# Configuration des variables (après premier déploiement)
vercel env add MONGO_URI
vercel env add CORS_ORIGIN
vercel env add NODE_ENV

# Redéploiement avec variables
vercel --prod
```

## 🌍 URLs après déploiement

- **Production** : `https://api-rue-lucas.vercel.app`
- **Preview** : `https://api-rue-lucas-xxx.vercel.app` (branches)

## ✅ Tests de production

```bash
# Health check
curl https://api-rue-lucas.vercel.app/health

# Réservations
curl https://api-rue-lucas.vercel.app/reservations

# Créer une réservation
curl -X POST https://api-rue-lucas.vercel.app/reservations \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vercel.com","firstName":"Test","surname":"Vercel"}'
```

## 🔄 CI/CD Automatique

- ✅ **Push sur `main`** → Déploiement production automatique
- ✅ **Push sur autres branches** → Preview automatique
- ✅ **Pull Requests** → Preview links dans GitHub

## � Avantages Vercel

- ⚡ **Serverless** : Scaling automatique
- 🆓 **Gratuit** : 100GB bandwidth/mois
- 🌍 **CDN Global** : Performance mondiale
- 🔒 **HTTPS** : SSL automatique
- 📊 **Analytics** : Monitoring intégré

## � Configuration avancée

### Domaine personnalisé
1. Vercel Dashboard → Settings → Domains
2. Ajouter : `api.ruelucas.com`
3. Configurer DNS chez votre registrar

### Monitoring
- Vercel Dashboard → Analytics
- Temps de réponse, erreurs, utilisation

---

🎉 **Votre API sera accessible en moins de 5 minutes !**

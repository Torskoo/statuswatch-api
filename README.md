# 🌐 StatusWatch API

Cette API sert de **backend pour l’extension Firefox StatusWatch**.  
Elle se charge de vérifier la disponibilité et la latence des services (IP, hostname, URL) configurés par l’utilisateur dans l’extension.

---

## ✨ Fonctionnalités

- Vérification d’adresses **IP** via ICMP (ping).
- Vérification de services **HTTP/HTTPS** via requête web.
- Réponse structurée avec **latence** et **statut up/down**.
- Extensible facilement (nouveaux protocoles possibles).
- API clé optionnelle pour sécuriser l’accès.

---

## 📦 Installation

### Prérequis
- Node.js >= 18
- npm

### Étapes
```bash
git clone https://github.com/Torskoo/statuswatch-api.git
cd statuswatch-api
npm install
```

---

## 🚀 Lancer le serveur

```bash
node server.js
```

Par défaut, le serveur écoute sur `http://localhost:3000`.

---

## 📡 Endpoints

### POST `/check`

Vérifie une liste de services envoyés par l’extension.

#### Requête :
```http
POST /check
Content-Type: application/json
Authorization: Bearer <apiKey>   # optionnel

{
  "services": [
    { "id": "abc123", "url": "https://example.com" },
    { "id": "def456", "url": "8.8.8.8" }
  ]
}
```

#### Réponse :
```json
{
  "results": [
    { "id": "abc123", "status": "up", "latency_ms": 87 },
    { "id": "def456", "status": "down", "error": "timeout" }
  ]
}
```

- `status`: `up` ou `down`
- `latency_ms`: temps de réponse en millisecondes (si dispo)
- `error`: message d’erreur si indisponible

---

## ⚙️ Configuration

Les variables suivantes peuvent être définies :

- `PORT` : port HTTP (par défaut `3000`)
- `API_KEY` : si défini, toutes les requêtes doivent inclure `Authorization: Bearer <API_KEY>`

---

## 🛠️ Développement

### Structure du projet
```
statuswatch-api/
├── server.js      # Point d'entrée principal
├── package.json   # Dépendances
└── README.md      # Ce fichier
```

### Dépendances principales
- [express](https://www.npmjs.com/package/express) – framework web
- [ping](https://www.npmjs.com/package/ping) – ping ICMP
- [node-fetch](https://www.npmjs.com/package/node-fetch) – requêtes HTTP

---

## 📄 Licence

MIT © 2025  
Contributions et PR bienvenues 🙌

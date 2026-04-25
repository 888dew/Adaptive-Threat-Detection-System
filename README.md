# 🛡️ Adaptive Threat Detection System (ATDS)

![Header](/home/ruok/.gemini/antigravity/brain/0f9b47a1-ea3e-457f-bf5b-4ed7c49da930/threat_detection_header_1777104811614.png)

An intelligent, event-driven security system that learns user behavior patterns to detect anomalies in real-time. Unlike static firewall rules, **ATDS** adapts to the attacker, providing a dynamic defense layer.

## 🚀 Key Features

- **Behavioral Analysis**: Builds a dynamic baseline for every user (Typical IPs, Locations, Hours).
- **Risk Scoring Engine**: Weighted scoring system that evaluates threat levels (Low, Medium, High, Critical).
- **API Protection**: Mandatory **API Key Authentication** with timing-attack resistant comparison.
- **Strict Validation**: All inputs validated via **Zod schemas** to prevent injection and malformed data.
- **Event-Driven Architecture**: Decoupled system using an internal Event Bus for real-time reactivity.
- **Auto-Learning**: Automatically updates user baselines based on low-risk behavior.
- **Maximum Security**: Pre-configured with **Helmet (custom CSP)**, CORS protection, and Rate Limiting.

## 🛠️ Tech Stack

- **Core**: Node.js & TypeScript
- **API**: Express.js
- **Security**: Helmet, Express-Rate-Limit
- **Environment**: Dotenv for secret management

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

## 🎮 Running the Demo

To see the system in action (Normal behavior vs. Anomalies):

```bash
npm run demo
```

## 🛡️ Security Implementation

- **Data Protection**: All sensitive configurations are handled via `.env` (excluded from Git).
- **Rate Limiting**: Protection against Brute Force and DoS attacks.
- **Input Validation**: Strict typing with TypeScript and metadata sanitization.

## 📈 Roadmap

- [ ] Persistent storage with MongoDB/PostgreSQL.
- [ ] Advanced ML models for pattern recognition.
- [ ] Real-time WebSocket Dashboard.
- [ ] Integration with external SIEM tools.

---

Built with focus on **Security First** by Antigravity.

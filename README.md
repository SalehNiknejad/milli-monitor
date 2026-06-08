# Milli Monitor

A modern portfolio and market monitoring application for Gold and USDT investors.

Milli Monitor helps you track real-time prices, calculate profits, manage your holdings, estimate future purchases, and create custom price alerts — all within a fast, responsive, and desktop-ready interface.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-4-purple)
![Electron](https://img.shields.io/badge/Electron-28-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### 📈 Real-Time Market Monitoring

* Live Gold price tracking
* Live USDT price tracking
* Automatic price refresh
* Price change indicators
* Last update timestamps

### 💼 Portfolio Overview

Track your complete investment portfolio:

* Wallet balance
* Asset holdings
* Asset value
* Total portfolio value

### 🧮 Profit Calculators

#### Gold Profit Calculator

* Buy and sell profit estimation
* Commission-aware calculations
* Historical purchase tracking
* Current profit/loss analysis

#### USDT Profit Calculator

* Buy and sell profit estimation
* Target price simulation
* Capital planning
* Commission-aware calculations

### 💰 Wallet Calculator

Estimate how much Gold or USDT can be purchased based on your available capital.

Features include:

* Purchase amount estimation
* Fee calculation
* Net asset calculation
* Total cost breakdown

### 🔔 Price Alerts

Create custom market alerts and get notified when target prices are reached.

* Custom target prices
* Browser notifications
* Persistent alert storage

### 🎨 User Experience

* Modern dark interface
* Responsive design
* RTL support
* Local-first experience
* Desktop support via Electron

---

## 📸 Screenshots

### Gold Dashboard

![Gold Dashboard](./screenshots/gold-dashboard.png)

### USDT Dashboard

![USDT Dashboard](./screenshots/usdt-dashboard.png)

---

## 🏗️ Technology Stack

### Frontend

* React 18
* TypeScript
* Vite
* Zustand
* React Router
* Tailwind CSS
* Recharts
* Lucide React

### Backend

* Express
* CORS

### Desktop

* Electron
* Electron Builder

---

## 📁 Project Structure

```text
src
├── components
│   ├── layout
│   ├── PriceCard
│   ├── AlertStatus
│   ├── GoldProfitCalculator
│   ├── HeartHint
│   ├── PortfolioSummary
│   ├── PriceAlert
│   ├── ProfitCalculator
│   └── WalletCalculator
│
├── configs
│   └── assetConfig.tsx
│
├── hooks
│   └── useAssetPrice.ts
│
├── services
│   └── portfolioApi.ts
│
├── store
│   └── portfolioStore.ts
│
├── types
│
├── utils
│   ├── currency.ts
│   └── transactionParser.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/SalehNiknejad/milli-monitor.git
```

Navigate to the project directory:

```bash
cd milli-monitor
```

Install dependencies:

```bash
npm install
```

---

## 💻 Development

Run frontend:

```bash
npm run dev
```

Run backend:

```bash
npm run server
```

Run both frontend and backend:

```bash
npm start
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:3001
```

---

## 📦 Production Build

Build the application:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 🖥️ Electron

Run Electron in development mode:

```bash
npm run electron:dev
```

Build desktop application:

```bash
npm run electron:build
```

Generated installers will be available in:

```text
dist-electron/
```

---

## 💾 Data Persistence

Milli Monitor stores user data locally and on the local Express server to preserve information between sessions.

Stored data includes:

* Portfolio information
* Holdings
* Price alerts
* Theme preferences
* Calculator inputs

---

## 🎯 Use Cases

* Monitoring Gold investments
* Monitoring USDT holdings
* Calculating profit and loss
* Planning future purchases
* Tracking portfolio performance
* Setting automated market alerts

---

## 🔮 Roadmap

* Historical price charts
* Advanced alert conditions
* Additional asset support
* Cloud synchronization
* Portfolio analytics

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Saleh Niknejad**

Frontend Developer • React • TypeScript • Electron

GitHub: https://github.com/SalehNiknejad

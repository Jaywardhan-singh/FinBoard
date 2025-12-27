# FinBoard — A Customizable Real-Time Finance Dashboard

FinBoard is a modern, production-ready finance dashboard built with **Next.js, TypeScript, and Tailwind CSS**. It allows users to connect to any financial API, dynamically select fields, and visualize real-time data using customizable widgets.

---

## ✨ Features

- **Dynamic API Integration** — Connect to any REST API (Alpha Vantage, Finnhub, Coinbase, etc.)
- **Field Selection** — Automatically explore and select fields from JSON responses
- **Multiple Display Modes** — Card, Table, and Chart views
- **Real-Time Updates** — Configurable auto-refresh per widget
- **Drag & Drop Layout** — Reorder widgets smoothly
- **Persistence** — Dashboard configuration saved in `localStorage`
- **Modern UI** — Responsive design with dark mode support
- **Error Handling** — Graceful API and validation error handling
- **Rate Limiting & Caching** — Prevents excessive API calls

---

## 🧰 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** — State management
- **Axios** — HTTP requests
- **Recharts** — Data visualization
- **Deployment** - Vercel/Netlify

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Add a Widget**: Click the "+ Add Widget" button
2. **Configure Widget**:
   - Enter a widget name
   - Provide an API URL
   - Click "Test" to verify the connection
   - Set refresh interval
   - Choose display mode (Card/Table/Chart)
3. **Select Fields**: After successful connection, select which fields to display
4. **Add to Dashboard**: Click "Add Widget" to add it to your dashboard
5. **Manage Widgets**: 
   - Drag widgets to reorder
   - Click refresh icon to manually refresh
   - Click settings icon to edit
   - Click trash icon to delete

## Example API URLs

- **Coinbase**: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`
- **Alpha Vantage**: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY`
- **Finnhub**: `https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_KEY`

## Project Structure

```
src/
├── app/             # Next.js app router
├── components/      # React components
│   ├── dashboard/   # Dashboard-specific components
│   ├── widgets/     # Widget display components
│   └── ui/          # Reusable UI components
├── store/           # Zustand stores
├── services/        # API and business logic
├── hooks/           # Custom React hooks
└── utils/           # Utility functions
```

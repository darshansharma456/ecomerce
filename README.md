# NOVA — E-Commerce Shopping Platform

A responsive, modern storefront built with React and Vite. This portfolio project demonstrates common e-commerce user experiences, including product discovery, cart management, wishlists and a demo checkout flow.

## Features

- Responsive storefront with editorial hero and product collection
- Product search and category filtering
- Sorting by featured, price and rating
- Product quick-view modal
- Shopping cart with quantity controls and subtotal/shipping calculation
- Wishlist saved in browser storage
- Demo checkout form with client-side validation
- Newsletter signup interaction
- Cart and wishlist persist using `localStorage`
- Responsive mobile navigation

## Tech stack

- React 18
- Vite
- Lucide React icons
- Custom CSS
- Browser `localStorage`

## Run locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

Create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
├── data/
│   └── products.js
├── App.jsx
├── main.jsx
└── styles.css
```

## Demo notes

This version is a frontend portfolio demo. Products are sample data and cart/wishlist state is stored in the browser. Checkout validates the form and displays a demo confirmation; it does **not** process payments, create real orders, or send customer data to a server.

Product photography is loaded from Unsplash and Google Fonts are loaded remotely, so an internet connection is needed for those assets.

## Suggested next steps

1. Add React Router routes for product, account and admin pages.
2. Add Redux Toolkit for scalable global state management.
3. Build an Express REST API and MongoDB models for users, products and orders.
4. Add secure authentication with hashed passwords and HTTP-only cookies.
5. Integrate a payment provider in test mode; never store card details yourself.
6. Add automated tests, accessibility checks and deployment.

## License

MIT — use and adapt this project for learning and portfolio purposes.

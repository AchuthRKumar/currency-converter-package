# React Auto Currency Converter

A plug-and-play React component that automatically converts and displays a price in the user's local currency. It's designed to be zero-config for simple use cases, yet fully flexible for advanced scenarios.

## Key Features

-   🌍 **Automatic Geolocation**: Detects the user's location to display their local currency by default.
-   ⚙️ **Zero-Config Start**: Simply wrap your app and use the component. Prices default to being in EUR.
-   💪 **Powerful & Flexible**: Optionally specify a `baseCurrency` for your prices (e.g., USD, JPY) and a `targetCurrency` to override the automatic display.
-   🌐 **Reliable Rates**: Powered by a dedicated backend that fetches and caches daily exchange rates from the European Central Bank (ECB).
-   🛡️ **Resilient**: Gracefully falls back to a default currency (EUR) if geolocation or rate fetching fails.
-   📦 **Lightweight & Modern**: Built with TypeScript and Vite for optimal performance.

## Installation

```bash
npm install react-auto-currency-converter
```

## Quick Start

It's incredibly easy to get started. Just follow these two steps:

**1. Wrap your application with the `CurrencyProvider`**

The provider handles fetching all the necessary data. It's best to place it at the root of your application.

```jsx
// In your main App.js or index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CurrencyProvider } from 'react-auto-currency-converter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </React.StrictMode>,
);
```

**2. Use the `CurrencyConverter` component wherever you need a price**

Simply pass your price as the `value` prop. By default, the component assumes the `value` is in EUR.

```jsx
import { CurrencyConverter } from 'react-auto-currency-converter';

function ProductCard() {
  return (
    <div className="product-card">
      <h2>Super Fast Laptop</h2>
      <p>An amazing piece of technology from our EU store.</p>
      <p className="price">
        {/* This will automatically show USD for a US user */}
        Price: <CurrencyConverter value={999.99} />
      </p>
    </div>
  );
}
```

## API Reference

### `<CurrencyProvider>`

This component sets up the context for currency conversion. It has one optional prop.

| Prop         | Type     | Default                                        | Description                                                                                             |
| ------------ | -------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `apiBaseUrl` | `string` | `'https://currency-converter-package.vercel.app'` | The URL of the currency API. You can override this if you decide to self-host the backend service.      |

### `<CurrencyConverter>`

This component displays the converted price.

| Prop             | Type     | Default                               | Description                                                                                                          |
| ---------------- | -------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **`value`**      | `number` | **(required)**                        | The numerical price you want to display.                                                                             |
| `baseCurrency`   | `string` | `'EUR'`                               | The currency of the `value` prop (e.g., `'USD'`, `'GBP'`). Use this if your product prices are not in Euros.          |
| `targetCurrency` | `string` | _(user's detected local currency)_    | Forces the component to display the price in a specific currency, overriding the automatic geolocation-based currency. |

## Advanced Examples

### 1. Pricing in a Different Base Currency

If your product price is in US Dollars, specify it using the `baseCurrency` prop.

```jsx
function UsProductCard() {
  return (
    <div className="product-card">
      <h2>Wireless Mouse</h2>
      <p>From our US Store.</p>
      <p className="price">
        Price: <CurrencyConverter value={75.50} baseCurrency="USD" />
      </p>
    </div>
  );
}
```

### 2. Forcing a Specific Display Currency

You can override the automatic conversion and force the display into any supported currency. This is great for building a manual currency selector.

```jsx
function ProductWithForcedCurrency() {
  return (
    <div className="product-card">
      <h2>Mechanical Keyboard</h2>
      <p>Price will always be shown in British Pounds.</p>
      <p className="price">
        Price: <CurrencyConverter value={150} baseCurrency="EUR" targetCurrency="GBP" />
      </p>
    </div>
  );
}
```

### 3. Multi-Currency Display

Easily create a pricing table showing the value in multiple currencies.

```jsx
function MultiCurrencyPrice() {
  const priceInEur = 150;
  return (
    <div className="product-card">
      <h2>Global Product</h2>
      <p className="price">EUR: <CurrencyConverter value={priceInEur} targetCurrency="EUR" /></p>
      <p className="price">USD: <CurrencyConverter value={priceInEur} targetCurrency="USD" /></p>
      <p className="price">JPY: <CurrencyConverter value={priceInEur} targetCurrency="JPY" /></p>
    </div>
  );
}
```

## License

This project is licensed under the ISC License.
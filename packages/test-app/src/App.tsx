import { CurrencyProvider, CurrencyConverter } from 'react-currency-component';
import './App.css';

function App() {
  const API_URL = 'http://localhost:3001';

  return (
    // 1. Wrap your entire application (or the relevant part) in the Provider
    <CurrencyProvider apiBaseUrl={API_URL}>
      <div className="App">
        <header className="App-header">
          <h1>Product Page (Optimized)</h1>
          <ProductList />
        </header>
      </div>
    </CurrencyProvider>
  );
}

// It's good practice to have the components that use the context be
// children of the provider.
const ProductList = () => {
  return (
    <>
      <div className="product-card">
        <h2>Super Fast Laptop</h2>
        <p>An amazing piece of technology.</p>
        <p className="price">
          Price: <CurrencyConverter value={999.99} />
        </p>
      </div>
      <div className="product-card">
        <h2>Wireless Mouse</h2>
        <p>Click away with freedom.</p>
        <p className="price">
          Price: <CurrencyConverter value={49.5} />
          Price: <CurrencyConverter value={49.5} />
          Price: <CurrencyConverter value={100000} />
        </p>
      </div>
    </>
  );
};

export default App;

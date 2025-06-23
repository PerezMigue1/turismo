import React from 'react';
import Navigation from './app/Navigation/Navigation';
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from './app/Navigation/CartContext'; // ⚠️ Ajusta la ruta si es distinta

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Navigation />
      </div>
    </CartProvider>
  );
}

export default App;

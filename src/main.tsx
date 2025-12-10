import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./styles/app.css";
  import "./styles/overrides.css";
  import { CartProvider } from "./context/CartContext";

  createRoot(document.getElementById("root")!).render(
    <CartProvider>
      <App />
    </CartProvider>
  );

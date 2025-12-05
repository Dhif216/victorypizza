
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./styles/app.css";
  import "./styles/overrides.css";

  createRoot(document.getElementById("root")!).render(<App />);
  
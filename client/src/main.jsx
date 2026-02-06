import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AppProviders from "./providers/AppProviders";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProviders>
    <App />
  </AppProviders>
);

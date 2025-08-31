import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext";
import { SupplierProvider } from "./context/SupplierContext";
import { ProcurementProvider } from "./context/ProcurementContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <SupplierProvider>
        <ProcurementProvider>
          <App />
        </ProcurementProvider>
      </SupplierProvider>
    </UserProvider>
  </React.StrictMode>
);

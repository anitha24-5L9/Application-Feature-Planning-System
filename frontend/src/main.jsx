import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { EnvironmentProvider } from "./context/EnvironmentContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <EnvironmentProvider>
        <App />
      </EnvironmentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
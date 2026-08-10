import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";

import {
  EnvironmentProvider,
} from "./context/EnvironmentContext";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  ThemeProvider,
} from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <ThemeProvider>

          <EnvironmentProvider>

            <App />

          </EnvironmentProvider>

        </ThemeProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
);
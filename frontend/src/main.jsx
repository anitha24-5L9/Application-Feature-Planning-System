import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { EnvironmentProvider } from "./context/EnvironmentContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(

<React.StrictMode>

<BrowserRouter>


<ThemeProvider>


<AuthProvider>


<EnvironmentProvider>


<App />


</EnvironmentProvider>


</AuthProvider>


</ThemeProvider>


</BrowserRouter>


</React.StrictMode>

);
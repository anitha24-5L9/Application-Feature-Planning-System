import "./styles/global.css";
import "./styles/layout.css";

import "./styles/modal.css";

import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import Releases from "./pages/Releases";
import Environments from "./pages/Environments";
import AuditLogs from "./pages/AuditLogs";

import FlagDetail from "./pages/FlagDetail";
import EvaluateFlag from "./pages/EvaluateFlag";
function App() {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-section">

        <Navbar />

        <main className="page-content">

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route path="/features" element={<Features />} />

            <Route path="/flags/:key" element={<FlagDetail />} />

            <Route path="/releases" element={<Releases />} />

            <Route path="/environments" element={<Environments />} />

            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/evaluate" element={<EvaluateFlag />} />

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default App;
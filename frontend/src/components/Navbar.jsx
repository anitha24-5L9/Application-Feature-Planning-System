import { useContext } from "react";
import { EnvironmentContext } from "../context/EnvironmentContext";
import "./../styles/navbar.css";

export default function Navbar() {
  const { environment, setEnvironment } = useContext(EnvironmentContext);

  return (
    <header className="navbar">

  <div className="nav-left">
    <h2 className="nav-title">
      Application Feature Planning Release Governance System
    </h2>
  </div>

  <div className="nav-right">

    <input
      className="search-box"
      type="text"
      placeholder="Search features..."
    />

    <select
      value={environment}
      onChange={(e) => setEnvironment(e.target.value)}
      className="env-select"
    >
      <option>Development</option>
      <option>Testing</option>
      <option>Production</option>
    </select>

    <div className="profile-circle">
      A
    </div>

  </div>

</header>
  );
}
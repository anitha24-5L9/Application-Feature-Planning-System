import { NavLink } from "react-router-dom";
import "./../styles/sidebar.css";

export default function Sidebar() {
  const menu = [
    {
      name: "📊 Dashboard",
      path: "/",
    },
    {
      name: "🚩 Features",
      path: "/features",
    },
    {
      name: "🚀 Releases",
      path: "/releases",
    },
    {
      name: "🌍 Environments",
      path: "/environments",
    },
    {
      name: "🧹 Cleanup",
      path: "/cleanup",
    },
    {
      name: "📋 Audit Logs",
      path: "/audit-logs",
    },
    {
      name: "⚙️ Settings",
      path: "/settings",
    },
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>FlagFlow</h2>
        <span>Admin Panel</span>
      </div>

      <nav>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive
                ? "active nav-item"
                : "nav-item"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
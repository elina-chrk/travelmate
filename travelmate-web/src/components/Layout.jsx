import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
   const { logout, isAdmin } = useAuth(); 

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <h2 className="sidebar-title">TravelMate</h2>
          <nav className="sidebar-nav">
            <button
              onClick={() => navigate("/create-trip")}
              className="sidebar-button"
            >
              ➕ Створити нову подорож
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="sidebar-button"
            >
              👤 Профіль
            </button>
            <button
              onClick={() => navigate("/my-participations")}
              className="sidebar-button"
            >
              🧍‍♂️ Мої участі
            </button>
             {/* Кнопка для адміністратора */}
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="sidebar-button admin-button"
              >
                Панель адміністратора
              </button>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;

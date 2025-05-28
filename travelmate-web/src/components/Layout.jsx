import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
import './Layout.css';

const Layout = ({ children }) => {
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <h2 className="sidebar-title">TravelMate</h2>
          <nav className="sidebar-nav">
            <button onClick={() => navigate("/create-trip")} className="sidebar-button">
              ➕ Створити нову подорож
            </button>
            <button onClick={() => navigate("/profile")} className="sidebar-button">
              👤 Профіль
            </button>
          </nav>
        </div>
        <div className="sidebar-footer">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="logout-button"
          >
            Вийти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

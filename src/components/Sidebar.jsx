import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
export default function Sidebar({
  collapsed,
  dataUserRef,
}) {
  
  
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };
  
  
  return (
    <div
      className="d-flex flex-column shadow-lg"
      style={{
        width: collapsed ? "70px" : "250px",
        minHeight: "100vh",
        backgroundColor: "#212529",
        color: "#fff",
        transition: "all 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div className="border-bottom text-center py-4">
        {!collapsed ? (
          <>
            <h5 className="fw-bold mb-0">USER</h5>
            <small className="text-secondary">Management</small>
          </>
        ) : (
          <h4 className="fw-bold mb-0">UM</h4>
        )}
      </div>

      {/* Menu */}
      <div className="flex-grow-1 p-3">
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <button
              
              
              
              className="nav-link text-white rounded px-3 py-2 border-0 bg-transparent w-100 text-start"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              {!collapsed && "Logout"}
            </button>
         
         
         
         </li>



          <li className="nav-item">
            <Link
              to="/dashboard"
              className="nav-link text-white rounded px-3 py-2"
            >
              <i className="bi bi-speedometer2 me-2"></i>
              {!collapsed && "Dashboard"}
            </Link>
          </li>

          <li className="nav-item">
            <a
              href="#data-user"
              className="nav-link text-white rounded px-3 py-2"
            >
              <i className="bi bi-table me-2"></i>
              {!collapsed && "Data User"}
            </a>
          </li>

          <li className="nav-item">
            <Link
              to="/change-password"
              className="nav-link text-white rounded px-3 py-2"
            >
              <i className="bi bi-key me-2"></i>
              {!collapsed && "Ganti Password"}
            </Link>
          </li>

        </ul>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="border-top p-3 text-center text-secondary">
          <small>© 2026</small>
        </div>
      )}
    </div>
  );
}

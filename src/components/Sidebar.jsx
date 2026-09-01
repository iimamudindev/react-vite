import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/api";
export default function Sidebar({
  collapsed,
  dataUserRef,
}) {


  const navigate = useNavigate();
  const location = useLocation();


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
    height: "100vh",
      position: "sticky",
        top: 0,
         zIndex: 1000,
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
            <small className="text-secondary">Menu Utama</small>
          </>
        ) : (
          <h4 className="fw-bold mb-0">UM</h4>
        )}
      </div>

      {/* Menu */}
            <div className="flex-grow-1 p-3">
        <ul className="nav flex-column gap-2">

          <li className="nav-item">
            <NavLink
              to="/dashboard"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className={({ isActive }) =>
                `nav-link text-white rounded px-3 py-2 ${isActive ? "bg-info" : ""
                }`
              }
            >
              <i className="bi bi-speedometer2 me-2"></i>
              {!collapsed && "Dashboard"}
            </NavLink>
          </li>



          <li className="nav-item">
            <NavLink
              to="/pos"
              className={({ isActive }) =>
                `nav-link text-white rounded px-3 py-2 ${isActive ? "bg-info" : ""
                }`
              }
            >
              <i className="bi bi-cart-check me-2"></i>
              {!collapsed && "Kasir / POS"}
            </NavLink>
          </li>

          <li className="nav-item">

        <button
              className="nav-link text-white rounded px-3 py-2 border-0 bg-transparent w-100 text-start"
              onClick={() => {
                if (location.pathname !== "/dashboard") {
                  navigate("/dashboard");
                  setTimeout(() => {
                    document
                      .getElementById("data-user")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                } else {
                  document
                    .getElementById("data-user")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <i className="bi bi-table me-2"></i>
              {!collapsed && "Data User"}
            </button>




          </li>
          <li className="nav-item">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `nav-link text-white rounded px-3 py-2 ${isActive ? "bg-info" : ""
                }`
              }
            >
              <i className="bi bi-box-seam me-2"></i>
              {!collapsed && "Master Data Produk"}
            </NavLink>
          </li>






<li className="nav-item">
  <NavLink
    to="/transactions"
    className="nav-link text-white rounded px-3 py-2"
  >
    <i className="bi bi-receipt me-2"></i>
    {!collapsed && "Riwayat Transaksi"}
  </NavLink>
</li>

          <li className="nav-item">
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `nav-link text-white rounded px-3 py-2 ${isActive ? "bg-info" : ""
                }`
              }
            >
              <i className="bi bi-bar-chart-line me-2"></i>
              {!collapsed && "Laporan Penjualan"}
            </NavLink>
          </li>



          <li className="nav-item">
            <NavLink
              to="/change-password"
              className="nav-link text-white rounded px-3 py-2"
            >
              <i className="bi bi-key me-2"></i>
              {!collapsed && "Ganti Password"}
            </NavLink>
          </li>
          <li className="nav-item">
  <NavLink
    to="/activity-logs"
    className="nav-link text-white rounded px-3 py-2"
  >
    <i className="bi bi-clock-history me-2"></i>
    {!collapsed && "Activity Log"}
  </NavLink>
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

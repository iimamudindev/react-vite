
import { NavLink, useNavigate, useLocation } from "react-router-dom";


export default function Sidebar({ collapsed})  {
  const navigate = useNavigate();
  const location = useLocation();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";
  const isReceiptPage = location.pathname.startsWith("/receipt/");

  const lockedStyle = {
    opacity: 0.45,
    cursor: "not-allowed",
    pointerEvents: "none",
  };


  const menuLink = (to, icon, label) => (
    <li className="nav-item">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `nav-link text-white rounded px-3 py-2 ${isActive ? "bg-info" : ""
          }`
        }
      >
        <i className={`bi ${icon} me-2`}></i>
        {!collapsed && label}
      </NavLink>
    </li>
  );

  const lockedMenu = (icon, label) => (
    <li className="nav-item">
      <div
        className="nav-link text-white rounded px-3 py-2 d-flex align-items-center"
        style={lockedStyle}
        title="Khusus Admin"
      >
        <i className={`bi ${icon} me-2`}></i>
        {!collapsed && (
          <>
            <span>{label}</span>
            <i className="bi bi-lock-fill ms-auto"></i>
          </>
        )}
        {collapsed && (
          <i className="bi bi-lock-fill ms-auto"></i>
        )}
      </div>
    </li>
  );

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
      <div className="border-bottom text-center py-4">
        {!collapsed ? (
          <>
            <h5 className="fw-bold mb-0">Sistem Kasir</h5>
            <small className="text-secondary">Menu Utama</small>
          </>
        ) : (
          <h4 className="fw-bold mb-0">SK</h4>
        )}
      </div>

      <div className="flex-grow-1 p-3">
        <ul className="nav flex-column gap-2">

          {isAdmin
            ? menuLink("/dashboard", "bi-speedometer2", "Dashboard")
            : lockedMenu("bi-speedometer2", "Dashboard")}
          {menuLink("/pos", "bi-cart-check", "Kasir / POS")}

          {isAdmin ? (
            <li className="nav-item">
              <button
                className="nav-link text-white rounded px-3 py-2 border-0 bg-transparent w-100 text-start"
                onClick={() => {
                  if (location.pathname !== "/dashboard") {
                    navigate("/dashboard");
                    setTimeout(() => {
                      document.getElementById("data-user")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                  } else {
                    document.getElementById("data-user")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <i className="bi bi-table me-2"></i>
                {!collapsed && "Data User"}
              </button>
            </li>
          ) : (
            lockedMenu("bi-table", "Data User")
          )}

          {isAdmin
            ? menuLink("/products", "bi-box-seam", "Master Data Produk")
            : lockedMenu("bi-box-seam", "Master Data Produk")}

        {isAdmin
            ? menuLink("/transactions", "bi-receipt", "Riwayat Transaksi")
            : lockedMenu("bi-receipt", "Riwayat Transaksi")}

          {isAdmin
            ? menuLink("/reports", "bi-bar-chart-line", "Laporan Penjualan")
            : lockedMenu("bi-bar-chart-line", "Laporan Penjualan")}


          {isReceiptPage && (
            <li className="nav-item">
              <button
                className="nav-link text-white rounded px-3 py-2 border-0 bg-transparent w-100 text-start"
                onClick={() => window.print()}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                {!collapsed && "Simpan PDF"}
              </button>
            </li>
          )}

          {menuLink("/change-password", "bi-key", "Ganti Password")}

          {isAdmin
            ? menuLink("/activity-logs", "bi-clock-history", "Activity Log")
            : lockedMenu("bi-clock-history", "Activity Log")}

        </ul>
      </div>

      {!collapsed && (
        <div className="border-top p-3 text-center text-secondary">
          <small>© 2026</small>
        </div>
      )}
    </div>
  );
}

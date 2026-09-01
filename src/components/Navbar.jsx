export default function Navbar({ toggleSidebar }) {
  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow-sm px-4 sticky-top"
      style={{
        height: "70px",
        borderBottom: "1px solid #e9ecef",
      }}
    >
      {/* Toggle Sidebar */}
      <button
        className="btn btn-outline-secondary"
        onClick={toggleSidebar}
      >
        <i className="bi bi-list fs-5"></i>
      </button>

      {/* Judul */}
      <div className="ms-3">
        <h5 className="mb-0 fw-bold">
          Dashboard
        </h5>

        <small className="text-muted">
          Sistem Kasir & Manajemen Toko
        </small>
      </div>

      {/* User */}
      <div className="ms-auto d-flex align-items-center">

        <div className="text-end me-3">

          <div className="fw-semibold">
            {user?.name}
          </div>

          <small className="text-muted text-capitalize">
            {user?.role}
          </small>

        </div>

        <div
          className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
          style={{
            width: "42px",
            height: "42px",
            fontWeight: "bold",
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>

      </div>
    </nav>
  );
}

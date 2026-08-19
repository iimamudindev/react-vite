import { useEffect, useState } from "react";
import { getActivityLogs } from "../services/userService";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const logsPerPage = 10;

const formatDateTime = (dateString) => {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};


  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getActivityLogs();
        setLogs(data);
      } catch (err) {
        console.error("Gagal mengambil activity logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // ==================== PAGINATION ====================

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;

  const currentLogs = logs.slice(
    indexOfFirstLog,
    indexOfLastLog
  );

  const totalPages = Math.ceil(
    logs.length / logsPerPage
  );

  // ==================== ACTION BADGE ====================

  const actionBadge = (action) => {
    switch (action) {
      case "LOGIN":
        return (
          <span className="badge bg-success px-3 py-2">
            🔐 Login
          </span>
        );

      case "LOGOUT":
        return (
          <span className="badge bg-secondary px-3 py-2">
            🚪 Logout
          </span>
        );

      case "CREATE":
        return (
          <span className="badge bg-primary px-3 py-2">
            ➕ Create
          </span>
        );

      case "UPDATE":
        return (
          <span className="badge bg-warning text-dark px-3 py-2">
            ✏️ Update
          </span>
        );

      case "DELETE":
        return (
          <span className="badge bg-danger px-3 py-2">
            🗑️ Delete
          </span>
        );

      case "CHANGE_PASSWORD":
        return (
          <span className="badge bg-info text-dark px-3 py-2">
            🔑 Password
          </span>
        );

      default:
        return (
          <span className="badge bg-dark px-3 py-2">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">
          <div className="card shadow">

            <div className="card-header">
              <h4 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Activity Log
              </h4>
            </div>

            <div className="card-body">

              {loading ? (
                <p>Loading...</p>
              ) : logs.length === 0 ? (
                <p>Tidak ada activity log.</p>
              ) : (
                <>
                  <div className="table-responsive">

                    <table className="table table-striped table-hover table-bordered align-middle text-center shadow-sm mb-0">

                      <thead className="table-dark text-center">
                        <tr>
                          <th width="70">
                            No
                          </th>

                          <th>
                            <i className="bi bi-person me-1"></i>
                            Nama
                          </th>

                          <th>
                            <i className="bi bi-envelope me-1"></i>
                            Email
                          </th>

                          <th>
                            <i className="bi bi-lightning me-1"></i>
                            Action
                          </th>

                          <th>
                            <i className="bi bi-chat-left-text me-1"></i>
                            Description
                          </th>

                          <th>
                            <i className="bi bi-clock me-1"></i>
                            Waktu
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {currentLogs.map((log, index) => (
                          <tr key={log.id}>

                            <td>
                              {indexOfFirstLog + index + 1}
                            </td>

                            <td className="fw-semibold">
                              {log.name}
                            </td>

                            <td>
                              {log.email}
                            </td>

                            <td>
                              {actionBadge(log.action)}
                            </td>

                            <td className="text-start">
                              {log.description}
                            </td>

                             <td>
                              {formatDateTime(log.created_at)}
                             </td>
                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>

                  {/* ==================== PAGINATION ==================== */}

                  <div className="d-flex justify-content-between align-items-center mt-3">

                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage(currentPage - 1)
                      }
                    >
                      <i className="bi bi-chevron-left me-1"></i>
                      Prev
                    </button>

                    <span className="fw-semibold">
                      Halaman {currentPage} dari {totalPages}
                    </span>

                    <button
                      className="btn btn-primary btn-sm"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage(currentPage + 1)
                      }
                    >
                      Next
                      <i className="bi bi-chevron-right ms-1"></i>
                    </button>

                  </div>

                </>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

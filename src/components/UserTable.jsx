export default function UserTable({
  users,
  currentPage,
  usersPerPage,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  onEdit,
  onDelete,
}) {

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const roleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="badge bg-danger px-3 py-2">
            👑 Admin
          </span>
        );

      case "staff":
        return (
          <span className="badge bg-warning text-dark px-3 py-2">
            👨‍💼 Staff
          </span>
        );

      default:
        return (
          <span className="badge bg-success px-3 py-2">
            👤 User
          </span>
        );
    }
  };

  console.log("USER TABLE DATA:", users);

  if (!Array.isArray(users)) {
    return (
      <div className="alert alert-danger">
        Data users bukan array
      </div>
    );
  }

  
  return (
    <div
      className="table-responsive"
      style={{ minHeight: "520px" }}
    >

      <table className="table table-striped table-hover table-bordered align-middle text-center shadow-sm mb-0">
      
     

        <thead className="table-dark text-center">
          <tr>
            <th width="70">No</th>

            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("name")}
            >
              
              
              
              <i className="bi bi-person me-1"></i>
              Nama
               {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("email")}
            >
              <i className="bi bi-envelope me-1"></i>
              Email
               {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("role")}
            >
              <i className="bi bi-shield-lock me-1"></i>
              Role{sortField === "role" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th width="200">Aksi</th>
          </tr>
        </thead>

        <tbody>

          {users.length === 0 ? (

            <tr>
              <td colSpan="5">
                Tidak ada data
              </td>
            </tr>

          ) : (

            users.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * usersPerPage + index + 1}</td>

                <td className="fw-semibold">
                  {user.name}
                </td>

                <td className="text-primary">
                  {user.email}
                </td>
                
                <td>
                  {roleBadge(user.role)}
                </td>

               

                <td>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => onEdit(user)}
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(user.id)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Hapus
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>
    </div>
  );
}

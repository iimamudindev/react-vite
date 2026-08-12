export default function UserForm({
  newUser,
  handleInputChange,
  handleCreate,
  errorMessage,
}) {
  return (
    <div className="card border-0 shadow">
      <div className="card-body">

        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              👤 Nama
            </label>

            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Masukkan nama"
              value={newUser.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              ✉ Email
            </label>

            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Masukkan email"
              value={newUser.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              🔒 Password
            </label>

            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Masukkan password"
              value={newUser.password}
              onChange={handleInputChange}
            />
          </div>

          

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              🛡 Role
            </label>

            <select
              className="form-select"
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

        </div>

        {errorMessage && (
          <div className="alert alert-danger mt-3">
            {errorMessage}
          </div>
        )}

        <div className="mt-4 text-end">
          <button
            className="btn btn-primary px-4"
            onClick={handleCreate}
          >
            ➕ Tambah User
          </button>
        </div>

      </div>
    </div>
  );
}
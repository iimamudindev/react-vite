import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/userService";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";



export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);


  async function handleSubmit() {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      alert("Semua kolom password wajib diisi");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Konfirmasi password tidak sama");
      return;
    }

    if (form.newPassword.trim().length < 6) {
      alert("Password baru minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      const res = await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      alert("Password berhasil diubah. Silakan login kembali.");

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      navigate("/", { replace: true });

    } catch (err) {
      console.error("CHANGE PASSWORD ERROR:", err.response?.data || err);

      alert(
        err.response?.data?.message || "Gagal mengganti password"
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">
          <div className="card shadow">
            <div className="card-header">
              <h4>Ganti Password</h4>
            </div>

            <div className="card-body">
              <input
                className="form-control mb-3"
                type="password"
                placeholder="Password Lama"
                value={form.oldPassword}
                onChange={(e) =>
                  setForm({ ...form, oldPassword: e.target.value })
                }
              />

              <input
                className="form-control mb-3"
                type="password"
                placeholder="Password Baru"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />

              <input
                className="form-control mb-3"
                type="password"
                placeholder="Konfirmasi Password Baru"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Simpan Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Products() {
console.log("=== PRODUCTS JSX RENDER ===");
  const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    category_id: "",
    code: "",
    name: "",
    purchase_price: "",
    selling_price: "",
    stock: "",
    unit: "pcs",
    is_active: 1,
  });
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
      alert("Gagal mengambil data produk");
    }
  };
const fetchCategories = async () => {
  try {
    const res = await api.get("/categories");

    console.log("CATEGORIES RESPONSE =", res.data);

    setCategories(res.data);
  } catch (err) {
    console.error("GAGAL CATEGORIES =", err);
  }
};


  const resetForm = () => {
    setForm({
      category_id: "",
      code: "",
      name: "",
      purchase_price: "",
      selling_price: "",
      stock: "",
      unit: "pcs",
      is_active: 1,
    });

    setEditingProduct(null);
  };

  const openAddModal = () => {
    console.log("TAMBAH BARANG DIKLIK");
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      category_id: product.category_id,
      code: product.code,
      name: product.name,
      purchase_price: product.purchase_price,
      selling_price: product.selling_price,
      stock: product.stock,
      unit: product.unit,
      is_active: product.is_active,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const formatNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  return Number(value).toLocaleString("id-ID", {
    maximumFractionDigits: 0,
  });
};

const parseNumber = (value) => {
  return value.replace(/\./g, "").replace(/,/g, "");
};

  const handleSubmit = async (e) => {
    e.preventDefault();


console.log("HANDLE SUBMIT PRODUCTS DIPANGGIL");
console.log("FORM PRODUCTS =", form);


    if (!form.category_id || !form.code || !form.name) {
      alert("Kategori, kode, dan nama wajib diisi");
      return;
    }

    try {
      setLoading(true);

      if (editingProduct) {
        await api.put(
          `/products/${editingProduct.id}`,
          form
        );

        alert("Produk berhasil diperbarui");
      } else {
        await api.post("/products", form);

        alert("Produk berhasil ditambahkan");
      }

      setShowModal(false);
      resetForm();
      await fetchProducts();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Gagal menyimpan produk"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Nonaktifkan produk "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${product.id}`);

      alert("Produk berhasil dinonaktifkan");

      await fetchProducts();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Gagal menonaktifkan produk"
      );
    }
  };

  return (
    <div className="d-flex min-vh-100">

      <Sidebar collapsed={collapsed} />

      <div className="flex-grow-1">

        <Navbar
          toggleSidebar={() =>
            setCollapsed(!collapsed)
          }
        />

        <div
          className="container-fluid p-4"
          style={{
            backgroundColor: "#f4f6f9",
            minHeight: "calc(100vh - 56px)",
          }}
        >

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h3 className="fw-bold mb-0">
              <i className="bi bi-box-seam me-2"></i>
              Master Data Produk
            </h3>

            <button
              className="btn btn-primary"
              onClick={openAddModal}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Tambah Barang
            </button>

          </div>

          <div className="card shadow-sm">

            <div className="card-header fw-bold">
              Daftar Produk
            </div>

            <div className="card-body">

              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Kode</th>
                      <th>Nama</th>
                      <th>Kategori</th>
                      <th>Harga Beli</th>
                      <th>Harga Jual</th>
                      <th>Stok</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>

                    {products.length === 0 ? (

                      <tr>
                        <td
                          colSpan="9"
                          className="text-center text-secondary py-4"
                        >
                          Belum ada produk
                        </td>
                      </tr>

                    ) : (

                      products.map((product, index) => (

                        <tr key={product.id}>

                          <td>{index + 1}</td>

                          <td>
                            {product.code}
                          </td>

                          <td className="fw-semibold">
                            {product.name}
                          </td>

                          <td>
                            {product.category_name}
                          </td>

                          <td>
                            Rp{" "}
                            {Number(
                              product.purchase_price
                            ).toLocaleString("id-ID")}
                          </td>

                          <td>
                            Rp{" "}
                            {Number(
                              product.selling_price
                            ).toLocaleString("id-ID")}
                          </td>

                          <td>
                            {Math.floor(
                              Number(product.stock)
                            )}{" "}
                            {product.unit}
                          </td>

                          <td>
                            {Number(product.is_active) === 1 ? (
                              <span className="badge bg-success">
                                Aktif
                              </span>
                            ) : (
                              <span className="badge bg-secondary">
                                Nonaktif
                              </span>
                            )}
                          </td>

                          <td>

                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() =>
                                openEditModal(product)
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleDelete(product)
                              }
                            >
                              <i className="bi bi-trash"></i>
                            </button>

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      </div>

      {showModal && (

        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-lg">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">

                  {editingProduct
                    ? "Edit Produk"
                    : "Tambah Barang"}

                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>

              </div>

              <form onSubmit={handleSubmit}>

                <div className="modal-body">

                  <div className="row g-3">

                    <div className="col-md-6">

                      <label className="form-label">
                        Kode Barang
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-md-6">

                      <label className="form-label">
                        Nama Barang
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-md-6">

                      <label className="form-label">
                        Kategori
                      </label>

                      <select
                        className="form-select"
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Pilih Kategori
                        </option>

                        {categories.map((category) => (

                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>

                        ))}

                      </select>

                    </div>

                    <div className="col-md-6">

                      <label className="form-label">
                        Satuan
                      </label>

                      <input
                        type="numeric"
                        className="form-control"
                        name="unit"
                        value={form.unit}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="col-md-4">

                      <label className="form-label">
                        Harga Beli
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-control"
                        name="purchase_price"
                        value={
                          form.purchase_price === ""
                            ? ""
                            : Number(form.purchase_price).toLocaleString("id-ID", {
                              maximumFractionDigits: 0,
                            })
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");

                          setForm((prev) => ({
                            ...prev,
                            purchase_price: value,
                          }));
                        }}
                      />

                    </div>

                    <div className="col-md-4">

                      <label className="form-label">
                        Harga Jual
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-control"
                        name="selling_price"
                        value={
                          form.selling_price === ""
                            ? ""
                            : Number(form.selling_price).toLocaleString("id-ID", {
                              maximumFractionDigits: 0,
                            })
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");

                          setForm((prev) => ({
                            ...prev,
                            selling_price: value,
                          }));
                        }}
                      />

                    </div>

                    <div className="col-md-4">

                      <label className="form-label">
                        Stok
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-control"
                        name="stock"
                        value={
                          form.stock === ""
                            ? ""
                            : Number(form.stock).toLocaleString("id-ID", {
                              maximumFractionDigits: 0,
                            })
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");

                          setForm((prev) => ({
                            ...prev,
                            stock: value,
                          }));
                        }}
                      />

                    </div>

                    {editingProduct && (

                      <div className="col-md-12">

                        <label className="form-label">
                          Status
                        </label>

                        <select
                          className="form-select"
                          name="is_active"
                          value={form.is_active}
                          onChange={handleChange}
                        >

                          <option value={1}>
                            Aktif
                          </option>

                          <option value={0}>
                            Nonaktif
                          </option>

                        </select>

                      </div>

                    )}
                   

                    

                  </div>

                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Menyimpan..."
                      : "Simpan"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import DashboardChart from "../components/DashboardChart";
import api from "../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import ExportButton from "../components/ExportButton";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import EditUserModal from "../components/EditUserModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DashboardFinal() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const dataUserRef = useRef(null);
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };
    
    const [loading, setLoading] = useState(false);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [transactionSummary, setTransactionSummary] = useState({
        grandTotal: 0,
        totalHpp: 0,
        grossProfit: 0,
    });
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [newUser, setNewUser] = useState({
        name: "",
        kategori: "",
        email: "",
        password: "",
        role: "user",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");

            if (Array.isArray(res.data)) {
                setUsers(res.data);
            } else {
                setUsers(res.data.users || []);
            }
        } catch (err) {
            console.log(err);
            toast.error("Gagal mengambil data user");
        }
    };

        

    const fetchBestSellingProducts = async () => {
        console.log("🔥 FETCH BEST SELLING DIPANGGIL");

        try {
            const res = await api.get("/products/best-selling");

            console.log("🔥 BEST SELLING RESPONSE =", res.data);

            if (Array.isArray(res.data)) {
                setBestSellingProducts(res.data);
            } else {
                setBestSellingProducts([]);
            }
        } catch (err) {
            console.error("🔥 BEST SELLING ERROR =", err);
            console.error("🔥 STATUS =", err.response?.status);
            console.error("🔥 DATA =", err.response?.data);
            toast.error("Gagal mengambil data barang terlaris");
        }
    };
    

    const fetchTransactionSummary = async () => {
        try {
            const res = await api.get("/dashboard/summary");

            setTransactionSummary({
                grandTotal: Number(res.data.total_omzet || 0),
                totalHpp: Number(res.data.total_hpp || 0),
                grossProfit: Number(res.data.gross_profit || 0),
            });
        } catch (err) {
            console.error("TRANSACTION SUMMARY ERROR =", err);
            toast.error("Gagal mengambil ringkasan transaksi");
        }
    };

    const handleEdit = (user) => {
        setEditingUser({ ...user });
        setIsModalOpen(true);
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditingUser({
            ...editingUser,
            [name]: value,
        });
    };

    const handleUpdate = async () => {
        try {

            console.log("DATA EDIT USER =", editingUser);
            await api.put(`/users/${editingUser.id}`, editingUser);
            toast.success("User berhasil diperbarui");
            setIsModalOpen(false);
            setEditingUser(null);

            fetchUsers();
        } catch (err) {
           
                console.error(err);
                toast.error("Gagal mengubah user");
            
         } finally {
                setLoading(false);
            



        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus user?",
            text: "Data yang dihapus tidak dapat dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        setLoading(true);

        try {
            await api.delete(`/users/${id}`);

            toast.success("User berhasil dihapus");

            fetchUsers();
        } catch (err) {
            console.error(err);

            toast.error("Gagal menghapus user");
        } finally {
            setLoading(false);
        }
    };



            
        
    

useEffect(() => {
    fetchUsers();
    fetchBestSellingProducts();
    fetchTransactionSummary();
}, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewUser({
            ...newUser,
            [name]: value,
        });
    };
    
    const handleCreate = async () => {
        setLoading(true);
        if (
            !newUser.name.trim() ||
            !newUser.email.trim() ||
            !newUser.password.trim()
        ) {
            toast.error("Nama, email, dan password wajib diisi.");
            return;
        }

        setLoading(true);
        try {
            console.log(newUser);
            await api.post("/users", newUser);

            toast.success("User berhasil ditambahkan");

            setNewUser({
                name: "",
                kategori: "",
                email: "",
                password: "",
                role: "user",
            });

            fetchUsers();

        } catch (err) {

            console.error(err);

            toast.error("Gagal menambah user");

        } finally {

            setLoading(false);

        }
    };


    const handleExportExcel = () => {
        const data = sortedUsers.map((user, index) => ({
            No: index + 1,
            Nama: user.name,
            Email: user.email,
            Role: user.role,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Users"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob(
            [excelBuffer],
            {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            }
        );

        saveAs(
            file,
            `users_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
    };

    
    const filteredUsers = users.filter((user) => {
        const keyword = search.toLowerCase();

        const matchSearch =
            user.name?.toLowerCase().includes(keyword) ||
            user.email?.toLowerCase().includes(keyword) ||
            user.role?.toLowerCase().includes(keyword);

        const matchRole =
            roleFilter === "" || user.role === roleFilter;

        return matchSearch && matchRole;
    });

        



    const sortedUsers = [...filteredUsers].sort((a, b) => {
        let first = a[sortField];
        let second = b[sortField];

        if (typeof first === "string") {
            first = first.toLowerCase();
            second = second.toLowerCase();
        }

        if (first < second) return sortOrder === "asc" ? -1 : 1;
        if (first > second) return sortOrder === "asc" ? 1 : -1;

        return 0;
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const currentUsers = sortedUsers.slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    const totalPages = Math.ceil(
        sortedUsers.length / usersPerPage
    );
   

    
    console.log("users =", users);
    console.table(currentUsers);



    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                alignItems: "stretch",
            }}
        >
            <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                dataUserRef={dataUserRef}
            />

            <div
                style={{
                    flex: 1,
                    background: "#f4f6f9",
                }}
            >
                <Navbar toggleSidebar={toggleSidebar} />

                <div className="container-fluid p-4">

                    <div className="mb-4">
                        <h2 className="fw-bold text-dark">
                            <i className="bi bi-speedometer2 me-2"></i>
                            Dashboard
                        </h2>

                        <p className="text-muted mb-0">
                            User Management System
                        </p>
                    </div>



                    
                    
                                    
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">

                            <div className="row g-3 align-items-center">

                                <div className="col">
                                    <div className="input-group shadow-sm">

                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="bi bi-search"></i>
                                        </span>

                                        <input
                                            type="text"
                                            className="form-control border-start-0"
                                            placeholder="Cari nama, email, atau role..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />

                                    </div>
                                </div>

                                <div className="col-auto">
                                    <ExportButton
                                        handleExportExcel={handleExportExcel}
                                    />
                                </div>

                            </div>

                        </div>
                    </div>
                   
                    <div className="card border-0 shadow rounded-4 mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">
                           <i className="bi bi-person-plus-fill me-2"></i>
                               Tambah User
                            </h5>
                        </div>

                        <div className="card-body">
                            <UserForm
                                newUser={newUser}
                                handleInputChange={handleInputChange}
                                handleCreate={handleCreate}
                            />
                        </div>
                    </div>
                    <div style={{ border: "3px solid red" }}> </div>
<StatsCards
    users={users}
    adminCount={users.filter(u => u.role === "admin").length}
    userCount={users.filter(u => u.role === "user").length}
    staffCount={users.filter(u => u.role === "staff").length}
/>

<div className="row g-4 mb-4">

    <div className="col-12 col-md-4">
        <div className="card bg-primary text-white border-0 shadow h-100">
            <div className="card-body d-flex align-items-center justify-content-between p-4">
                <div>
                    <div className="fw-semibold">
                        Grand Total
                    </div>

                    <h3 className="fw-bold mt-2 mb-0">
                        Rp{" "}
                        {transactionSummary.grandTotal.toLocaleString("id-ID")}
                    </h3>
                </div>

                <i
                    className="bi bi-cash-stack"
                    style={{
                        fontSize: "3rem",
                        opacity: 0.25,
                    }}
                ></i>
            </div>
        </div>
    </div>

    <div className="col-12 col-md-4">
        <div className="card bg-dark text-white border-0 shadow h-100">
            <div className="card-body d-flex align-items-center justify-content-between p-4">
                <div>
                    <div className="fw-semibold">
                        HPP
                    </div>

                    <h3 className="fw-bold mt-2 mb-0">
                        Rp{" "}
                        {transactionSummary.totalHpp.toLocaleString("id-ID")}
                    </h3>
                </div>

                <i
                    className="bi bi-box-seam"
                    style={{
                        fontSize: "3rem",
                        opacity: 0.25,
                    }}
                ></i>
            </div>
        </div>
    </div>

    <div className="col-12 col-md-4">
        <div className="card bg-success text-white border-0 shadow h-100">
            <div className="card-body d-flex align-items-center justify-content-between p-4">
                <div>
                    <div className="fw-semibold">
                        Laba
                    </div>

                    <h3 className="fw-bold mt-2 mb-0">
                        Rp{" "}
                        {transactionSummary.grossProfit.toLocaleString("id-ID")}
                    </h3>
                </div>

                <i
                    className="bi bi-graph-up-arrow"
                    style={{
                        fontSize: "3rem",
                        opacity: 0.25,
                    }}
                ></i>
            </div>
        </div>
    </div>

</div>


                    <div className="card border-0 shadow rounded-4 mb-4 mt-4">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0 fw-bold">
                                <i className="bi bi-trophy-fill me-2"></i>
                                Barang Terlaris
                            </h5>
                        </div>

                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="text-center">No</th>
                                            <th>Produk</th>
                                            <th>Qty Terjual</th>
                                            <th>Omzet</th>
                                            <th>HPP</th>
                                            <th>Laba</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {bestSellingProducts.length > 0 ? (
                                            bestSellingProducts.map((product, index) => (
                                                <tr key={product.product_id}>
                                                    <td className="text-center fw-bold">
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <div className="fw-semibold">
                                                            {product.product_name}
                                                        </div>
                                                        <small className="text-muted">
                                                            {product.code}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {Number(product.total_quantity).toLocaleString(
                                                            "id-ID",
                                                            {
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 3,
                                                            }
                                                        )}{" "}
                                                        {product.unit}
                                                    </td>

                                                    <td>
                                                        Rp{" "}
                                                        {Number(product.total_sales).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>

                                                    <td>
                                                        Rp{" "}
                                                        {Number(product.total_hpp).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>

                                                    <td className="fw-bold text-success">
                                                        Rp{" "}
                                                        {Number(product.gross_profit).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="text-center text-muted py-4"
                                                >
                                                    Belum ada data penjualan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>



                    <DashboardChart
                        adminCount={users.filter(u => u.role === "admin").length}
                        userCount={users.filter(u => u.role === "user").length}
                        staffCount={users.filter(u => u.role === "staff").length}
                        onRoleClick={setRoleFilter}
                    />             
                    


                        <div
                        ref={dataUserRef}
                        id="data-user"
                        className="card shadow-sm border-0 rounded-4"
                        style={{ scrollMarginTop: "90px" }}
                    >
                    
                        <div className="card border-0 shadow rounded-4 mb-4">
    <h5 className="mb-0 fw-bold">
      Data User
    </h5>
  </div>

  <div className="card-body p-0">
                            {roleFilter && (
                                <div className="d-flex justify-content-between align-items-center px-3 pt-3">

                                    <div className="alert alert-info py-2 px-3 mb-0">
                                        Menampilkan role :
                                        <strong className="ms-2 text-uppercase">
                                            {roleFilter}
                                        </strong>
                                    </div>

                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => setRoleFilter("")}
                                    >
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Reset Filter
                                    </button>

                                </div>
                            )}

        <UserTable
            users={currentUsers}
            currentPage={currentPage}
            usersPerPage={usersPerPage}
            sortField={sortField}
            sortOrder={sortOrder}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />

    </div>
</div>
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">

                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                    >
                                        Previous
                                    </button>
                                </li>

                                {[...Array(totalPages)].map((_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                    >
                                        Next
                                    </button>
                                </li>

                            </ul>
                        </nav>
                    </div>


                </div>
            </div>



            
            {isModalOpen && editingUser && (
                <EditUserModal
                    user={editingUser}
                    handleChange={handleEditChange}
                    handleUpdate={handleUpdate}
                    closeModal={() => {
                        setIsModalOpen(false);
                        setEditingUser(null);
                    }}
                />
            )}


        </div>
    );
}

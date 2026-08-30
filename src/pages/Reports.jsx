import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
const formatRupiah = (value) => {

    return Number(value || 0).toLocaleString("id-ID");
};

const formatInputDate = (value) => {
    const digits = value
        .replace(/\D/g, "")
        .slice(0, 8);

    if (digits.length > 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }

    if (digits.length > 2) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return digits;
};

const convertIndonesiaToApiDate = (value) => {
    const parts = value.split("/");

    if (parts.length !== 3) {
        return "";
    }

    const [day, month, year] = parts;

    if (
        day.length !== 2 ||
        month.length !== 2 ||
        year.length !== 4
    ) {
        return "";
    }

    return `${year}-${month}-${day}`;
};

export default function Reports() {
    const [collapsed, setCollapsed] = useState(false);
    const [dateFromInput, setDateFromInput] = useState("");
    const [dateToInput, setDateToInput] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cashierId, setCashierId] = useState("");

    const [cashiers, setCashiers] = useState([]);
    const [report, setReport] = useState({
        summary: {
            total_transactions: 0,
            total_omzet: 0,
            total_hpp: 0,
            gross_profit: 0,
        },
        data: [],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCashiers = async () => {
        try {
            const res = await api.get("/users");

            const users = Array.isArray(res.data)
                ? res.data
                : res.data.users || [];

            setCashiers(users);
        } catch (err) {
            console.error("CASHIER ERROR =", err);
        }
    };

    const fetchReport = async () => {
        setLoading(true);
        setError("");

        try {
            const dateFrom = dateFromInput
                ? convertIndonesiaToApiDate(dateFromInput)
                : "";

            const dateTo = dateToInput
                ? convertIndonesiaToApiDate(dateToInput)
                : "";

            if ((dateFromInput || dateToInput) && (!dateFrom || !dateTo)) {
                setError(
                    "Tanggal Dari dan Tanggal Sampai harus diisi lengkap."
                );
                return;
            }

            const params = new URLSearchParams();

            if (dateFrom && dateTo) {
                if (dateFrom > dateTo) {
                    setError(
                        "Tanggal Dari tidak boleh lebih besar dari Tanggal Sampai."
                    );
                    return;
                }

                params.set("date_from", dateFrom);
                params.set("date_to", dateTo);
            }

            if (paymentMethod) {
                params.set("payment_method", paymentMethod);
            }

            if (cashierId) {
                params.set("cashier_id", cashierId);
            }

            const query = params.toString();

            const res = await api.get(
                `/reports/sales${query ? `?${query}` : ""}`
            );

            setReport({
                summary: res.data.summary || {},
                data: Array.isArray(res.data.data)
                    ? res.data.data
                    : [],
            });
        } catch (err) {
            console.error("SALES REPORT ERROR =", err);

            setError(
                err.response?.data?.message ||
                    "Gagal mengambil laporan penjualan."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCashiers();
        fetchReport();
    }, []);

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

            <div className="mb-4">
                <h3 className="fw-bold mb-1">
                    Laporan Penjualan
                </h3>
                <p className="text-muted mb-0">
                    Laporan transaksi, omzet, HPP, dan laba kotor
                </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-md-3">
                            <label className="form-label fw-semibold">
                                Tanggal Dari
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="DD/MM/YYYY"
                                value={dateFromInput}
                                onChange={(e) =>
                                    setDateFromInput(
                                        formatInputDate(
                                            e.target.value
                                        )
                                    )
                                }
                            />
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label fw-semibold">
                                Tanggal Sampai
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="DD/MM/YYYY"
                                value={dateToInput}
                                onChange={(e) =>
                                    setDateToInput(
                                        formatInputDate(
                                            e.target.value
                                        )
                                    )
                                }
                            />
                        </div>

                        <div className="col-12 col-md-2">
                            <label className="form-label fw-semibold">
                                Pembayaran
                            </label>

                            <select
                                className="form-select"
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Semua
                                </option>
                                <option value="cash">
                                    Cash
                                </option>
                                <option value="debit">
                                    Debit
                                </option>
                                <option value="qris">
                                    QRIS
                                </option>
                                <option value="transfer">
                                    Transfer
                                </option>
                            </select>
                        </div>

                        <div className="col-12 col-md-2">
                            <label className="form-label fw-semibold">
                                Kasir
                            </label>

                            <select
                                className="form-select"
                                value={cashierId}
                                onChange={(e) =>
                                    setCashierId(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Semua Kasir
                                </option>

                                {cashiers.map((cashier) => (
                                    <option
                                        key={cashier.id}
                                        value={cashier.id}
                                    >
                                        {cashier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-2 d-flex align-items-end">
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={fetchReport}
                                disabled={loading}
                            >
                                <i className="bi bi-search me-2"></i>
                                {loading
                                    ? "Memuat..."
                                    : "Tampilkan"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row g-4 mb-4">
                <div className="col-12 col-md-3">
                    <div className="card bg-primary text-white border-0 shadow rounded-4 h-100">
                        <div className="card-body">
                            <div className="fw-semibold">
                                Transaksi
                            </div>

                            <h3 className="fw-bold mt-2 mb-0">
                                {Number(
                                    report.summary?.total_transactions || 0
                                ).toLocaleString("id-ID")}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="card bg-success text-white border-0 shadow rounded-4 h-100">
                        <div className="card-body">
                            <div className="fw-semibold">
                                Omzet
                            </div>

                            <h3 className="fw-bold mt-2 mb-0">
                                Rp{" "}
                                {formatRupiah(
                                    report.summary?.total_omzet
                                )}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="card bg-dark text-white border-0 shadow rounded-4 h-100">
                        <div className="card-body">
                            <div className="fw-semibold">
                                HPP
                            </div>

                            <h3 className="fw-bold mt-2 mb-0">
                                Rp{" "}
                                {formatRupiah(
                                    report.summary?.total_hpp
                                )}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="card bg-warning border-0 shadow rounded-4 h-100">
                        <div className="card-body">
                            <div className="fw-semibold">
                                Laba Kotor
                            </div>

                            <h3 className="fw-bold mt-2 mb-0">
                                Rp{" "}
                                {formatRupiah(
                                    report.summary?.gross_profit
                                )}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow rounded-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0 fw-bold">
                        Detail Penjualan
                    </h5>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>No</th>
                                    <th>Tanggal</th>
                                    <th>Kode</th>
                                    <th>Kasir</th>
                                    <th>Metode</th>
                                    <th className="text-end">
                                        Omzet
                                    </th>
                                    <th className="text-end">
                                        HPP
                                    </th>
                                    <th className="text-end">
                                        Laba
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {report.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center text-muted py-4"
                                        >
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    report.data.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>

                                            <td>
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleString(
                                                    "id-ID",
                                                    {
                                                        timeZone:
                                                            "Asia/Jakarta",
                                                    }
                                                )}
                                            </td>

                                            <td>
                                                {item.transaction_code}
                                            </td>

                                            <td>
                                                {item.cashier_name}
                                            </td>

                                            <td>
                                                {item.payment_method}
                                            </td>

                                            <td className="text-end">
                                                Rp{" "}
                                                {formatRupiah(
                                                    item.grand_total
                                                )}
                                            </td>

                                            <td className="text-end">
                                                Rp{" "}
                                                {formatRupiah(
                                                    item.total_hpp
                                                )}
                                            </td>

                                            <td className="text-end fw-semibold">
                                                Rp{" "}
                                                {formatRupiah(
                                                    item.gross_profit
                                                )}
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
    </div>

    );
}

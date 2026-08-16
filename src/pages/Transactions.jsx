import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatRupiah = (value) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  // =========================
  // FORMAT TANGGAL / WAKTU
  // =========================
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

  // =========================
  // INPUT DD/MM/YYYY
  // =========================
  const normalizeDateInput = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  // =========================
  // DD/MM/YYYY -> YYYY-MM-DD
  // =========================
  const dateInputToISO = (value) => {
    if (!value || value.length !== 10) {
      return "";
    }

    const [dd, mm, yyyy] = value.split("/");

    return `${yyyy}-${mm}-${dd}`;
  };

  // =========================
  // DETAIL TRANSAKSI
  // =========================
  const handleDetail = async (id) => {
    console.log("DETAIL DIKLIK:", id);

    try {
      const res = await api.get(`/transactions/${id}`);

      console.log("DETAIL RESPONSE:", res.data);

      setSelectedTransaction(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("DETAIL ERROR:", err);
    }
  };

  // =========================
  // AMBIL TRANSAKSI
  // =========================
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");

        console.log("TRANSACTIONS =", res.data);

        setTransactions(
          Array.isArray(res.data) ? res.data : []
        );
      } catch (err) {
        console.error("Gagal mengambil transaksi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filteredTransactions = transactions.filter(
    (transaction) => {
      const keyword = search.toLowerCase().trim();

      const matchesSearch =
        !keyword ||
        transaction.transaction_code
          ?.toLowerCase()
          .includes(keyword) ||
        transaction.cashier_name
          ?.toLowerCase()
          .includes(keyword);

      const transactionDate = transaction.created_at
        ? new Date(transaction.created_at).toLocaleDateString(
          "en-CA",
          {
            timeZone: "Asia/Jakarta",
          }
        )
        : "";

      const dateFromISO = dateInputToISO(dateFrom);
      const dateToISO = dateInputToISO(dateTo);

      const matchesDateFrom =
        !dateFromISO ||
        transactionDate >= dateFromISO;

      const matchesDateTo =
        !dateToISO ||
        transactionDate <= dateToISO;

      return (
        matchesSearch &&
        matchesDateFrom &&
        matchesDateTo
      );
    }
  );

  // =========================
  // RINGKASAN TRANSAKSI
  // =========================
  const totalFilteredTransactions =
    filteredTransactions.length;

  const totalFilteredOmzet =
    filteredTransactions.reduce(
      (total, transaction) =>
        total + Number(transaction.grand_total || 0),
      0
    );

  const totalFilteredHPP =
    filteredTransactions.reduce(
      (total, transaction) =>
        total + Number(transaction.total_hpp || 0),
      0
    );

  const totalFilteredGrossProfit =
    filteredTransactions.reduce(
      (total, transaction) =>
        total + Number(transaction.gross_profit || 0),
      0
    );

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const safeTotalPages = Math.max(totalPages, 1);

  const indexOfLastTransaction =
    currentPage * transactionsPerPage;

  const indexOfFirstTransaction =
    indexOfLastTransaction - transactionsPerPage;

  const currentTransactions =
    filteredTransactions.slice(
      indexOfFirstTransaction,
      indexOfLastTransaction
    );

  // =========================
  // RESET PAGE JIKA FILTER
  // =========================
  useEffect(() => {
    if (currentPage > safeTotalPages) {
      setCurrentPage(safeTotalPages);
    }
  }, [currentPage, safeTotalPages]);

  // =========================
  // RENDER
  // =========================
  return (
    <div className="d-flex min-vh-100">


      <Sidebar />

      <div
        className="flex-grow-1"
        style={{
          minWidth: 0,
          overflowX: "auto"
        }}
      >
        <Navbar />

        <div
          className="container-fluid p-4"
          style={{
            backgroundColor: "#f4f6f9",
            minHeight: "calc(100vh - 56px)",
          }}
        >

          <div className="card shadow">

            <div className="card-header">
              <h4 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Riwayat Transaksi
              </h4>
            </div>

            <div className="card-body">

              {/* =========================
                  FILTER
              ========================= */}

              <div className="row g-2 mb-3">

                <div className="col-md-5">

                  <div className="input-group">

                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari kode transaksi atau kasir..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />

                  </div>

                </div>

                <div className="col-md-2">

                  <input
                    type="text"
                    className="form-control"
                    placeholder="DD/MM/YYYY"
                    value={dateFrom}
                    inputMode="numeric"
                    maxLength={10}
                    onChange={(e) => {
                      setDateFrom(
                        normalizeDateInput(e.target.value)
                      );
                      setCurrentPage(1);
                    }}
                  />

                </div>

                <div className="col-md-2">

                  <input
                    type="text"
                    className="form-control"
                    placeholder="DD/MM/YYYY"
                    value={dateTo}
                    inputMode="numeric"
                    maxLength={10}
                    onChange={(e) => {
                      setDateTo(
                        normalizeDateInput(e.target.value)
                      );
                      setCurrentPage(1);
                    }}
                  />

                </div>

                <div className="col-md-2">

                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setSearch("");
                      setDateFrom("");
                      setDateTo("");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="bi bi-arrow-counterclockwise me-1"></i>
                    Reset
                  </button>

                </div>

              </div>

              {/* =========================
                  TABLE
              ========================= */}

              {/* =========================
                       RINGKASAN
                    ========================= */}

              <div className="row g-3 mb-3">

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body d-flex align-items-center">

                      <div className="bg-primary text-white rounded p-3 me-3">
                        <i className="bi bi-receipt fs-4"></i>
                      </div>

                      <div>
                        <div className="text-secondary">
                          Jumlah Transaksi
                        </div>

                        <h4 className="mb-0 fw-bold">
                          {totalFilteredTransactions}
                        </h4>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body d-flex align-items-center">

                      <div className="bg-success text-white rounded p-3 me-3">
                        <i className="bi bi-cash-stack fs-4"></i>
                      </div>

                      <div>
                        <div className="text-secondary">
                          Total Omzet
                        </div>
                        <h4 className="mb-0 fw-bold text-success">
                          {formatRupiah(totalFilteredOmzet)}
                        </h4>
                      </div>

                    </div>
                  </div>
                </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center">

                    <div className="bg-dark text-white rounded p-3 me-3">
                      <i className="bi bi-box-seam fs-4"></i>
                    </div>

                    <div>
                      <div className="text-secondary">
                        Total HPP
                      </div>

                      <h4 className="mb-0 fw-bold">
                        {formatRupiah(totalFilteredHPP)}
                      </h4>
                    </div>

                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center">

                    <div className="bg-success text-white rounded p-3 me-3">
                      <i className="bi bi-graph-up-arrow fs-4"></i>
                    </div>

                    <div>
                      <div className="text-secondary">
                        Laba Kotor
                      </div>

                      <h4 className="mb-0 fw-bold text-success">
                        {formatRupiah(totalFilteredGrossProfit)}
                      </h4>
                    </div>

                  </div>
                </div>
              </div>

              </div>

              {loading ? (

                <p>Loading...</p>

              ) : filteredTransactions.length === 0 ? (

                <div className="text-center text-secondary py-5">

                  <i className="bi bi-receipt fs-1 d-block mb-3"></i>

                  Tidak ada transaksi sesuai filter.

                </div>

              ) : (

                <>

                  <div className="table-responsive">

                        <table
                          className="table table-striped table-hover table-bordered align-middle text-center shadow-sm mb-0"
                          style={{
                            minWidth: "1100px",
                            fontSize: "12px",
                          }}
                        >

                      <thead className="table-dark">

                        <tr>
                          <th width="60">No</th>
                          <th>Kode Transaksi</th>
                          <th>Kasir</th>
                          <th>Subtotal</th>
                          <th>Diskon</th>
                          <th>Grand Total</th>
                          <th>Total HPP</th>
                          <th>Laba Kotor</th>
                          <th>Bayar</th>
                          <th>Kembalian</th>
                          <th>Metode</th>
                          <th style={{ whiteSpace: "nowrap" }}>Waktu</th>
                              <th
                                style={{
                                  position: "sticky",
                                  right: 0,
                                  zIndex: 3,
                                  backgroundColor: "#212529",
                                  minWidth: "95px",
                                }}
                              >
                                Aksi
                              </th>
                        </tr>

                      </thead>

                      <tbody>

                        {currentTransactions.map(
                          (transaction, index) => (

                            <tr key={transaction.id}>

                              <td>
                                {indexOfFirstTransaction +
                                  index +
                                  1}
                              </td>

                              <td className="fw-semibold">
                                {transaction.transaction_code}
                              </td>

                              <td>
                                {transaction.cashier_name}
                              </td>

                              <td>
                                {formatRupiah(
                                  transaction.subtotal
                                )}
                              </td>

                              <td>
                                {formatRupiah(
                                  transaction.discount
                                )}
                              </td>

                              <td className="fw-bold text-primary">
                                {formatRupiah(
                                  transaction.grand_total
                                )}
                              </td>
                              <td className="text-dark fw-semibold">
                                {formatRupiah(transaction.total_hpp)}
                              </td>

                              <td className="text-success fw-bold">
                                {formatRupiah(transaction.gross_profit)}
                              </td>

                              <td>
                                {formatRupiah(
                                  transaction.paid_amount
                                )}
                              </td>

                              <td className="text-success fw-semibold">
                                {formatRupiah(
                                  transaction.change_amount
                                )}
                              </td>

                              <td style={{ whiteSpace: "nowrap" }}>
                                {formatDateTime(transaction.created_at)}
                              </td>

                              <td
                                style={{
                                  position: "sticky",
                                  right: 0,
                                  zIndex: 2,
                                  backgroundColor: "white",
                                  minWidth: "95px",
                                }}
                              >

                                <div className="d-flex gap-2 justify-content-center">

                                  {/* DETAIL */}
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                      handleDetail(
                                        transaction.id
                                      )
                                    }
                                    title="Detail"
                                  >
                                    <i className="bi bi-eye"></i>
                                  </button>

                                  {/* PRINT THERMAL */}
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                      window.open(
                                        `/receipt/${transaction.id}`,
                                        "_blank"
                                      )
                                    }
                                    title="Print Receipt"
                                  >
                                    <i className="bi bi-printer"></i>
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* PAGINATION */}

                  <div className="d-flex justify-content-between align-items-center mt-3">

                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage(
                          Math.max(1, currentPage - 1)
                        )
                      }
                    >
                      <i className="bi bi-chevron-left me-1"></i>
                      Prev
                    </button>

                    <span className="fw-semibold">
                      Halaman {currentPage} dari{" "}
                      {safeTotalPages}
                    </span>

                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={
                        currentPage === safeTotalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          Math.min(
                            safeTotalPages,
                            currentPage + 1
                          )
                        )
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

      {/* =========================
          MODAL DETAIL
      ========================= */}

      {showModal && selectedTransaction && (

        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-lg">

            <div className="modal-content">

              {/* HEADER */}

              <div className="modal-header">

                <h5 className="modal-title">
                  Detail Transaksi
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedTransaction(null);
                  }}
                ></button>

              </div>

              {/* BODY */}

              <div className="modal-body">

                <div className="row mb-3">

                  <div className="col-md-6">

                    <p className="mb-1">
                      <strong>Kode :</strong>{" "}
                      {
                        selectedTransaction.transaction
                          ?.transaction_code
                      }
                    </p>

                    <p className="mb-1">
                      <strong>Kasir :</strong>{" "}
                      {
                        selectedTransaction.transaction
                          ?.cashier_name
                      }
                    </p>

                    <p className="mb-1">
                      <strong>Tanggal :</strong>{" "}
                      {formatDateTime(
                        selectedTransaction.transaction
                          ?.created_at
                      )}
                    </p>

                    <p className="mb-1">
                      <strong>Metode Bayar :</strong>{" "}

                      <span className="badge bg-primary">
                        {(
                          selectedTransaction.transaction
                            ?.payment_method || ""
                        ).toUpperCase()}
                      </span>
                    </p>

                  </div>

                  <div className="col-md-6 text-end">

                    <p className="mb-1">
                      <strong>Subtotal :</strong>{" "}
                      {formatRupiah(
                        selectedTransaction.transaction
                          ?.subtotal
                      )}
                    </p>

                    <p className="mb-1">
                      <strong>Diskon :</strong>{" "}
                      {formatRupiah(
                        selectedTransaction.transaction
                          ?.discount
                      )}
                    </p>

                    <h4 className="text-primary">
                      Grand Total :{" "}
                      {formatRupiah(
                        selectedTransaction.transaction
                          ?.grand_total
                      )}
                    </h4>

                    <p className="mb-1">
                      <strong>Bayar :</strong>{" "}
                      {formatRupiah(
                        selectedTransaction.transaction
                          ?.paid_amount
                      )}
                    </p>

                    <h5 className="text-success">
                      Kembalian :{" "}
                      {formatRupiah(
                        selectedTransaction.transaction
                          ?.payment_method === "cash"
                          ? selectedTransaction.transaction
                            ?.change_amount
                          : 0
                      )}
                    </h5>

                  </div>

                </div>

                <hr />

                {/* ITEM */}

                <table className="table table-bordered table-striped">

                  <thead className="table-dark">

                    <tr>
                      <th>No</th>
                      <th>Produk</th>
                      <th>Qty</th>
                      <th>Satuan</th>
                      <th>Harga</th>
                      <th>Subtotal</th>
                    </tr>

                  </thead>

                  <tbody>

                    {selectedTransaction.items?.map(
                      (item, index) => (

                        <tr key={item.id}>

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {item.product_name}
                          </td>

                          <td>
                            {parseInt(
                              item.quantity,
                              10
                            )}
                          </td>

                          <td>
                            {item.unit}
                          </td>

                          <td>
                            {formatRupiah(
                              item.price
                            )}
                          </td>

                          <td>
                            {formatRupiah(
                              item.subtotal
                            )}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

                <div className="mt-3 text-end">

                  <div>
                    <strong>Total Item :</strong>{" "}
                    {selectedTransaction.items?.length || 0}
                  </div>

                  <div>
                    <strong>Total Qty :</strong>{" "}
                    {selectedTransaction.items?.reduce(
                      (total, item) =>
                        total +
                        Number(item.quantity || 0),
                      0
                    )}
                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() =>
                    window.open(
                      `/receipt/${selectedTransaction.transaction.id}`,
                      "_blank"
                    )
                  }
                >
                  <i className="bi bi-printer me-2"></i>
                  Print
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedTransaction(null);
                  }}
                >
                  Tutup
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
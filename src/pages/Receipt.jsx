import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./Receipt.css";
import { useEffect, useState } from "react";

export default function Receipt() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const autoPrint = searchParams.get("autoprint") === "1";

  const [transaction, setTransaction] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchReceipt();
  }, []);

  useEffect(() => {
    if (!transaction || !autoPrint) return;

    const timer = setTimeout(() => {
      window.print();
    }, 5000);

    return () => clearTimeout(timer);
  }, [transaction, autoPrint]);

  const fetchReceipt = async () => {
    try {
      const res = await api.get(`/transactions/${id}`);

      setTransaction(res.data.transaction);
      setItems(res.data.items);

    } catch (err) {
      console.error(err);
    }
  };


  if (!transaction) {
    return (
      <div className="container mt-5">
        Loading...
      </div>
    );
  }

  return (
    <div className="receipt-wrapper">
      <div className="receipt">
        <div style={{ textAlign: "center" }}>
          
          <div className="receipt-title">
            TOKO IMAM
          </div>

          <div className="receipt-subtitle">
            User Management POS
          </div>

          </div>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>Kode</td>
              <td>: {transaction.transaction_code}</td>
            </tr>

            <tr>
              <td>Kasir</td>
              <td>: {transaction.cashier_name}</td>
            </tr>

            <tr>
              <td>Tanggal</td>
              <td>
                :{" "}
                {new Date(transaction.created_at).toLocaleString("id-ID")}
              </td>
            </tr>

            <tr>
              <td>Metode</td>
              <td>: {transaction.payment_method.toUpperCase()}</td>
            </tr>
          </tbody>
        </table>

        <div className="line"></div>

        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th align="left">Produk</th>
              <th>Qty</th>
              <th align="right">Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>

                <td align="center">
                  {Number(item.quantity)}
                </td>

                <td align="right">
                  {Number(item.subtotal).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="line"></div>

        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td align="right">
                Rp{" "}
                {Number(transaction.subtotal).toLocaleString("id-ID")}
              </td>
            </tr>

            <tr>
              <td>Diskon</td>
              <td align="right">
                Rp{" "}
                {Number(transaction.discount).toLocaleString("id-ID")}
              </td>
            </tr>

            <tr>
              <td>
                <strong>Grand Total</strong>
              </td>

              <td align="right">
                <strong>
                  Rp{" "}
                  {Number(transaction.grand_total).toLocaleString("id-ID")}
                </strong>
              </td>
            </tr>

            <tr>
              <td>Bayar</td>
              <td align="right">
                Rp{" "}
                {Number(transaction.paid_amount).toLocaleString("id-ID")}
              </td>
            </tr>

            <tr>
              <td>Kembali</td>
              <td align="right">
                Rp{" "}
                {Number(transaction.change_amount).toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="line"></div>

        <div style={{ textAlign: "center" }}>
          Terima kasih
          <br />
          Barang yang sudah dibeli
          <br />
          tidak dapat dikembalikan
        </div>

        <button
          className="btn btn-dark print-btn"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
    </div>
  );
}

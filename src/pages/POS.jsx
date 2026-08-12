import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function POS() {
  const [collapsed, setCollapsed] = useState(false);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [searchProduct, setSearchProduct] = useState("");

  // ==================== GET PRODUCTS ====================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");

      const activeProducts = res.data.filter(
        (product) =>
          product.is_active === 1 &&
          Number(product.stock) > 0
      );

      setProducts(activeProducts);
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
    }
  };

  // ==================== SEARCH PRODUK ====================

  const filteredProducts = products.filter((product) => {
    const keyword = searchProduct.toLowerCase().trim();

    if (!keyword) {
      return true;
    }

    return (
      product.name?.toLowerCase().includes(keyword) ||
      product.code?.toLowerCase().includes(keyword)
    );
  });

  // ==================== CART ====================


  // ==================== CART ====================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        if (existing.quantity >= Number(product.stock)) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal:
                  (item.quantity + 1) *
                  Number(item.selling_price),
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
          subtotal: Number(product.selling_price),
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== productId) {
            return item;
          }

          const maxStock = Number(item.stock);
          const newQuantity = Math.min(
            Math.max(Number(quantity), 1),
            maxStock
          );

          return {
            ...item,
            quantity: newQuantity,
            subtotal:
              newQuantity * Number(item.selling_price),
          };
        })
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  // ==================== TOTAL ====================

  const subtotal = cart.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const discountAmount = Math.max(
    Number(discount) || 0,
    0
  );

  const grandTotal = Math.max(
    subtotal - discountAmount,
    0
  );

  const paid =
  paymentMethod === "cash"
    ? Number(String(paidAmount).replace(/\./g, "")) || 0
    : grandTotal;

  const change =
    paymentMethod === "cash" && paid >= grandTotal
      ? paid - grandTotal
      : 0;
  // ==================== PAYMENT ====================

  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }

    if (paid < grandTotal) {
      alert("Pembayaran kurang");
      return;
    }

    try {
      const payload = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        discount: discountAmount,
        paid_amount: paid,
        payment_method: paymentMethod,
      };

      const res = await api.post(
        "/transactions",
        payload
      );

      const receiptUrl = `/receipt/${res.data.transactionId}`;

      setCart([]);
      setDiscount(0);
      setPaidAmount("");
      setPaymentMethod("cash");

      await fetchProducts();

      window.open(
        receiptUrl,
        "_blank",
        "width=420,height=800"
      );

      

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Transaksi gagal"
      );
    }
  };

  return (
    <div className="d-flex min-vh-100">

      <Sidebar
        collapsed={collapsed}
      />

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

          <h3 className="fw-bold mb-4">
            <i className="bi bi-cart-check me-2"></i>
            Kasir / POS
          </h3>

          <div className="row g-4">

            {/* PRODUK */}

            <div className="col-lg-7">

              <div className="card shadow-sm">

                <div className="card-header fw-bold">
                  Daftar Produk
                </div>

                <div className="card-body">

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari produk atau kode..."
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                    />
                  </div>

                  <div className="row g-3">
                    
                    {filteredProducts.map((product) => {
                            const cartItem = cart.find(
                              (item) => item.id === product.id
                            );

                            const cartQuantity = cartItem?.quantity || 0;

                            const availableStock = Math.max(
                              Number(product.stock) - cartQuantity,
                              0
                            );

                            return (
                              <div
                                className="col-md-6 col-xl-4"
                                key={product.id}
                              >
                                <div className="card h-100 border">

                                  <div className="card-body">

                                    <small className="text-secondary">
                                      {product.code}
                                    </small>

                                    <h6 className="fw-bold mt-1">
                                      {product.name}
                                    </h6>

                                    <div className="text-primary fw-bold">
                                      Rp{" "}
                                      {Number(
                                        product.selling_price
                                      ).toLocaleString("id-ID")}
                                    </div>

                                    <small className="text-secondary">
                                      Stok: {availableStock} {product.unit}
                                    </small>

                                    <button
                                      className="btn btn-dark btn-sm w-100 mt-3"
                                      disabled={availableStock <= 0}
                                      onClick={() =>
                                        addToCart(product)
                                      }
                                    >
                                      <i className="bi bi-cart-plus me-1"></i>
                                      {availableStock > 0
                                        ? "Tambah"
                                        : "Stok Habis"}
                                    </button>

                                  </div>

                                </div>
                              </div>
                            );
                          })}
                    

                      

                        

                   

                  </div>

                </div>

              </div>

            </div>

            {/* KERANJANG */}

            <div className="col-lg-5">

              <div className="card shadow-sm">

                <div className="card-header fw-bold">
                  <i className="bi bi-basket me-2"></i>
                  Keranjang
                </div>

                <div className="card-body">

                  {cart.length === 0 ? (

                    <div className="text-center text-secondary py-4">
                      Keranjang masih kosong
                    </div>

                  ) : (

                    cart.map((item) => (

                      <div
                        key={item.id}
                        className="border-bottom pb-3 mb-3"
                      >

                        <div className="d-flex justify-content-between">

                          <div>
                            <strong>
                              {item.name}
                            </strong>

                            <div className="small text-secondary">
                              Rp{" "}
                              {Number(
                                item.selling_price
                              ).toLocaleString("id-ID")}
                            </div>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                        </div>

                       <div className="d-flex align-items-center mt-2">

                          <div className="input-group" style={{ maxWidth: "150px" }}>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>

                            <input
                              type="text"
                              inputMode="numeric"
                              className="form-control text-center"
                              value={item.quantity}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "");

                                if (digits === "") {
                                  return;
                                }

                                updateQuantity(item.id, Number(digits));
                              }}
                            />

                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= Number(item.stock)}
                            >
                             +
                            </button>
                          </div>



                          <span className="ms-auto fw-bold">
                            Rp{" "}
                            {Number(
                              item.subtotal
                            ).toLocaleString("id-ID")}
                          </span>

                        </div>

                      </div>

                    ))

                  )}

                  <hr />

                  <div className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <strong>
                      Rp{" "}
                      {subtotal.toLocaleString("id-ID")}
                    </strong>
                  </div>

                  <div className="mt-3">

                    <label className="form-label">
                      Diskon
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control"
                      value={
                        discount === "" || discount === 0
                          ? ""
                          : Number(discount).toLocaleString("id-ID")
                      }
                      placeholder="Masukkan diskon"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");

                        if (digits === "") {
                          setDiscount("");
                          return;
                        }

                        setDiscount(Number(digits));
                      }}
                    />

                  </div>

                  <div className="d-flex justify-content-between mt-3 fs-5">
                    <strong>Grand Total</strong>

                    <strong className="text-primary">
                      Rp{" "}
                      {grandTotal.toLocaleString("id-ID")}
                    </strong>
                  </div>

                  <div className="mt-3">

                    <label className="form-label">
                      Bayar
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control form-control-lg"
                      value={paidAmount}
                      placeholder="Masukkan jumlah pembayaran"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");

                        if (digits === "") {
                          setPaidAmount("");
                          return;
                        }

                        setPaidAmount(
                          Number(digits).toLocaleString("id-ID")
                        );
                      }}
                    />

                  </div>
                  <div className="mt-3">
                    <label className="form-label">
                      Metode Pembayaran
                    </label>

                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                    >
                      <option value="cash">Cash</option>
                      <option value="debit">Debit</option>
                      <option value="qris">QRIS</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <span>Kembalian</span>

                    <strong className="text-success">
                      Rp{" "}
                      {change.toLocaleString("id-ID")}
                    </strong>
                  </div>

                  <button
                    className="btn btn-success btn-lg w-100 mt-4"
                    disabled={
                      cart.length === 0 ||
                      paid < grandTotal
                    }
                    onClick={handlePayment}
                  >
                    <i className="bi bi-cash-coin me-2"></i>
                    BAYAR
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

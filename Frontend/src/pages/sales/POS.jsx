import { useEffect, useState, useRef } from "react";
import DashboardLayout from
"../../components/layouts/DashboardLayout";
import { getProducts } from "../../services/productService";
import { createSale } from "../../services/salesService";
import toast from "react-hot-toast";
const POS = () => {
const [products, setProducts] = useState([]);
const [cart, setCart] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 4;
const invoiceRef = useRef();
// FETCH PRODUCTS
const fetchProducts = async () => {
try {
const data = await getProducts();
setProducts(data);
} catch (error) {
console.log(error);
}
};
useEffect(() => {
fetchProducts();
}, []);
// ADD TO CART
const addToCart = (product) => {
const existing = cart.find((item) => item._id ===
product._id);
if (existing) {
const updatedCart = cart.map((item) =>
item._id === product._id ? { ...item, qty: item.qty +
1 } : item
);
setCart(updatedCart);
} else {
setCart([...cart, { ...product, qty: 1 }]);
}
toast.success("Added To Cart");
};
// INCREASE QTY
const increaseQty = (id) => {
const updatedCart = cart.map((item) =>
item._id === id ? { ...item, qty: item.qty + 1 } : item
);
setCart(updatedCart);
};
// DECREASE QTY
const decreaseQty = (id) => {
const updatedCart = cart
.map((item) => (item._id === id ? { ...item, qty:
item.qty - 1 } : item))
.filter((item) => item.qty > 0);
setCart(updatedCart);
};
// REMOVE ITEM
const removeItem = (id) => {
const updatedCart = cart.filter((item) => item._id !== id);
setCart(updatedCart);
toast.success("Removed");
};
// TOTALS
const subtotal = cart.reduce((acc, item) => acc +
item.sellingPrice * item.qty, 0);
const tax = subtotal * 0.05;
const total = subtotal + tax;
// CHECKOUT
const handleCheckout = async () => {
try {
const saleData = {
items: cart.map((item) => ({
productId: item._id,
quantity: item.qty,
price: item.sellingPrice,
})),
paymentMethod: "Cash",
paymentStatus: "Paid",
discount: 0,
tax: tax,
userId: JSON.parse(localStorage.getItem("user"))?._id,
};
await createSale(saleData);
toast.success("Sale Completed");
setCart([]);
fetchProducts();
} catch (error) {
console.log(error);
toast.error(error.response?.data?.message || "Checkout Failed");
}
};
// CLEAR CART
const clearCart = () => {
setCart([]);
toast.success("Cart Cleared");
};
// PRINT
const printInvoice = () => {
if (cart.length === 0) {
toast.error("Add items to cart before printing");
return;
}
window.print();
};
const lastIndex = currentPage * productsPerPage;
const firstIndex = lastIndex - productsPerPage;
const currentProducts = products.slice(firstIndex,
lastIndex);
const totalPages = Math.ceil(products.length /
productsPerPage);
return (
<DashboardLayout>
{/* Outer Wrapper Layout Split */}
<div
style={{
display: "grid",
gridTemplateColumns: "2.2fr 1.1fr",
gap: "32px",
width: "100%",
textAlign: "left",
boxSizing: "border-box"
}}
>
{/* LEFT COLUMN: PRODUCTS CATALOGUE - hidden during print, only the invoice prints */}
<div className="no-print" style={{ display: "flex", flexDirection: "column",
gap: "24px" }}>
{/* PRODUCT CARDS GRID */}
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
gap: "20px",
width: "100%"
}}
>
{currentProducts.map((product) => {
const isLowStock = product.stock <= 3;
return (
<div
key={product._id}
onClick={() => addToCart(product)}
style={{
backgroundColor: "rgba(30, 41, 59, 0.3)",
backdropFilter: "blur(10px)",
padding: "16px",
borderRadius: "20px",
cursor: "pointer",
border: "1px solid rgba(255, 255, 255, 0.05)",
boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
transition: "transform 0.2s ease, border-color 0.2s ease",
boxSizing: "border-box",
position: "relative",
overflow: "hidden"
}}
className="btn-scale-hover"
>
<img
src={product.image ||
"https://via.placeholder.com/300"}
alt=""
style={{ width: "100%", height: "140px",
objectFit: "cover", borderRadius: "14px", marginBottom: "14px",
backgroundColor: "#0f172a" }}
/>
<h2 style={{ fontSize: "15px", fontWeight:
600, color: "#ffffff", margin: "0 0 4px 0", overflow: "hidden",
textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
{product.name}
</h2>
<div style={{ display: "flex",
justifyContent: "space-between", alignItems: "center",
marginTop: "12px" }}>
<span style={{ fontSize: "16px",
fontWeight: 700, color: "#34d399" }}>
Rs
{product.sellingPrice?.toLocaleString()}
</span>
<span
style={{
fontSize: "11px",
fontWeight: 600,
color: isLowStock ? "#f87171" :
"#94a3b8",
backgroundColor: isLowStock ?
"rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.04)",
padding: "3px 8px",
borderRadius: "8px"
}}
>
Stock: {product.stock}
</span>
</div>
</div>
);
})}
</div>
{/* PAGINATION PANEL CONTROLS INSIDE THE LEFT FLOW
*/}
<div style={{ display: "flex", justifyContent:
"center", alignItems: "center", gap: "14px", marginTop:
"16px" }}>
<button
disabled={currentPage === 1}
onClick={() => setCurrentPage(currentPage - 1)}
style={{
padding: "8px 18px",
borderRadius: "10px",
fontWeight: 600,
fontSize: "13px",
border: "1px solid rgba(255,255,255,0.05)",
cursor: "pointer",
backgroundColor: "rgba(30, 41, 59, 0.4)",
color: currentPage === 1 ?
"rgba(255,255,255,0.2)" : "#ffffff",
opacity: currentPage === 1 ? 0.4 : 1
}}
>
Prev
</button>
<span style={{ textTransform: "uppercase",
fontSize: "12px", color: "#94a3b8", fontWeight: 600,
letterSpacing: "0.05em" }}>
Page {currentPage} of {totalPages || 1}
</span>
<button
disabled={currentPage === totalPages ||
totalPages === 0}
onClick={() => setCurrentPage(currentPage + 1)}
style={{
padding: "8px 18px",
borderRadius: "10px",
fontWeight: 600,
fontSize: "13px",
border: "1px solid rgba(255,255,255,0.05)",
cursor: "pointer",
backgroundColor: "rgba(30, 41, 59, 0.4)",
color: currentPage === totalPages ?
"rgba(255,255,255,0.2)" : "#ffffff",
opacity: currentPage === totalPages ? 0.4 : 1
}}
>
Next
</button>
</div>
</div>
{/* RIGHT COLUMN: INVOICE CART PANEL */}
<div
ref={invoiceRef}
id="invoice-print-area"
style={{
backgroundColor: "rgba(30, 41, 59, 0.4)",
backdropFilter: "blur(12px)",
borderRadius: "24px",
padding: "24px",
border: "1px solid rgba(255, 255, 255, 0.06)",
boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
height: "fit-content",
position: "sticky",
top: "24px",
boxSizing: "border-box",
display: "flex",
flexDirection: "column"
}}
>
<div style={{ display: "flex", justifyContent:
"space-between", alignItems: "center", marginBottom:
"20px" }}>
<h2 style={{ fontSize: "18px", fontWeight: 700,
color: "#ffffff", margin: 0, letterSpacing: "-0.01em" }}>
Live Invoice
</h2>
<span style={{ fontSize: "12px", color: "#64748b",
fontWeight: 500 }}>
{cart.reduce((total, item) => total + item.qty,
0)} Items Added
</span>
</div>
{/* ITEM SCROLL CONTAINER */}
<div style={{ display: "flex", flexDirection:
"column", gap: "12px", maxHeight: "380px", overflowY: "auto",
paddingRight: "4px" }}>
{cart.length === 0 ? (
<div style={{ textAlign: "center", padding:
"40px 0", color: "#64748b", fontSize: "14px", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: "16px" }}>
Cart is currently empty.
</div>
) : (
cart.map((item) => (
<div
key={item._id}
style={{
backgroundColor: "#0f172a",
padding: "14px",
borderRadius: "16px",
border: "1px solid rgba(255, 255, 255, 0.03)",
display: "flex",
flexDirection: "column",
gap: "12px"
}}
>
<div style={{ display: "flex",
justifyContent: "space-between", alignItems: "start", gap:
"12px" }}>
<div style={{ overflow: "hidden", flex:
1 }}>
<h3 style={{ fontSize: "14px",
fontWeight: 600, color: "#ffffff", margin: 0, overflow:
"hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
{item.name}
</h3>
<p style={{ fontSize: "13px", color:
"#34d399", margin: "4px 0 0 0", fontWeight: 500 }}>
Rs
{item.sellingPrice?.toLocaleString()}
</p>
</div>
<button
onClick={() => removeItem(item._id)}
style={{
backgroundColor: "rgba(239, 68, 68, 0.1)",
color: "#f87171",
border: "none",
width: "28px",
height: "28px",
borderRadius: "8px",
fontWeight: "bold",
cursor: "pointer",
fontSize: "11px",
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
✕
</button>
</div>
{/* COUNTER TOGGLE CONTAINER */}
<div style={{ display: "flex", alignItems:
"center", gap: "12px" }}>
<button
onClick={() => decreaseQty(item._id)}
style={{
backgroundColor:
"rgba(255,255,255,0.05)",
color: "#ffffff",
width: "28px",
height: "28px",
borderRadius: "50%",
border: "none",
fontSize: "16px",
cursor: "pointer",
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
-
</button>
<span style={{ color: "#ffffff",
fontWeight: 700, fontSize: "14px", minWidth: "20px", textAlign:
"center" }}>
{item.qty}
</span>
<button
onClick={() => increaseQty(item._id)}
style={{
backgroundColor:
"rgba(255,255,255,0.05)",
color: "#ffffff",
width: "28px",
height: "28px",
borderRadius: "50%",
border: "none",
fontSize: "16px",
cursor: "pointer",
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
+
</button>
</div>
</div>
))
)}
</div>
{/* TOTALS & SUMMARY BAR */}
<div style={{ marginTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px" }}>
<div style={{ display: "flex", justifyContent:
"space-between", color: "#94a3b8", marginBottom: "8px",
fontSize: "14px" }}>
<span>Subtotal</span>
<span style={{ color: "#ffffff", fontWeight:
500 }}>Rs {subtotal.toLocaleString(undefined,
{ minimumFractionDigits: 2 })}</span>
</div>
<div style={{ display: "flex", justifyContent:
"space-between", color: "#94a3b8", marginBottom: "14px",
fontSize: "14px" }}>
<span>Tax (5%)</span>
<span style={{ color: "#ffffff", fontWeight:
500 }}>Rs {tax.toLocaleString(undefined,
{ minimumFractionDigits: 2 })}</span>
</div>
<div style={{ display: "flex", justifyContent:
"space-between", fontSize: "18px", fontWeight: 700, color:
"#ffffff", padding: "12px 0", borderTop: "1px dashed rgba(255,255,255,0.06)" }}>
<span>Total Amount</span>
<span style={{ color: "#34d399" }}>Rs
{total.toLocaleString(undefined, { minimumFractionDigits:
2 })}</span>
</div>
{/* ACTION TRIGGERS BUTTONS */}
<div className="no-print" style={{ display: "flex", flexDirection:
"column", gap: "10px", marginTop: "16px" }}>
<button
disabled={cart.length === 0}
onClick={handleCheckout}
style={{
width: "100%",
backgroundColor: cart.length === 0 ?
"rgba(255,255,255,0.05)" : "#ffffff",
color: cart.length === 0 ? "#64748b" :
"#0f172a",
padding: "14px",
borderRadius: "14px",
fontWeight: 600,
fontSize: "14px",
border: "none",
cursor: cart.length === 0 ? "not-allowed" :
"pointer",
transition: "transform 0.2s"
}}
>
Complete Checkout
⚡
</button>
<div style={{ display: "flex", gap: "10px" }}>
<button
disabled={cart.length === 0}
onClick={printInvoice}
style={{
flex: 1,
backgroundColor: "rgba(234, 179, 8, 0.1)",
color: "#facc15",
border: "1px solid rgba(234, 179, 8, 0.2)",
padding: "10px",
borderRadius: "12px",
fontWeight: 600,
fontSize: "13px",
cursor: cart.length === 0 ? "not-allowed" :
"pointer"
}}
>
Print Receipt
</button>
<button
disabled={cart.length === 0}
onClick={clearCart}
style={{
flex: 1,
backgroundColor: "rgba(239, 68, 68, 0.1)",
color: "#f87171",
border: "1px solid rgba(239, 68, 68, 0.2)",
padding: "10px",
borderRadius: "12px",
fontWeight: 600,
fontSize: "13px",
cursor: cart.length === 0 ? "not-allowed" :
"pointer"
}}
>
Clear Cart
</button>
</div>
</div>
</div>
</div>
</div>
</DashboardLayout>
);
};
export default POS;
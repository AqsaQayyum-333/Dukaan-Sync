import { useEffect, useState } from "react";
import { User } from "lucide-react";
import DashboardLayout from
"../../components/layouts/DashboardLayout";
import { createPurchase, getPurchases } from
"../../services/purchaseService";
import { getProducts } from "../../services/productService";
import { getSuppliers } from "../../services/supplierService";
import toast from "react-hot-toast";
const Purchases = () => {
const [purchases, setPurchases] = useState([]);
const [products, setProducts] = useState([]);
const [suppliers, setSuppliers] = useState([]);
const [formData, setFormData] = useState({
supplierId: "",
productId: "",
quantity: "",
costPrice: "",
});
const user = JSON.parse(localStorage.getItem("user"));
const role = user?.role;
const fetchPurchases = async () => {
try {
const data = await getPurchases();
setPurchases(data);
} catch (error) {
console.log(error);
}
};
const fetchProducts = async () => {
try {
const data = await getProducts();
setProducts(data);
} catch (error) {
console.log(error);
}
};
const fetchSuppliers = async () => {
try {
const data = await getSuppliers();
setSuppliers(data);
} catch (error) {
console.log(error);
}
};
useEffect(() => {
fetchPurchases();
fetchProducts();
fetchSuppliers();
}, []);
const handleChange = (e) => {
const { name, value } = e.target;
if (name === "productId") {
const selectedProduct = products.find((p) => p._id ===
value);
setFormData({
...formData,
productId: value,
costPrice: selectedProduct?.costPrice || "",
});
return;
}
setFormData({
...formData,
[name]: value,
});
};
const total = Number(formData.quantity || 0) *
Number(formData.costPrice || 0);
const handleSubmit = async (e) => {
e.preventDefault();
if (!formData.supplierId || !formData.productId
|| !formData.quantity) {
toast.error("Fill all fields");
return;
}
try {
await createPurchase({
supplierId: formData.supplierId,
items: [
{
productId: formData.productId,
quantity: Number(formData.quantity),
costPrice: Number(formData.costPrice),
},
],
});
toast.success("Purchase Added");
setFormData({
supplierId: "",
productId: "",
quantity: "",
costPrice: "",
});
fetchPurchases();
} catch (error) {
toast.error("Failed");
}
};
return (
<DashboardLayout>
<div style={{ display: "flex", flexDirection: "column",
gap: "28px", textAlign: "left" }}>
{/* ADMIN/OWNER ACTION FORM */}
{(role === "ADMIN" || role === "OWNER") && (
<div
style={{
backgroundColor: "rgba(30, 41, 59, 0.3)",
backdropFilter: "blur(12px)",
padding: "24px",
borderRadius: "20px",
border: "1px solid rgba(255, 255, 255, 0.05)",
boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
}}
>
<h3 style={{ fontSize: "16px", fontWeight: 600,
color: "#ffffff", margin: "0 0 16px 0" }}>
Log New Bulk Purchase
</h3>
<form
onSubmit={handleSubmit}
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
gap: "16px",
alignItems: "end"
}}
>
{/* Supplier Select */}
<div style={{ display: "flex", flexDirection:
"column", gap: "6px" }}>
<label style={{ fontSize: "12px", color:
"#94a3b8", fontWeight: 500 }}>Supplier</label>
<select
name="supplierId"
value={formData.supplierId}
onChange={handleChange}
style={{
padding: "12px",
borderRadius: "12px",
backgroundColor: "#0f172a",
border: "1px solid rgba(255, 255, 255, 0.08)",
color: "#ffffff",
fontSize: "14px",
outline: "none"
}}
>
<option value="">Select Supplier</option>
{suppliers.map((supplier) => (
<option key={supplier._id}
value={supplier._id}>
{supplier.name}
</option>
))}
</select>
</div>
{/* Product Select */}
<div style={{ display: "flex", flexDirection:
"column", gap: "6px" }}>
<label style={{ fontSize: "12px", color:
"#94a3b8", fontWeight: 500 }}>Product</label>
<select
name="productId"
value={formData.productId}
onChange={handleChange}
style={{
padding: "12px",
borderRadius: "12px",
backgroundColor: "#0f172a",
border: "1px solid rgba(255, 255, 255, 0.08)",
color: "#ffffff",
fontSize: "14px",
outline: "none"
}}
>
<option value="">Select Product</option>
{products.map((product) => (
<option key={product._id}
value={product._id}>
{product.name}
</option>
))}
</select>
</div>
{/* Quantity Input */}
<div style={{ display: "flex", flexDirection:
"column", gap: "6px" }}>
<label style={{ fontSize: "12px", color:
"#94a3b8", fontWeight: 500 }}>Quantity</label>
<input
type="number"
name="quantity"
placeholder="0"
value={formData.quantity}
onChange={handleChange}
style={{
padding: "12px",
borderRadius: "12px",
backgroundColor: "#0f172a",
border: "1px solid rgba(255, 255, 255, 0.08)",
color: "#ffffff",
fontSize: "14px",
outline: "none"
}}
/>
</div>
{/* Cost Price */}
<div style={{ display: "flex", flexDirection:
"column", gap: "6px" }}>
<label style={{ fontSize: "12px", color:
"#94a3b8", fontWeight: 500 }}>Price Per Product (Auto)</label>
<input
type="text"
name="costPrice"
placeholder="Rs 0.00"
value={formData.costPrice ? `Rs
${Number(formData.costPrice).toLocaleString()}` : ""}
readOnly
style={{
padding: "12px",
borderRadius: "12px",
backgroundColor: "rgba(255,255,255,0.02)",
border: "1px solid rgba(255, 255, 255, 0.04)",
color: "#94a3b8",
fontSize: "14px",
outline: "none"
}}
/>
</div>
{/* Total Calculation Output */}
<div style={{ display: "flex", flexDirection:
"column", gap: "6px" }}>
<label style={{ fontSize: "12px", color:
"#64748b", fontWeight: 500 }}>Net Total</label>
<div
style={{
padding: "12px",
borderRadius: "12px",
backgroundColor: "rgba(52, 211, 153, 0.05)",
border: "1px dashed rgba(52, 211, 153, 0.2)",
color: "#34d399",
fontSize: "14px",
fontWeight: 700,
textAlign: "center"
}}
>
Rs {total.toLocaleString()}
</div>
</div>
{/* Submit Button */}
<button
type="submit"
style={{
padding: "13px",
borderRadius: "12px",
backgroundColor: "#ffffff",
color: "#0f172a",
fontWeight: 600,
fontSize: "14px",
border: "none",
cursor: "pointer",
boxShadow: "0 4px 10px rgba(255,255,255,0.1)"
}}
>
Add Stock
</button>
</form>
</div>
)}
{/* PURCHASES HISTORY LOG TABLE */}
<div
style={{
backgroundColor: "rgba(30, 41, 59, 0.2)",
backdropFilter: "blur(10px)",
borderRadius: "24px",
border: "1px solid rgba(255, 255, 255, 0.05)",
boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
overflow: "hidden"
}}
>
<div style={{ padding: "20px 24px", borderBottom:
"1px solid rgba(255, 255, 255, 0.05)" }}>
<h3 style={{ fontSize: "16px", fontWeight: 600,
color: "#ffffff", margin: 0 }}>
Procurement Logs History
</h3>
</div>
<div style={{ overflowX: "auto" }}>
<table style={{ width: "100%", borderCollapse:
"collapse", fontSize: "14px" }}>
<thead>
<tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", backgroundColor:
"rgba(255,255,255,0.01)" }}>
<th style={{ padding: "16px 24px", color:
"#94a3b8", fontWeight: 600, textAlign: "left" }}>Supplier
details</th>
<th style={{ padding: "16px 24px", color:
"#94a3b8", fontWeight: 600, textAlign: "left" }}>Total
Investment</th>
<th style={{ padding: "16px 24px", color:
"#94a3b8", fontWeight: 600, textAlign: "left" }}>Authorized
By</th>
<th style={{ padding: "16px 24px", color:
"#94a3b8", fontWeight: 600, textAlign: "left" }}>Purchase
Date</th>
</tr>
</thead>
<tbody>
{purchases.length === 0 ? (
<tr>
<td colSpan="4" style={{ padding: "40px",
textTransform: "uppercase", fontSize: "12px", color: "#64748b",
fontWeight: 600, letterSpacing: "0.05em", textAlign:
"center" }}>
No transactions recorded yet
</td>
</tr>
) : (
purchases.map((purchase) => (
<tr
key={purchase._id}
style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)", color: "#e2e8f0" }}
>
<td style={{ padding: "16px 24px",
fontWeight: 500, color: "#ffffff" }}>
{purchase.supplierId?.name || "N/A"}
</td>
<td style={{ padding: "16px 24px",
fontWeight: 600, color: "#34d399" }}>
Rs
{purchase.totalAmount?.toLocaleString(undefined,
{ minimumFractionDigits: 2 })}
</td>
<td style={{ padding: "16px 24px", color:
"#cbd5e1" }}>
<span style={{ backgroundColor:
"rgba(255,255,255,0.05)", padding: "4px 10px 4px 8px", borderRadius:
"8px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
<User size={12} style={{ flexShrink: 0, opacity: 0.8 }} />
{purchase.userId?.name ||
"System"}
</span>
</td>
<td style={{ padding: "16px 24px", color:
"#94a3b8" }}>
{new
Date(purchase.createdAt).toLocaleDateString(undefined, {
year: "numeric",
month: "short",
day: "numeric"
})}
</td>
</tr>
))
)}
</tbody>
</table>
</div>
</div>
</div>
</DashboardLayout>
);
};
export default Purchases;
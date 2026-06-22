import { useEffect, useState } from "react";
import DashboardLayout from
"../../components/layouts/DashboardLayout";
import { getCategories } from "../../services/categoryService";
import {
getProducts,
createProduct,
deleteProduct,
updateProduct,
} from "../../services/productService";
import toast from "react-hot-toast";
const Products = () => {
const currentUser = JSON.parse(localStorage.getItem("user") || "null");
const role = currentUser?.role;
const canManage = role === "ADMIN" || role === "OWNER";
const canDelete = role === "OWNER";
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [editingProduct, setEditingProduct] = useState(null);
const [previewImage, setPreviewImage] = useState("");
const [search, setSearch] = useState("");
// PAGINATION
const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 5;
const [formData, setFormData] = useState({
name: "",
sku: "",
costPrice: "",
sellingPrice: "",
lowStockThreshold: "",
image: "",
categoryId: "",
});
// FETCH PRODUCTS
const fetchProducts = async () => {
try {
const data = await getProducts();
setProducts(data);
} catch (error) {
console.log(error);
}
};
// FETCH CATEGORIES
const fetchCategories = async () => {
try {
const data = await getCategories();
setCategories(data);
} catch (error) {
console.log(error);
}
};
useEffect(() => {
fetchProducts();
fetchCategories();
}, []);
// HANDLE INPUT
const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
if (e.target.name === "image") {
setPreviewImage(e.target.value);
}
};
// ADD PRODUCT
const handleSubmit = async (e) => {
e.preventDefault();
try {
await createProduct(formData);
toast.success("Product Added Successfully");
fetchProducts();
setFormData({
name: "",
sku: "",
costPrice: "",
sellingPrice: "",
lowStockThreshold: "",
image: "",
categoryId: "",
});
setPreviewImage("");
} catch (error) {
toast.error("Failed to Add Product");
}
};
// DELETE PRODUCT
const handleDelete = async (id) => {
try {
await deleteProduct(id);
toast.success("Product Deleted");
fetchProducts();
} catch (error) {
toast.error("Delete Failed");
}
};
// EDIT PRODUCT
const handleEdit = (product) => {
setEditingProduct(product);
setFormData({
name: product.name,
sku: product.sku,
costPrice: product.costPrice,
sellingPrice: product.sellingPrice,
lowStockThreshold: product.lowStockThreshold,
image: product.image,
categoryId: product.categoryId?._id || "",
});
setPreviewImage(product.image);
};
// UPDATE PRODUCT
const handleUpdate = async () => {
try {
await updateProduct(editingProduct._id, formData);
toast.success("Product Updated");
setEditingProduct(null);
fetchProducts();
setFormData({
name: "",
sku: "",
costPrice: "",
sellingPrice: "",
lowStockThreshold: "",
image: "",
categoryId: "",
});
setPreviewImage("");
} catch (error) {
toast.error("Update Failed");
}
};
// SEARCH FILTER
const filteredProducts = products.filter((p) =>
p.name.toLowerCase().includes(search.toLowerCase())
);
// PAGINATION LOGIC
const lastIndex = currentPage * productsPerPage;
const firstIndex = lastIndex - productsPerPage;
const currentProducts = filteredProducts.slice(firstIndex,
lastIndex);
const totalPages = Math.ceil(filteredProducts.length /
productsPerPage);
return (
<DashboardLayout>
<div style={{ display: "flex", flexDirection: "column",
gap: "32px", width: "100%", textAlign: "left" }}>
{/* TOP BAR - search only, page title now lives in the shared layout header */}
<div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "16px" }}>
<input
type="text"
placeholder="  Search Product..."
value={search}
onChange={(e) => setSearch(e.target.value)}
style={{
backgroundColor: "rgba(30, 41, 59, 0.4)",
color: "#ffffff",
padding: "12px 20px",
borderRadius: "14px",
border: "1px solid rgba(255, 255, 255, 0.08)",
outline: "none",
fontSize: "14px",
width: "280px",
boxSizing: "border-box"
}}
/>
</div>
{/* PRODUCT FORM - ADMIN/OWNER ONLY */}
{canManage && (
<form
onSubmit={handleSubmit}
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: "20px",
backgroundColor: "rgba(30, 41, 59, 0.25)",
backdropFilter: "blur(10px)",
padding: "28px",
borderRadius: "20px",
border: "1px solid rgba(255, 255, 255, 0.05)",
boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
boxSizing: "border-box",
width: "100%"
}}
>
{[
{ label: "Product Name", name: "name", type:
"text", val: formData.name },
{ label: "SKU Identifier", name: "sku", type:
"text", val: formData.sku },
{ label: "Cost Price (Rs)", name: "costPrice",
type: "number", val: formData.costPrice },
{ label: "Selling Price (Rs)", name:
"sellingPrice", type: "number", val: formData.sellingPrice },
{ label: "Low Stock Threshold", name:
"lowStockThreshold", type: "number", val:
formData.lowStockThreshold },
{ label: "Image URL", name: "image", type: "text",
val: formData.image }
].map((field) => (
<input
key={field.name}
type={field.type}
name={field.name}
placeholder={field.label}
value={field.val}
onChange={handleChange}
style={{
padding: "14px 16px",
borderRadius: "12px",
backgroundColor: "#0f172a",
border: "1px solid rgba(255,255,255,0.06)",
color: "#ffffff",
fontSize: "14px",
outline: "none",
width: "100%",
boxSizing: "border-box"
}}
/>
))}
{/* CATEGORY SELECT */}
<select
name="categoryId"
value={formData.categoryId}
onChange={handleChange}
style={{
padding: "14px 16px",
borderRadius: "12px",
backgroundColor: "#0f172a",
border: "1px solid rgba(255,255,255,0.06)",
color: formData.categoryId ? "#ffffff" :
"#64748b",
fontSize: "14px",
outline: "none",
width: "100%",
boxSizing: "border-box",
cursor: "pointer"
}}
>
<option value="" style={{ color:
"#64748b" }}>Select Category</option>
{categories.map((cat) => (
<option key={cat._id} value={cat._id}
style={{ color: "#ffffff", backgroundColor: "#0f172a" }}>
{cat.name}
</option>
))}
</select>
{/* IMAGE PREVIEW BOX */}
{previewImage && (
<div style={{ gridColumn: "1 / -1", display:
"flex", justifyContent: "center", marginTop: "8px" }}>
<img
src={previewImage}
alt=""
style={{
width: "90px",
height: "90px",
borderRadius: "16px",
objectFit: "cover",
border: "2px solid rgba(255,255,255,0.2)",
boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
}}
/>
</div>
)}
{/* FORM ACTIONS BUTTONS - own full-width row below all fields, with clear top spacing */}
<div style={{ gridColumn: "1 / -1", display: "flex", gap: "14px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
<button
type="submit"
style={{
backgroundColor: "#ffffff",
color: "#0f172a",
padding: "13px 28px",
borderRadius: "12px",
fontWeight: 600,
fontSize: "14px",
border: "none",
cursor: "pointer",
boxShadow: "0 4px 6px -1px rgba(255,255,255,0.1)"
}}
className="btn-scale-hover"
>
Add Product
</button>
{editingProduct && (
<button
type="button"
onClick={handleUpdate}
style={{
backgroundColor: "#eab308",
color: "#0f172a",
padding: "13px 28px",
borderRadius: "12px",
fontWeight: 600,
fontSize: "14px",
border: "none",
cursor: "pointer"
}}
className="btn-scale-hover"
>
Update Product
</button>
)}
</div>
</form>
)}
{/* PRODUCTS TABLE CONTAINER */}
<div
className="fixed-cols-table"
style={{
backgroundColor: "rgba(30, 41, 59, 0.4)",
backdropFilter: "blur(12px)",
borderRadius: "20px",
border: "1px solid rgba(255, 255, 255, 0.06)",
boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
width: "100%",
boxSizing: "border-box",
overflow: "hidden"
}}
>
<table style={{ width: "100%", borderCollapse:
"collapse", color: "#f1f5f9", fontSize: "13px", tableLayout: "fixed" }}>
<colgroup>
<col style={{ width: "8%" }} />
<col style={{ width: "20%" }} />
<col style={{ width: "12%" }} />
<col style={{ width: "14%" }} />
<col style={{ width: "10%" }} />
<col style={{ width: "10%" }} />
<col style={{ width: "13%" }} />
<col style={{ width: "13%" }} />
</colgroup>
<thead>
<tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "left" }}>
<th style={{ padding: "16px 12px", color:
"#94a3b8", fontWeight: 600 }}>Image</th>
<th style={{ padding: "16px 12px", color:
"#94a3b8", fontWeight: 600 }}>Name</th>
<th style={{ padding: "16px 12px", color:
"#94a3b8", fontWeight: 600 }}>SKU</th>
<th style={{ padding: "16px 12px", color:
"#94a3b8", fontWeight: 600 }}>Category</th>
<th style={{ padding: "16px 12px", color:
"#94a3b8", fontWeight: 600 }}>Cost</th>
<th style={{ padding: "16px 12px", color:
"#94a3b8", fontWeight: 600 }}>Sale</th>
<th style={{ padding: "16px 12px", color:
"#94a3b8", fontWeight: 600, textAlign: "center" }}>Stock
status</th>
<th style={{ padding: "16px 12px", color:
"#94a3b8", fontWeight: 600, textAlign: "right" }}>Actions</th>
</tr>
</thead>
<tbody>
{currentProducts.map((product) => {
const isLowStock = product.stock <=
product.lowStockThreshold;
return (
<tr
key={product._id}
style={{
borderBottom: "1px solid rgba(255,255,255,0.04)",
backgroundColor: isLowStock ? "rgba(239, 68, 68, 0.04)" : "transparent",
transition: "background-color 0.2s ease"
}}
>
<td style={{ padding: "14px 10px" }}>
<img
src={product.image || "https://via.placeholder.com/150"}
alt=""
style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", backgroundColor: "#0f172a" }}
/>
</td>
<td style={{ padding: "14px 10px",
fontWeight: 500, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</td>
<td style={{ padding: "14px 10px",
fontFamily: "monospace", color:
"#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.sku}</td>
<td style={{ padding: "14px 10px", color:
"#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.categoryId?.name ||
"Uncategorized"}</td>
<td style={{ padding: "14px 10px",
fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Rs
{product.costPrice?.toLocaleString()}</td>
<td style={{ padding: "14px 10px",
fontWeight: 500, color: "#34d399", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Rs
{product.sellingPrice?.toLocaleString()}</td>
{/* UPDATED STOCK STATUS CARD BOX (UPAR
QTY, NEECHE LABEL) */}
<td style={{ padding: "14px 10px",
textAlign: "center" }}>
<div
style={{
display: "inline-flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
minWidth: "78px",
padding: "10px 8px",
borderRadius: "12px",
backgroundColor: isLowStock ?
"rgba(239, 68, 68, 0.08)" : "rgba(52, 211, 153, 0.08)",
border: isLowStock ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(52, 211, 153, 0.2)",
}}
>
<span
style={{
fontSize: "16px",
fontWeight: "700",
color: isLowStock ? "#f87171" :
"#34d399",
lineHeight: "1.2"
}}
>
{product.stock}
</span>
<span
style={{
fontSize: "11px",
fontWeight: "600",
color: isLowStock ? "rgba(248, 113, 113, 0.8)" : "rgba(52, 211, 153, 0.8)",
textTransform: "uppercase",
letterSpacing: "0.03em",
marginTop: "5px"
}}
>
{isLowStock ? "Low Stock" : "In Stock"}
</span>
</div>
</td>
<td style={{ padding: "14px 8px",
textAlign: "right" }}>
<div style={{ display: "flex", gap:
"6px", justifyContent: "flex-end" }}>
{canManage && (
<button
onClick={() => handleEdit(product)}
style={{
backgroundColor: "rgba(234, 179, 8, 0.1)",
color: "#facc15",
border: "1px solid rgba(234, 179, 8, 0.2)",
padding: "6px 10px",
borderRadius: "8px",
fontSize: "12px",
fontWeight: 500,
cursor: "pointer",
whiteSpace: "nowrap"
}}
>
Edit
</button>
)}
{canDelete && (
<button
onClick={() =>
handleDelete(product._id)}
style={{
backgroundColor: "rgba(239, 68, 68, 0.1)",
color: "#f87171",
border: "1px solid rgba(239, 68, 68, 0.2)",
padding: "6px 10px",
borderRadius: "8px",
fontSize: "12px",
fontWeight: 500,
cursor: "pointer",
whiteSpace: "nowrap"
}}
>
Delete
</button>
)}
{!canManage && !canDelete && (
<span style={{ fontSize: "12px", color: "#475569" }}>—</span>
)}
</div>
</td>
</tr>
);
})}
</tbody>
</table>
</div>
{/* PAGINATION PANEL */}
<div style={{ display: "flex", justifyContent:
"center", gap: "8px", marginTop: "8px" }}>
{[...Array(totalPages)].map((_, index) => (
<button
key={index}
onClick={() => setCurrentPage(index + 1)}
style={{
padding: "8px 16px",
borderRadius: "10px",
fontWeight: 600,
fontSize: "13px",
border: "1px solid rgba(255,255,255,0.05)",
cursor: "pointer",
backgroundColor: currentPage === index + 1 ?
"#ffffff" : "rgba(30, 41, 59, 0.4)",
color: currentPage === index + 1 ? "#0f172a" :
"#94a3b8"
}}
>
{index + 1}
</button>
))}
</div>
</div>
</DashboardLayout>
);
};
export default Products;
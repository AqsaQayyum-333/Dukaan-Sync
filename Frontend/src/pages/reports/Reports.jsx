import { useEffect, useState } from "react";
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
PieChart,
Pie,
Cell,
} from "recharts";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { getProducts } from "../../services/productService";
import { getSales } from "../../services/salesService";
import { getBestSellingProducts } from "../../services/reportsService";
 
const COLORS = ["#22D3EE", "#334155"];
 
const Reports = () => {
const [products, setProducts] = useState([]);
const [sales, setSales] = useState([]);
const [bestProducts, setBestProducts] = useState([]);
 
const fetchData = async () => {
try {
const productsData = await getProducts();
const salesData = await getSales();
const bestData = await getBestSellingProducts();
setProducts(productsData || []);
setSales(salesData || []);
setBestProducts(bestData || []);
} catch (error) {
console.log(error);
}
};
 
useEffect(() => {
fetchData();
}, []);
 
const totalRevenue = sales.reduce((acc, item) => acc + (item.totalAmount || 0), 0);
const totalSales = sales.length;
 
const pieData = [
{ name: "Sales Logged", value: sales.length || 0 },
{ name: "Total Products", value: products.length || 0 },
];
 
const weeklySalesData = sales.slice(0, 7).map((sale, index) => ({
day: `Sale ${index + 1}`,
sales: sale.totalAmount || 0,
}));
 
const lowStockProducts = products.filter(
(product) => (product.stock || 0) <= (product.lowStockThreshold || 0)
);
 
const totalProfit = bestProducts.reduce((acc, item) => {
const product = products.find((p) => p._id === item._id);
if (!product) return acc;
return acc + ((product.sellingPrice || 0) - (product.costPrice || 0)) * (item.totalSold || 0);
}, 0);
 
const bestSellingChartData = bestProducts.slice(0, 5).map((item) => ({
name: item.name?.length > 10 ? `${item.name.slice(0, 10)}...` : item.name,
sold: item.totalSold || 0,
}));
 
const lowStockChartData = lowStockProducts.slice(0, 5).map((item) => ({
name: item.name?.length > 10 ? `${item.name.slice(0, 10)}...` : item.name,
stock: item.stock || 0,
}));
 
const cardStyle = {
backgroundColor: "rgba(30, 41, 59, 0.35)",
backdropFilter: "blur(12px)",
border: "1px solid rgba(255, 255, 255, 0.06)",
borderRadius: "20px",
padding: "32px",
boxSizing: "border-box",
width: "100%",
};
 
const sectionTitleStyle = {
fontSize: "16px",
fontWeight: 700,
letterSpacing: "0.01em",
margin: "0 0 28px 0",
};
 
const rowStyle = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "20px",
backgroundColor: "rgba(15, 23, 42, 0.5)",
border: "1px solid rgba(255, 255, 255, 0.03)",
borderRadius: "14px",
padding: "20px 28px",
};
 
return (
<DashboardLayout>
<div style={{ display: "flex", flexDirection: "column", gap: "28px", textAlign: "left", paddingBottom: "40px" }}>
 
<div className="no-print" style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
<button
onClick={() => window.print()}
style={{
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: "10px",
padding: "14px 32px",
borderRadius: "12px",
backgroundColor: "rgba(34, 211, 238, 0.1)",
color: "#22d3ee",
fontWeight: 700,
fontSize: "14px",
border: "1px solid rgba(34, 211, 238, 0.3)",
cursor: "pointer",
boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
minWidth: "170px"
}}
>
<span>Export PDF</span>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>
</button>
</div>
 
{/* PRINTABLE REPORT AREA */}
<div id="reports-print-area" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
 
{/* METRICS GRID - same proportions as the Dashboard stat cards */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="reports-stats-grid">
<div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "14px" }}>
<h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>Total Revenue</h2>
<p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#34d399", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
Rs {totalRevenue.toLocaleString()}
</p>
</div>
<div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "14px" }}>
<h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>Total Sales Order</h2>
<p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#22d3ee", margin: 0 }}>
{totalSales}
</p>
</div>
<div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "14px" }}>
<h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>Low Stock Alerts</h2>
<p style={{ fontSize: "1.5rem", fontWeight: 700, color: lowStockProducts.length > 0 ? "#f87171" : "#94a3b8", margin: 0 }}>
{lowStockProducts.length}
</p>
</div>
<div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "14px" }}>
<h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>Net Profit Estimation</h2>
<p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fbbf24", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
Rs {totalProfit.toLocaleString()}
</p>
</div>
</div>
 
{/* CHARTS - weekly revenue + catalogue mix */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="reports-2col-grid">
<div style={cardStyle}>
<h2 style={{ ...sectionTitleStyle, color: "#e2e8f0" }}>Weekly Revenue Velocity</h2>
<div style={{ width: "100%", height: "260px", paddingLeft: "8px", paddingRight: "16px" }}>
<ResponsiveContainer width="100%" height="100%">
<BarChart data={weeklySalesData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
<XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
<YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
<Tooltip cursor={{ fill: 'rgba(255,255,255,0.01)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
<Bar dataKey="sales" fill="#22D3EE" radius={[4, 4, 0, 0]} barSize={24} />
</BarChart>
</ResponsiveContainer>
</div>
</div>
<div style={cardStyle}>
<h2 style={{ ...sectionTitleStyle, color: "#e2e8f0" }}>Catalogue Mix Overview</h2>
<div style={{ width: "100%", height: "260px", paddingLeft: "16px", paddingRight: "16px" }}>
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={92} paddingAngle={4} label={{ fill: '#94a3b8', fontSize: 11, offsetRadius: 15 }}>
{pieData.map((_, index) => (
<Cell key={index} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
))}
</Pie>
<Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
</PieChart>
</ResponsiveContainer>
</div>
</div>
</div>
 
{/* BEST SELLING PRODUCTS - chart + table inside ONE clearly bordered card */}
<div style={cardStyle}>
<h2 style={{ ...sectionTitleStyle, color: "#22d3ee" }}>Best Selling Products</h2>
{bestSellingChartData.length > 0 && (
<div style={{ width: "100%", height: "170px", paddingLeft: "8px", paddingRight: "16px", marginBottom: "26px" }}>
<ResponsiveContainer width="100%" height="100%">
<BarChart data={bestSellingChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
<XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
<YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={34} />
<Tooltip cursor={{ fill: 'rgba(255,255,255,0.01)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
<Bar dataKey="sold" fill="#22D3EE" radius={[4, 4, 0, 0]} barSize={28} />
</BarChart>
</ResponsiveContainer>
</div>
)}
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
{bestProducts.length > 0 ? (
bestProducts.map((item) => (
<div key={item._id} style={rowStyle}>
<p style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
<span style={{ color: "#22d3ee", fontWeight: 700, fontSize: "12px", backgroundColor: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.15)", borderRadius: "10px", padding: "9px 16px", whiteSpace: "nowrap" }}>Sold: {item.totalSold}</span>
</div>
))
) : (
<p style={{ color: "#64748b", fontSize: "14px", margin: 0, padding: "8px 4px" }}>No dynamic sales found</p>
)}
</div>
</div>
 
{/* CRITICAL STOCK ALERTS - chart + table inside ONE clearly bordered card */}
<div style={cardStyle}>
<h2 style={{ ...sectionTitleStyle, color: "#f87171" }}>Critical Stock Alerts</h2>
{lowStockChartData.length > 0 && (
<div style={{ width: "100%", height: "170px", paddingLeft: "8px", paddingRight: "16px", marginBottom: "26px" }}>
<ResponsiveContainer width="100%" height="100%">
<BarChart data={lowStockChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
<XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
<YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={34} />
<Tooltip cursor={{ fill: 'rgba(255,255,255,0.01)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
<Bar dataKey="stock" fill="#f87171" radius={[4, 4, 0, 0]} barSize={28} />
</BarChart>
</ResponsiveContainer>
</div>
)}
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
{lowStockProducts.length > 0 ? (
lowStockProducts.map((item) => (
<div key={item._id} style={rowStyle}>
<p style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
<span style={{ color: "#f87171", fontWeight: 600, fontSize: "12px", backgroundColor: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "10px", padding: "9px 16px", whiteSpace: "nowrap" }}>Restock Req</span>
</div>
))
) : (
<p style={{ color: "#34d399", fontSize: "14px", fontWeight: 500, margin: 0, padding: "8px 4px" }}>✓ Healthy Warehouse Inventory</p>
)}
</div>
</div>
 
{/* RECENT SALES TRANSACTIONS */}
<div style={cardStyle}>
<h2 style={{ ...sectionTitleStyle, color: "#e2e8f0" }}>Recent Activity Transactions</h2>
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
{sales.length > 0 ? (
sales.slice(0, 5).map((sale) => (
<div key={sale._id} style={rowStyle}>
<p style={{ color: "#94a3b8", fontSize: "15px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
Reference Tag: <span style={{ color: "#f1f5f9", fontFamily: "monospace", fontWeight: 600, marginLeft: "8px" }}>#{sale._id.slice(-6).toUpperCase()}</span>
</p>
<span style={{ color: "#34d399", fontWeight: 700, fontSize: "14px", whiteSpace: "nowrap" }}>
Rs {sale.totalAmount?.toLocaleString()}
</span>
</div>
))
) : (
<p style={{ color: "#64748b", fontSize: "14px", margin: 0, padding: "8px 4px" }}>No orders completed</p>
)}
</div>
</div>
 
</div>
{/* END PRINTABLE REPORT AREA */}
</div>
</DashboardLayout>
);
};
 
export default Reports;
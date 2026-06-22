import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import SalesChart from "../../components/dashboard/SalesChart";
import { getProducts } from "../../services/productService";
import { getSales } from "../../services/salesService";
import { getPurchases } from "../../services/purchaseService";
 
const Dashboard = () => {
const [totalProducts, setTotalProducts] = useState(0);
const [totalSales, setTotalSales] = useState(0);
const [totalPurchases, setTotalPurchases] = useState(0);
const [lowStock, setLowStock] = useState(0);
const fetchDashboardData = async () => {
try {
const products = await getProducts();
const sales = await getSales();
const purchases = await getPurchases();
setTotalProducts(products.length || 0);
setTotalSales(sales.reduce((a, s) => a + (s.totalAmount || 0), 0));
setTotalPurchases(purchases.reduce((a, p) => a + (p.totalAmount || 0), 0));
setLowStock(products.filter((p) => (p.stock || 0) <= (p.lowStockThreshold || 5)).length);
} catch (error) {
console.log("Error loading dashboard data:", error);
}
};
useEffect(() => {
fetchDashboardData();
}, []);
return (
<DashboardLayout>
<div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%", textAlign: "left" }}>
{/* METRICS CARDS GRID - fixed 4 equal columns so all boxes sit on one row */}
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
gap: "20px",
width: "100%"
}}
className="dashboard-stats-grid"
>
<StatCard title="Products" value={totalProducts} />
<StatCard title="Sales" value={`Rs ${totalSales.toLocaleString()}`} />
<StatCard title="Purchases" value={`Rs ${totalPurchases.toLocaleString()}`} />
<StatCard title="Low Stock" value={lowStock} />
</div>
{/* CHART SECTION */}
<div style={{ width: "100%", marginTop: "4px", display: "block" }}>
<SalesChart />
</div>
</div>
</DashboardLayout>
);
};
export default Dashboard;
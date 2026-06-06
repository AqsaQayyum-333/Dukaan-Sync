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
      {/* Container wrapper with controlled layout structure */}
      <div style={{ display: "flex", flexDirection: "column", gap: "36px", width: "100%", textAlign: "left" }}>
        
        {/* HEADER SECTION - Beautiful title grouping */}
        <div style={{ display: "block", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em", margin: 0, paddingBottom: "4px" }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#94a3b8", fontWeight: 400, margin: 0, letterSpacing: "0.01em" }}>
            Inventory & POS Control Center
          </p>
        </div>

        {/* METRICS CARDS GRID - Clean layout with a strong 24px column gap */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
            gap: "24px", 
            width: "100%" 
          }}
        >
          <StatCard title="Products" value={totalProducts} />
          <StatCard title="Sales" value={`Rs ${totalSales.toLocaleString()}`} />
          <StatCard title="Purchases" value={`Rs ${totalPurchases.toLocaleString()}`} />
          <StatCard title="Low Stock" value={lowStock} />
        </div>

        {/* CHART SECTION - Kept safe with explicit top margin spacing */}
        <div style={{ width: "100%", marginTop: "12px", display: "block" }}>
          <SalesChart />
        </div>

      </div>
    </DashboardLayout>
  );
};
export default Dashboard;
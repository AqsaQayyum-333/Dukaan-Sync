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

const COLORS = ["#22D3EE", "rgba(255, 255, 255, 0.06)"];

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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 text-left pb-10 px-4">
        
        {/* HEADER & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-normal">
              Reports & Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time core performance metrics, sales analysis and inventory tracks
            </p>
          </div>
          
          {/* Enhanced Sized Glassmorphic Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold text-sm border border-cyan-500/30 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.03] min-w-[160px]"
          >
            <span>Export PDF</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>

        {/* ANALYTICS HIGHLIGHT METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-2">Total Revenue</h2>
            <p className="text-2xl md:text-3xl font-bold text-emerald-400">
              Rs {totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-2">Total Sales Order</h2>
            <p className="text-2xl md:text-3xl font-bold text-cyan-400">
              {totalSales}
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-2">Low Stock Alerts</h2>
            <p className={`text-2xl md:text-3xl font-bold ${lowStockProducts.length > 0 ? "text-red-400" : "text-slate-400"}`}>
              {lowStockProducts.length}
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-2">Net Profit Estimation</h2>
            <p className="text-2xl md:text-3xl font-bold text-amber-400">
              Rs {totalProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* CHARTS CONTAINER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* BAR CHART */}
          <div className="bg-slate-900/20 backdrop-blur-lg p-6 rounded-2xl border border-white/5">
            <h2 className="text-base font-bold text-slate-200 mb-5 tracking-wide px-2">Weekly Revenue Velocity</h2>
            <div className="w-full h-[260px] pr-4 pl-2">
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

          {/* PIE CHART */}
          <div className="bg-slate-900/20 backdrop-blur-lg p-6 rounded-2xl border border-white/5">
            <h2 className="text-base font-bold text-slate-200 mb-5 tracking-wide px-2">Catalogue Mix Overview</h2>
            <div className="w-full h-[260px] px-4">
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

        {/* BOTTOM METRIC LISTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Best Selling Products */}
          <div className="bg-slate-900/20 p-6 rounded-2xl border border-white/5">
            <h2 className="text-base font-bold text-cyan-400 mb-4 tracking-wide px-1">Best Selling Products</h2>
            <div className="flex flex-col gap-3 px-1">
              {bestProducts.length > 0 ? (
                bestProducts.map((item) => (
                  <div key={item._id} className="flex justify-between items-center bg-slate-950/40 p-4 px-5 rounded-xl border border-white/[0.02]">
                    <p className="text-slate-200 text-sm font-medium m-0">{item.name}</p>
                    <span className="text-cyan-400 font-bold text-xs bg-cyan-500/5 px-3 py-1.5 rounded-md border border-cyan-500/10">Sold: {item.totalSold}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm m-0 p-2">No dynamic sales found</p>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-slate-900/20 p-6 rounded-2xl border border-white/5">
            <h2 className="text-base font-bold text-red-400 mb-4 tracking-wide px-1">Critical Stock Alerts</h2>
            <div className="flex flex-col gap-3 px-1">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((item) => (
                  <div key={item._id} className="flex justify-between items-center bg-slate-950/40 p-4 px-5 rounded-xl border border-white/[0.02]">
                    <p className="text-slate-200 text-sm font-medium m-0">{item.name}</p>
                    <span className="text-red-400 font-semibold text-xs bg-red-500/10 p-1.5 px-3 rounded-md border border-red-500/10">Restock Req</span>
                  </div>
                ))
              ) : (
                <p className="text-emerald-400 text-sm font-medium m-0 py-3 px-2">✓ Healthy Warehouse Inventory</p>
              )}
            </div>
          </div>
        </div>

        {/* RECENT SALES TRANSACTIONS */}
        <div className="bg-slate-900/20 p-6 rounded-2xl border border-white/5 mx-1">
          <h2 className="text-base font-bold text-slate-200 mb-4 tracking-wide px-1">Recent Activity Transactions</h2>
          <div className="flex flex-col gap-3 px-1">
            {sales.length > 0 ? (
              sales.slice(0, 5).map((sale) => (
                <div key={sale._id} className="flex justify-between items-center bg-slate-950/40 p-4 px-6 rounded-xl border border-white/[0.02]">
                  <p className="text-slate-400 text-sm m-0">
                    Reference Tag: <span className="text-slate-100 font-mono font-semibold ml-2">#{sale._id.slice(-6).toUpperCase()}</span>
                  </p>
                  <span className="text-emerald-400 font-bold text-sm">
                    Rs {sale.totalAmount?.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm m-0 p-2">No orders completed</p>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Reports;
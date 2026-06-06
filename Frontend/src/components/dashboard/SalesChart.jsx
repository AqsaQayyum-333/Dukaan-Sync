import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getSales } from "../../services/salesService";

const SalesChart = () => {
  const [chartData, setChartData] = useState([]);

  const fetchSales = async () => {
    try {
      const sales = await getSales();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weeklySales = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

      sales.forEach((sale) => {
        const day = days[new Date(sale.createdAt).getDay()];
        weeklySales[day] += sale.totalAmount || 0;
      });

      const formattedData = days.map((day) => ({
        name: day,
        sales: weeklySales[day],
      }));

      setChartData(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Format big numbers cleanly (e.g., 500k instead of 500000)
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}M`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}k`;
    return tickItem;
  };

  return (
    <div 
      style={{ 
        backgroundColor: "rgba(30, 41, 59, 0.4)", 
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "32px", 
        borderRadius: "20px", 
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* Title with clean spacing */}
      <h2 
        style={{ 
          fontSize: "13px", 
          fontWeight: 600, 
          color: "#94a3b8", 
          textTransform: "uppercase", 
          letterSpacing: "0.08em", 
          margin: "0 0 32px 0" 
        }}
      >
        Weekly Sales Performance
      </h2>

      {/* Increased container height from 300 to 380 for beautiful aspect ratio */}
      <div style={{ width: "100%", height: "380px", fontFamily: "sans-serif" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            
            {/* Clean background grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.3)" vertical={false} />
            
            {/* X Axis with solid spacing and better font */}
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
              tickLine={false} 
              axisLine={false} 
              dy={15} 
            />
            
            {/* Y Axis with safe text formatting so numbers never collide! */}
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
              tickFormatter={formatYAxis}
              tickLine={false} 
              axisLine={false} 
              dx={-15} 
            />
            
            {/* Minimalist modern tool-tip */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                borderColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px',
                color: '#f8fafc',
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                padding: "10px 14px"
              }} 
              itemStyle={{ color: '#22d3ee', fontWeight: 600 }}
              formatter={(value) => [`Rs ${value.toLocaleString()}`, "Sales"]}
            />

            {/* Premium crisp white trend line */}
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#ffffff"
              strokeWidth={3.5}
              dot={{ r: 5, stroke: '#0f172a', strokeWidth: 2.5, fill: '#ffffff' }}
              activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2, fill: '#22d3ee' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
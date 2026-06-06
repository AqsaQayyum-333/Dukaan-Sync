import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Receipt,
  FileText,
  Layers,
  Users,
  Truck,
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const menu = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: Box },
    { to: "/sales", label: "POS", icon: ShoppingCart },
    { to: "/purchases", label: "Purchases", icon: Receipt },
    { to: "/reports", label: "Reports", icon: FileText },
    { to: "/categories", label: "Categories", icon: Layers },
    { to: "/users", label: "Users", icon: Users },
    { to: "/suppliers", label: "Suppliers", icon: Truck },
  ];

  return (
    // Explicit flex structure using standard inline CSS to bypass compiler bugs
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "#0f172a", color: "#f1f5f9", position: "relative" }}>
      
      {/* 100% LOCKED SIDEBAR */}
      <div 
        style={{ 
          width: "260px", 
          minWidth: "260px", 
          maxWidth: "260px", 
          backgroundColor: "rgba(30, 41, 59, 0.7)", 
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(51, 65, 85, 0.4)", 
          paddingTop: "4rem", 
          paddingBottom: "1.5rem", 
          paddingLeft: "1.5rem", 
          paddingRight: "1.5rem", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "between", 
          position: "fixed", 
          left: 0, 
          top: 0, 
          height: "100vh", 
          zIndex: 50,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Logo Section */}
          <div style={{ display: "flex", flexDirection: "col", itemsCenter: "center", textAlign: "center", justifyContent: "center" }}>
            <div style={{ height: "48px", width: "48px", borderRadius: "12px", backgroundColor: "#334155", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #475569", margin: "0 auto" }}>
              <span style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#ffffff" }}>D</span>
            </div>
            <h1 style={{ fontSize: "1.125rem", fontWeight: 600, marginTop: "14px", color: "#ffffff", letterSpacing: "-0.025em" }}>
              Dukaan<span style={{ color: "#94a3b8", fontWeight: 400, fontFamily: "monospace", marginLeft: "2px" }}>Sync</span>
            </h1>
          </div>

          {/* Spacer */}
          <div style={{ height: "40px" }}></div>

          {/* Navigation Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {menu.map((item, i) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;

              return (
                <Link
                  key={i}
                  to={item.to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: active ? 600 : 500,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    backgroundColor: active ? "#334155" : "transparent",
                    color: active ? "#ffffff" : "#94a3b8",
                    border: active ? "1px solid #475569" : "1px solid transparent",
                    boxShadow: active ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none"
                  }}
                  className="sidebar-link-hover"
                >
                  <Icon size={19} style={{ color: active ? "#ffffff" : "#64748b", flexShrink: 0 }} />
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(51, 65, 85, 0.3)", paddingTop: "1rem", textAlign: "center" }}>
          <p style={{ fontSize: "10px", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>v1.0.0 Stable</p>
        </div>
      </div>

      {/* THE BRUTE FORCE INLINE PUSH: Forces content area to mechanically start after the 260px sidebar + 40px gap */}
      <div 
        style={{ 
          marginLeft: "300px", 
          padding: "3rem 2rem", 
          width: "calc(100% - 300px)", 
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10
        }}
      >
        <div style={{ width: "100%", maxWidth: "1250px", margin: "0 auto" }}>
          {children}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;
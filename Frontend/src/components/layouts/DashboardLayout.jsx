import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
LayoutDashboard,
Box,
ShoppingCart,
Receipt,
FileText,
Layers,
Users,
Truck,
LogOut,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
 
const PAGE_TITLES = {
"/dashboard": { title: "Welcome Back", subtitle: "Inventory & POS Control Center" },
"/products": { title: "Products Management", subtitle: "Create, edit and track inventory stock items" },
"/sales": { title: "POS Billing", subtitle: "Click items below to add them directly to invoice cart" },
"/purchases": { title: "Purchases Stock", subtitle: "Manage supplier incoming inventory items and procurement records" },
"/reports": { title: "Reports & Analytics", subtitle: "Real-time core performance metrics, sales analysis and inventory tracks" },
"/categories": { title: "Categories", subtitle: "Organize your product catalogue" },
"/users": { title: "Staff Control Panel", subtitle: "Manage system access controls and staff permissions" },
"/suppliers": { title: "Suppliers Ledger", subtitle: "Manage distribution networks and vendor addresses" },
};
 
const DashboardLayout = ({ children }) => {
const location = useLocation();
const navigate = useNavigate();
const { user, logout } = useContext(AuthContext);
const role = user?.role;
const allMenu = [
{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["OWNER", "ADMIN"] },
{ to: "/products", label: "Products", icon: Box, roles: ["OWNER", "ADMIN", "STAFF"] },
{ to: "/sales", label: "POS", icon: ShoppingCart, roles: ["OWNER", "ADMIN", "STAFF"] },
{ to: "/purchases", label: "Purchases", icon: Receipt, roles: ["OWNER", "ADMIN"] },
{ to: "/reports", label: "Reports", icon: FileText, roles: ["OWNER", "ADMIN"] },
{ to: "/categories", label: "Categories", icon: Layers, roles: ["OWNER", "ADMIN", "STAFF"] },
{ to: "/users", label: "Users", icon: Users, roles: ["OWNER", "ADMIN"] },
{ to: "/suppliers", label: "Suppliers", icon: Truck, roles: ["OWNER", "ADMIN", "STAFF"] },
];
const menu = allMenu.filter((item) => !role || item.roles.includes(role));
const handleLogout = () => {
logout();
navigate("/");
};
const pageInfo = PAGE_TITLES[location.pathname] || { title: "", subtitle: "" };
return (
<div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "#0f172a", color: "#f1f5f9", position: "relative" }}>
{/* SIDEBAR - hidden entirely during print via .app-shell-sidebar */}
<div
className="app-shell-sidebar no-print"
style={{
width: "260px",
minWidth: "260px",
maxWidth: "260px",
backgroundColor: "rgba(30, 41, 59, 0.7)",
backdropFilter: "blur(12px)",
WebkitBackdropFilter: "blur(12px)",
borderRight: "1px solid rgba(51, 65, 85, 0.4)",
paddingTop: "2.5rem",
paddingBottom: "1.25rem",
paddingLeft: "1.5rem",
paddingRight: "1.5rem",
display: "flex",
flexDirection: "column",
position: "fixed",
left: 0,
top: 0,
height: "100vh",
zIndex: 50,
boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
overflowY: "auto"
}}
>
{/* Logo Section */}
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", justifyContent: "center", flexShrink: 0 }}>
<div style={{ height: "48px", width: "48px", borderRadius: "12px", backgroundColor: "#334155", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #475569", margin: "0 auto" }}>
<span style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#ffffff" }}>D</span>
</div>
<h1 style={{ fontSize: "1.125rem", fontWeight: 600, marginTop: "18px", color: "#ffffff", letterSpacing: "-0.025em" }}>
Dukaan<span style={{ color: "#94a3b8", fontWeight: 400, fontFamily: "monospace", marginLeft: "2px" }}>Sync</span>
</h1>
{user?.name && (
<p style={{ fontSize: "11px", color: "#64748b", marginTop: "10px", marginBottom: 0 }}>
{user.name} · <span style={{ color: "#22d3ee", fontWeight: 600 }}>{role}</span>
</p>
)}
</div>
{/* Spacer - fixed gap between role label and the nav menu below it */}
<div style={{ height: "36px", flexShrink: 0 }}></div>
{/* Navigation Links */}
<div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
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
{/* Footer - pushed to the bottom when there's room, but never clipped when the menu is tall */}
<div style={{ borderTop: "1px solid rgba(51, 65, 85, 0.3)", marginTop: "auto", paddingTop: "1.25rem", flexShrink: 0 }}>
<p style={{ fontSize: "10px", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, textAlign: "center", margin: 0 }}>v1.0.0 Stable</p>
</div>
</div>
{/* MAIN CONTENT AREA */}
<div
className="app-shell-content-wrapper"
style={{
marginLeft: "260px",
width: "calc(100% - 260px)",
boxSizing: "border-box",
position: "relative",
zIndex: 10,
minHeight: "100vh",
display: "flex",
flexDirection: "column"
}}
>
{/* TOP HEADER BAR - page title on the left, logout always top-right */}
<div
className="no-print"
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
padding: "1.75rem 2.5rem",
borderBottom: "1px solid rgba(255,255,255,0.04)",
flexWrap: "wrap",
gap: "16px"
}}
>
<div>
{pageInfo.title && (
<>
<h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
{pageInfo.title}
</h2>
<p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "4px 0 0 0" }}>
{pageInfo.subtitle}
</p>
</>
)}
</div>
<button
onClick={handleLogout}
style={{
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: "8px",
padding: "10px 18px",
borderRadius: "12px",
fontSize: "13px",
fontWeight: 600,
backgroundColor: "rgba(239, 68, 68, 0.08)",
color: "#f87171",
border: "1px solid rgba(239, 68, 68, 0.2)",
cursor: "pointer",
transition: "all 0.15s ease",
flexShrink: 0
}}
className="sidebar-link-hover"
>
<LogOut size={16} />
Logout
</button>
</div>
{/* PAGE CONTENT */}
<div style={{ padding: "1rem 2rem 3rem 2rem", width: "100%", boxSizing: "border-box", flex: 1 }}>
<div style={{ width: "100%", maxWidth: "1250px", margin: "0 auto" }}>
{children}
</div>
</div>
</div>
</div>
);
};
export default DashboardLayout;
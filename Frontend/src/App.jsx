import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/LoginPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import POS from "./pages/sales/POS";
import Purchases from "./pages/purchases/Purchases";
import Reports from "./pages/reports/Reports";
import Users from "./pages/users/Users";
import Categories from "./pages/categories/Categories";
import Suppliers from "./pages/suppliers/Suppliers";
import ProtectedRoute from "./routes/ProtectedRoute";
function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Login />} />
<Route path="/dashboard" element={<ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}><Dashboard /></ProtectedRoute>} />
<Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
<Route path="/sales" element={<ProtectedRoute><POS /></ProtectedRoute>} />
<Route path="/purchases" element={<ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}><Purchases /></ProtectedRoute>} />
<Route path="/reports" element={<ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}><Reports /></ProtectedRoute>} />
<Route path="/users" element={<ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}><Users /></ProtectedRoute>} />
<Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
<Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
</Routes>
</BrowserRouter>
);
}
export default App;
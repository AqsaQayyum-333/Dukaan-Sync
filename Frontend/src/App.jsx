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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<POS />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/suppliers" element={<Suppliers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
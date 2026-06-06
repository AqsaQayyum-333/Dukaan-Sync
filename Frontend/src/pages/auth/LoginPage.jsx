import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans relative overflow-hidden" style={{ backgroundColor: "#0b121f" }}>
      
      {/* BACKGROUND GLOWS FOR PREMIUM VISUAL FEEL */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* LUXURY LOGIN CARD WITH EXACT MATCHING DESIGN */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md mx-4 rounded-2xl relative z-10"
        style={{ backgroundColor: "rgba(17, 28, 46, 0.25)", border: "1px solid rgba(255, 255, 255, 0.04)", padding: "40px" }}
      >

        {/* LOGO TITLE & SUBTITLE */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <span className="text-white font-bold text-xl">📦</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" }}>
            Dukaan Sync
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
            Smart Retail Management System
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5 text-left">
          
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20"
              style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20"
              style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
              required
            />
          </div>

          {/* ADDED PERFECT GAP BETWEEN PASSWORD BOX AND BUTTON */}
          <div className="pt-6 clear-both" style={{ marginTop: "16px" }}>
            <button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center cursor-pointer transition-all hover:bg-opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: "#ffffff", color: "#0b121f" }}
            >
              Login to Account
            </button>
          </div>

        </form>
      </motion.div>
      
    </div>
  );
};

export default LoginPage;
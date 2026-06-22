import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
 
// Strong password rule used for setting/resetting a password:
// minimum 13 characters, at least one uppercase, one lowercase,
// one digit, and one special character.
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{13,}$/;
 
const validateStrongPassword = (value) => {
if (!value) return "Password is required";
if (value.length < 13) return "Password must be at least 13 characters";
if (!/[a-z]/.test(value)) return "Add at least one lowercase letter";
if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter";
if (!/\d/.test(value)) return "Add at least one number";
if (!/[^A-Za-z0-9]/.test(value)) return "Add at least one special character";
return "";
};
 
const LoginPage = () => {
const navigate = useNavigate();
const { login } = useContext(AuthContext);
const [formData, setFormData] = useState({
email: "",
password: "",
});
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [showLoginPassword, setShowLoginPassword] = useState(false);
const [showResetNewPassword, setShowResetNewPassword] = useState(false);
const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
// FORGOT PASSWORD FLOW STATE
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [resetStep, setResetStep] = useState(1);
const [resetEmail, setResetEmail] = useState("");
const [resetNewPassword, setResetNewPassword] = useState("");
const [resetConfirmPassword, setResetConfirmPassword] = useState("");
const [resetError, setResetError] = useState("");
const [resetLoading, setResetLoading] = useState(false);
 
const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
setErrors({ ...errors, [e.target.name]: "" });
};
 
// VALIDATE LOGIN FORM - login only checks presence, not strength
// (strength rules apply when a password is being SET, not when logging in
// with an existing one, so old accounts aren't locked out).
const validateForm = () => {
const newErrors = {};
if (!formData.email.trim()) {
newErrors.email = "Email is required";
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
newErrors.email = "Enter a valid email address";
}
if (!formData.password) {
newErrors.password = "Password is required";
}
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};
 
const handleLogin = async (e) => {
e.preventDefault();
if (!validateForm()) return;
setLoading(true);
try {
const res = await axios.post(
"http://localhost:5000/api/auth/login",
formData
);
login(res.data.token, res.data.user);
const destination = res.data.user?.role === "STAFF" ? "/products" : "/dashboard";
navigate(destination);
} catch (error) {
setErrors({
form: error.response?.data?.message || "Login Failed. Please check your credentials."
});
} finally {
setLoading(false);
}
};
 
// FORGOT PASSWORD - STEP 1: VERIFY EMAIL
const handleVerifyEmail = async (e) => {
e.preventDefault();
setResetError("");
if (!resetEmail.trim()) {
setResetError("Please enter your email address");
return;
}
setResetLoading(true);
try {
await axios.post(
"http://localhost:5000/api/auth/verify-reset-email",
{ email: resetEmail }
);
setResetStep(2);
} catch (error) {
setResetError(error.response?.data?.message || "Email not found");
} finally {
setResetLoading(false);
}
};
 
// FORGOT PASSWORD - STEP 2: SET NEW PASSWORD (strong password enforced)
const handleResetPassword = async (e) => {
e.preventDefault();
setResetError("");
const strengthError = validateStrongPassword(resetNewPassword);
if (strengthError) {
setResetError(strengthError);
return;
}
if (resetNewPassword !== resetConfirmPassword) {
setResetError("Passwords do not match");
return;
}
setResetLoading(true);
try {
await axios.post(
"http://localhost:5000/api/auth/reset-password",
{ email: resetEmail, newPassword: resetNewPassword }
);
setResetStep(3);
} catch (error) {
setResetError(error.response?.data?.message || "Failed to reset password");
} finally {
setResetLoading(false);
}
};
 
const closeForgotPassword = () => {
setShowForgotPassword(false);
setResetStep(1);
setResetEmail("");
setResetNewPassword("");
setResetConfirmPassword("");
setResetError("");
};
 
return (
<div className="min-h-screen w-full flex items-center justify-center font-sans relative overflow-hidden" style={{ backgroundColor: "#0b121f" }}>
{/* BACKGROUND GLOWS */}
<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
 
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
<span className="text-white font-bold text-xl">D</span>
</div>
<h1 style={{ fontSize: "28px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" }}>
Dukaan Sync
</h1>
<p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
Smart Retail Management System
</p>
</div>
 
{errors.form && (
<div style={{
backgroundColor: "rgba(239, 68, 68, 0.08)",
border: "1px solid rgba(239, 68, 68, 0.2)",
borderRadius: "12px",
padding: "12px 16px",
marginBottom: "20px",
color: "#f87171",
fontSize: "13px",
fontWeight: 500
}}>
{errors.form}
</div>
)}
 
<form onSubmit={handleLogin} className="text-left" noValidate>
<div style={{ marginBottom: "22px" }}>
<label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>Email Address</label>
<input
type="email"
name="email"
placeholder="Enter Email"
value={formData.email}
onChange={handleChange}
className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20"
style={{
backgroundColor: "rgba(11, 18, 31, 0.7)",
border: errors.email ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)"
}}
/>
{errors.email && (
<p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>{errors.email}</p>
)}
</div>
 
<div style={{ marginBottom: "8px" }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
<label style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", margin: 0 }}>Password</label>
<button
type="button"
onClick={() => setShowForgotPassword(true)}
style={{ fontSize: "12px", fontWeight: "600", color: "#22d3ee", background: "none", border: "none", cursor: "pointer", padding: 0 }}
>
Forgot Password?
</button>
</div>
<div style={{ position: "relative" }}>
<input
type={showLoginPassword ? "text" : "password"}
name="password"
placeholder="Enter Password"
value={formData.password}
onChange={handleChange}
className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20"
style={{
backgroundColor: "rgba(11, 18, 31, 0.7)",
border: errors.password ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
paddingRight: "44px"
}}
/>
<button
type="button"
onClick={() => setShowLoginPassword((v) => !v)}
style={{
position: "absolute",
right: "14px",
top: "50%",
transform: "translateY(-50%)",
background: "none",
border: "none",
color: "#64748b",
cursor: "pointer",
padding: "4px",
display: "flex",
alignItems: "center"
}}
tabIndex={-1}
>
{showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
</div>
{errors.password && (
<p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>{errors.password}</p>
)}
</div>
 
<div style={{ marginTop: "26px" }}>
<button
type="submit"
disabled={loading}
className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center cursor-pointer transition-all hover:bg-opacity-90 active:scale-95 shadow-lg"
style={{
backgroundColor: "#ffffff",
color: "#0b121f",
opacity: loading ? 0.7 : 1,
cursor: loading ? "not-allowed" : "pointer"
}}
>
{loading ? "Signing In..." : "Login to Account"}
</button>
</div>
</form>
</motion.div>
 
{/* FORGOT PASSWORD MODAL */}
<AnimatePresence>
{showForgotPassword && (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
style={{
position: "fixed",
top: 0,
left: 0,
right: 0,
bottom: 0,
backgroundColor: "rgba(0, 0, 0, 0.6)",
display: "flex",
alignItems: "center",
justifyContent: "center",
zIndex: 100,
padding: "20px"
}}
onClick={closeForgotPassword}
>
<motion.div
initial={{ opacity: 0, y: 30, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 20, scale: 0.95 }}
onClick={(e) => e.stopPropagation()}
className="w-full max-w-md"
style={{
backgroundColor: "#11182b",
border: "1px solid rgba(255, 255, 255, 0.08)",
borderRadius: "20px",
padding: "32px"
}}
>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
<h2 style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
{resetStep === 3 ? "Password Reset" : "Reset Password"}
</h2>
<button
onClick={closeForgotPassword}
style={{ background: "none", border: "none", color: "#64748b", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}
>
✕
</button>
</div>
 
{resetError && (
<div style={{
backgroundColor: "rgba(239, 68, 68, 0.08)",
border: "1px solid rgba(239, 68, 68, 0.2)",
borderRadius: "12px",
padding: "10px 14px",
marginBottom: "16px",
color: "#f87171",
fontSize: "13px"
}}>
{resetError}
</div>
)}
 
{/* STEP 1: ENTER EMAIL */}
{resetStep === 1 && (
<form onSubmit={handleVerifyEmail} className="text-left">
<p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "18px" }}>
Enter your account email address. We'll verify it before letting you set a new password.
</p>
<label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>
Email Address
</label>
<input
type="email"
value={resetEmail}
onChange={(e) => setResetEmail(e.target.value)}
placeholder="name@example.com"
className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm"
style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "22px" }}
/>
<button
type="submit"
disabled={resetLoading}
className="w-full h-12 rounded-xl font-bold text-sm"
style={{ backgroundColor: "#ffffff", color: "#0b121f", opacity: resetLoading ? 0.7 : 1, cursor: resetLoading ? "not-allowed" : "pointer" }}
>
{resetLoading ? "Verifying..." : "Continue"}
</button>
</form>
)}
 
{/* STEP 2: SET NEW PASSWORD */}
{resetStep === 2 && (
<form onSubmit={handleResetPassword} className="text-left">
<p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "18px" }}>
Set a new password for <span style={{ color: "#22d3ee", fontWeight: 600 }}>{resetEmail}</span>
</p>
<label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>
New Password
</label>
<div style={{ position: "relative" }}>
<input
type={showResetNewPassword ? "text" : "password"}
value={resetNewPassword}
onChange={(e) => setResetNewPassword(e.target.value)}
placeholder="Min. 13 characters"
className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm"
style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", paddingRight: "44px" }}
/>
<button
type="button"
onClick={() => setShowResetNewPassword((v) => !v)}
style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
tabIndex={-1}
>
{showResetNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
</div>
<p style={{ fontSize: "11px", color: "#64748b", marginTop: "8px", marginBottom: "18px", lineHeight: "1.5" }}>
Must be 13+ characters with uppercase, lowercase, a number, and a special character.
</p>
<label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>
Confirm New Password
</label>
<div style={{ position: "relative" }}>
<input
type={showResetConfirmPassword ? "text" : "password"}
value={resetConfirmPassword}
onChange={(e) => setResetConfirmPassword(e.target.value)}
placeholder="Re-enter new password"
className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm"
style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "22px", paddingRight: "44px" }}
/>
<button
type="button"
onClick={() => setShowResetConfirmPassword((v) => !v)}
style={{ position: "absolute", right: "14px", top: "24px", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
tabIndex={-1}
>
{showResetConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
</div>
<button
type="submit"
disabled={resetLoading}
className="w-full h-12 rounded-xl font-bold text-sm"
style={{ backgroundColor: "#ffffff", color: "#0b121f", opacity: resetLoading ? 0.7 : 1, cursor: resetLoading ? "not-allowed" : "pointer" }}
>
{resetLoading ? "Updating..." : "Reset Password"}
</button>
</form>
)}
 
{/* STEP 3: SUCCESS */}
{resetStep === 3 && (
<div className="text-center">
<div style={{
width: "56px",
height: "56px",
borderRadius: "50%",
backgroundColor: "rgba(52, 211, 153, 0.1)",
border: "1px solid rgba(52, 211, 153, 0.3)",
display: "flex",
alignItems: "center",
justifyContent: "center",
margin: "0 auto 16px auto",
fontSize: "24px",
color: "#34d399"
}}>
✓
</div>
<p style={{ color: "#e2e8f0", fontSize: "14px", marginBottom: "20px" }}>
Your password has been reset successfully. You can now log in with your new password.
</p>
<button
onClick={closeForgotPassword}
className="w-full h-12 rounded-xl font-bold text-sm"
style={{ backgroundColor: "#ffffff", color: "#0b121f", cursor: "pointer" }}
>
Back to Login
</button>
</div>
)}
</motion.div>
</motion.div>
)}
</AnimatePresence>
</div>
);
};
 
export default LoginPage;
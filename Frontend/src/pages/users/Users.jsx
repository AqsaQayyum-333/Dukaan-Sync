import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import DashboardLayout from
"../../components/layouts/DashboardLayout";
import { getUsers, createUser, updateUser, deleteUser } from
"../../services/userService";
const Users = () => {
const [users, setUsers] = useState([]);
const [form, setForm] = useState({ name: "", email: "",
password: "", role: "STAFF" });
const [editingId, setEditingId] = useState(null);
const [showPassword, setShowPassword] = useState(false);
const currentUser = JSON.parse(localStorage.getItem("user"));
const canModify = (targetUser) => {
if (currentUser?.role === "OWNER") return true;
if (currentUser?.role === "ADMIN" && targetUser.role !== "OWNER") return true;
return false;
};
const fetchUsers = async () => { const data = await
getUsers(); setUsers(data || []); };
useEffect(() => { fetchUsers(); }, []);
const [formError, setFormError] = useState("");
// Same strong password rule used on the login/reset-password pages:
// 13+ characters, at least one uppercase, one lowercase, one digit,
// and one special character.
const validateStrongPassword = (value) => {
if (!value) return "Password is required";
if (value.length < 13) return "Password must be at least 13 characters";
if (!/[a-z]/.test(value)) return "Add at least one lowercase letter";
if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter";
if (!/\d/.test(value)) return "Add at least one number";
if (!/[^A-Za-z0-9]/.test(value)) return "Add at least one special character";
return "";
};
const handleSubmit = async () => {
setFormError("");
if (!editingId) {
const strengthError = validateStrongPassword(form.password);
if (strengthError) {
setFormError(strengthError);
return;
}
} else if (form.password) {
// Editing an existing user AND they typed a new password - still enforce strength
const strengthError = validateStrongPassword(form.password);
if (strengthError) {
setFormError(strengthError);
return;
}
}
try {
if (editingId) { await updateUser(editingId, form); }
else { await createUser(form); }
setForm({ name: "", email: "", password: "", role:
"STAFF" });
setEditingId(null);
fetchUsers();
} catch (error) { setFormError(error.response?.data?.message || "Error updating user"); }
};
return (
<DashboardLayout>
<div style={{ padding: "20px 45px 40px 45px", width: "100%",
textAlign: "left" }}>
{/* INPUTS CONTAINER COMPONENT */}
<div className="w-full rounded-2xl"
style={{ backgroundColor: "rgba(17, 28, 46, 0.25)", border:
"1px solid rgba(255, 255, 255, 0.04)", padding: "35px" }}>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<div>
<label style={{ display: "block", fontSize:
"12px", fontWeight: "500", color: "#94a3b8", marginBottom:
"8px" }}>Full Name</label>
<input type="text" placeholder="Muhammad Ali"
value={form.name} onChange={(e) => setForm({ ...form, name:
e.target.value })} className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20" style={{ backgroundColor: "rgba(11, 18, 31, 0.7)",
border: "1px solid rgba(255, 255, 255, 0.08)" }} />
</div>
<div>
<label style={{ display: "block", fontSize:
"12px", fontWeight: "500", color: "#94a3b8", marginBottom:
"8px" }}>Email Address</label>
<input type="email"
placeholder="name@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20" style={{ backgroundColor:
"rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }} />
</div>
<div>
<label style={{ display: "block", fontSize:
"12px", fontWeight: "500", color: "#94a3b8", marginBottom:
"8px" }}>Password</label>
<div style={{ position: "relative" }}>
<input type={showPassword ? "text" : "password"} placeholder="Min. 13 characters"
value={form.password} onChange={(e) => setForm({ ...form,
password: e.target.value })} className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20" style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", paddingRight: "44px" }} />
<button
type="button"
onClick={() => setShowPassword((v) => !v)}
style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
tabIndex={-1}
>
{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
</div>
<p style={{ fontSize: "11px", color: "#64748b", marginTop: "6px", lineHeight: "1.4" }}>
13+ chars, uppercase, lowercase, number, special char
</p>
</div>
<div>
<label style={{ display: "block", fontSize:
"12px", fontWeight: "500", color: "#94a3b8", marginBottom:
"8px" }}>Authority Role</label>
<select value={form.role} onChange={(e) =>
setForm({ ...form, role: e.target.value })} className="w-full h-12 px-4 rounded-xl text-slate-300 outline-none text-sm cursor-pointer" style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
<option value="STAFF" className="bg-slate-950">STAFF</option>
{currentUser?.role === "OWNER" && <option
value="ADMIN" className="bg-slate-950">ADMIN</option>}
</select>
</div>
</div>
{/* FORCE INLINE MARGIN TOP TO BREAK GRID CLIPPING
*/}
{formError && (
<p style={{ color: "#f87171", fontSize: "13px", fontWeight: 500, marginTop: "20px", marginBottom: "0" }}>
{formError}
</p>
)}
<div style={{ display: "block", width: "100%",
marginTop: "30px", clear: "both" }}>
<button onClick={handleSubmit} className="h-12 px-8 min-w-[180px] rounded-xl font-bold text-sm flex items-center justify-center cursor-pointer transition-all hover:bg-opacity-90 active:scale-95 shadow-lg" style={{ backgroundColor:
"#ffffff", color: "#0b121f" }}>
{editingId ? "Update Account" : "Register Account"}
</button>
</div>
</div>
<div style={{ height: "24px" }}></div>
{/* HIGH DEFINITION SYSTEM LIST */}
<div className="w-full rounded-2xl overflow-hidden"
style={{ backgroundColor: "rgba(11, 18, 31, 0.4)", border:
"1px solid rgba(255, 255, 255, 0.04)" }}>
<div className="grid grid-cols-12 gap-4 py-5 px-8 items-center font-bold text-[13px] text-slate-300 uppercase tracking-wider" style={{ backgroundColor: "rgba(17, 28, 46, 0.6)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
minHeight: "55px" }}>
<div className="col-span-3 text-center">Staff
Name</div>
<div className="col-span-4 text-left">Email
Address</div>
<div className="col-span-2 text-left">System
Role</div>
<div className="col-span-3 text-center">Actions</div>
</div>
<div className="flex flex-col">
{users.map((user) => (
<div key={user._id} className="grid grid-cols-12 gap-4 items-center px-8 transition-all border-b border-white/[0.02] hover:bg-white/[0.01]" style={{ minHeight:
"65px" }}>
<div className="col-span-3 text-sm font-semibold text-slate-200 truncate text-center">{user.name}</div>
<div className="col-span-4 text-sm text-slate-400 font-mono truncate text-left">{user.email}</div>
<div className="col-span-2 text-left">
<span className={`inline-flex items-center
px-2.5 py-0.5 rounded-md text-xs font-bold border ${user.role
=== "OWNER" || user.role === "ADMIN" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-slate-500/10 text-slate-400 border-white/5"}`}>{user.role}</span>
</div>
<div className="col-span-3 flex justify-center gap-2.5">
{canModify(user) ? (
<>
<button onClick={() => setForm({ name:
user.name, email: user.email, password: "", role: user.role })
|| setEditingId(user._id)} className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer">Edit</button>
<button onClick={async () => { await
deleteUser(user._id); fetchUsers(); }} className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer">Delete</button>
</>
) : (
<span style={{ fontSize: "12px", color: "#475569" }}>—</span>
)}
</div>
</div>
))}
</div>
</div>
</div>
</DashboardLayout>
);
};
export default Users;
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../services/supplierService";
import toast from "react-hot-toast";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  const fetchSuppliers = async () => {
    try { const data = await getSuppliers(); setSuppliers(data || []); } catch (error) { console.log(error); }
  };
  useEffect(() => { fetchSuppliers(); }, []);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Supplier Name Required");
    try {
      await createSupplier(formData);
      toast.success("Supplier Added");
      setFormData({ name: "", phone: "", address: "" });
      fetchSuppliers();
    } catch (error) { toast.error("Failed"); }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({ name: supplier.name, phone: supplier.phone, address: supplier.address });
  };

  const handleUpdate = async () => {
    try {
      await updateSupplier(editingSupplier._id, formData);
      toast.success("Supplier Updated");
      setEditingSupplier(null);
      setFormData({ name: "", phone: "", address: "" });
      fetchSuppliers();
    } catch (error) { toast.error("Update Failed"); }
  };

  const handleDelete = async (id) => {
    try { await deleteSupplier(id); toast.success("Deleted"); fetchSuppliers(); } catch (error) { toast.error("Failed"); }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "40px 45px", width: "100%", textAlign: "left" }}>
        
        {/* HEADER */}
        <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" }}>Suppliers Ledger</h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>Manage distribution networks and vendor addresses</p>
        </div>

        {/* INPUTS MAIN PREMIUM CARD */}
        <form onSubmit={handleSubmit} className="w-full rounded-2xl" style={{ backgroundColor: "rgba(17, 28, 46, 0.25)", border: "1px solid rgba(255, 255, 255, 0.04)", padding: "35px" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>Supplier Name</label>
              <input type="text" name="name" placeholder="Product Name..." value={formData.name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20" style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>Phone</label>
              <input type="text" name="phone" placeholder="Contact number..." value={formData.phone} onChange={handleChange} className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20" style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>Address</label>
              <input type="text" name="address" placeholder="Station address..." value={formData.address} onChange={handleChange} className="w-full h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20" style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }} />
            </div>
          </div>

          {/* FORCE INLINE MARGIN TOP TO BREAK GRID CLIPPING */}
          <div style={{ display: "block", width: "100%", marginTop: "30px", clear: "both" }}>
            <button type="submit" onClick={editingSupplier ? handleUpdate : handleSubmit} className="h-12 px-8 min-w-[160px] rounded-xl font-bold text-sm flex items-center justify-center cursor-pointer transition-all hover:bg-opacity-90 active:scale-95 shadow-lg" style={{ backgroundColor: "#ffffff", color: "#0b121f" }}>
              {editingSupplier ? "Update Supplier" : "Add Supplier"}
            </button>
          </div>
        </form>

        <div style={{ height: "24px" }}></div>

        {/* LUXURY ROW LIST VIEW */}
        <div className="w-full rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(11, 18, 31, 0.4)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
          <div className="grid grid-cols-12 gap-4 py-5 px-8 items-center font-bold text-[13px] text-slate-300 uppercase tracking-wider" style={{ backgroundColor: "rgba(17, 28, 46, 0.6)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", minHeight: "55px" }}>
            <div className="col-span-3 text-center">Supplier Name</div>
            <div className="col-span-3 text-left">Phone Number</div>
            <div className="col-span-4 text-left">Station Address</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          
          <div className="flex flex-col">
            {suppliers.map((supplier) => (
              <div key={supplier._id} className="grid grid-cols-12 gap-4 items-center px-8 transition-all border-b border-white/[0.02] hover:bg-white/[0.01]" style={{ minHeight: "65px" }}>
                <div className="col-span-3 text-sm font-semibold text-slate-200 truncate text-center">{supplier.name}</div>
                <div className="col-span-3 text-sm text-slate-400 font-mono truncate text-left">{supplier.phone || "—"}</div>
                <div className="col-span-4 text-sm text-slate-400 truncate text-left">{supplier.address || "—"}</div>
                <div className="col-span-2 flex justify-center gap-2.5">
                  <button onClick={() => handleEdit(supplier)} className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(supplier._id)} className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
export default Suppliers;
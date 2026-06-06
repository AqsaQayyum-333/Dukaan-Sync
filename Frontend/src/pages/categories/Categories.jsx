import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { getCategories, createCategory, deleteCategory } from "../../services/categoryService";
import toast from "react-hot-toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const fetchCategories = async () => { const data = await getCategories(); setCategories(data || []); };
  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory({ name });
      toast.success("Category Added");
      setName("");
      fetchCategories();
    } catch (error) { toast.error("Failed"); }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "40px 45px", width: "100%", textAlign: "left" }}>
        
        {/* HEADER */}
        <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" }}>Categories Registry</h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>Create and monitor inventory stock classifications</p>
        </div>

        {/* INPUT AND SOLID WHITE BUTTON PANEL */}
        <form onSubmit={handleSubmit} className="w-full rounded-2xl" style={{ backgroundColor: "rgba(17, 28, 46, 0.25)", border: "1px solid rgba(255, 255, 255, 0.04)", padding: "35px" }}>
          <div className="max-w-2xl">
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>Category Name</label>
            <div className="w-full flex flex-col sm:flex-row items-end gap-4">
              <input type="text" placeholder="Enter new category..." value={name} onChange={(e) => setName(e.target.value)} className="flex-1 h-12 px-4 rounded-xl text-white outline-none text-sm transition-all focus:border-white/20" style={{ backgroundColor: "rgba(11, 18, 31, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }} />
              <button type="submit" className="h-12 px-8 min-w-[160px] rounded-xl font-bold text-sm flex items-center justify-center cursor-pointer transition-all hover:bg-opacity-90 active:scale-95 shadow-lg" style={{ backgroundColor: "#ffffff", color: "#0b121f" }}>
                Add Category
              </button>
            </div>
          </div>
        </form>

        <div style={{ height: "20px" }}></div>

        {/* LUXURY ROW TABLE */}
        <div className="w-full rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(11, 18, 31, 0.4)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
          {/* UPGRADED 1ST ROW: INCREASED FONT SIZE, WIDTH, AND PADDING */}
          <div className="grid grid-cols-12 gap-4 py-5 px-8 items-center font-bold text-[13px] text-slate-300 uppercase tracking-wider" style={{ backgroundColor: "rgba(17, 28, 46, 0.6)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", minHeight: "55px" }}>
            <div className="col-span-8 text-center">Category Classification Title</div>
            <div className="col-span-4 text-center">System Actions</div>
          </div>
          
          <div className="flex flex-col">
            {categories.map((category) => (
              <div key={category._id} className="grid grid-cols-12 gap-4 items-center px-8 transition-all border-b border-white/[0.02] hover:bg-white/[0.01]" style={{ minHeight: "65px" }}>
                <div className="col-span-8 text-sm font-semibold text-slate-200 text-center">{category.name}</div>
                <div className="col-span-4 flex justify-center">
                  <button onClick={async () => { await deleteCategory(category._id); fetchCategories(); toast.success("Deleted"); }} className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
export default Categories;
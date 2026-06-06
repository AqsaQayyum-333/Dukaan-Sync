import api from "./api";

// GET ALL
export const getSuppliers = async () => {
  const res = await api.get("/suppliers");
  return res.data;
};

// CREATE
export const createSupplier = async (data) => {
  const res = await api.post("/suppliers", data);
  return res.data;
};

// UPDATE
export const updateSupplier = async (id, data) => {
  const res = await api.put(`/suppliers/${id}`, data);
  return res.data;
};

// DELETE
export const deleteSupplier = async (id) => {
  const res = await api.delete(`/suppliers/${id}`);
  return res.data;
};
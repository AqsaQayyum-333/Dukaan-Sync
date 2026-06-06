import axios from "axios";

const API = "http://localhost:5000/api/products";

// TOKEN
const token = localStorage.getItem("token");

// CONFIG
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// GET PRODUCTS
export const getProducts = async () => {
  const res = await axios.get(API, config);
  return res.data;
};

// CREATE PRODUCT
export const createProduct = async (data) => {
  const res = await axios.post(API, data, config);
  return res.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, config);
  return res.data;
};


// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API}/${id}`, config);
  return res.data;
};
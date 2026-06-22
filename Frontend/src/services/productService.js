import axios from "axios";
const API = "http://localhost:5000/api/products";
// CONFIG - reads fresh token on every call so logout/login cycles work correctly
const getConfig = () => ({
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
});
// GET PRODUCTS
export const getProducts = async () => {
const res = await axios.get(API, getConfig());
return res.data;
};
// CREATE PRODUCT
export const createProduct = async (data) => {
const res = await axios.post(API, data, getConfig());
return res.data;
};
// UPDATE PRODUCT
export const updateProduct = async (id, data) => {
const res = await axios.put(`${API}/${id}`, data, getConfig());
return res.data;
};
// DELETE PRODUCT
export const deleteProduct = async (id) => {
const res = await axios.delete(`${API}/${id}`, getConfig());
return res.data;
};
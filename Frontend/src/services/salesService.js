import api from "./api";

export const createSale = async (saleData) => {
  const res = await api.post(
    "/sales",
    saleData
  );

  return res.data;
};

export const getSales = async () => {
  const res = await api.get("/sales");

  return res.data;
};
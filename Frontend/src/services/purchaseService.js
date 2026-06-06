import api from "./api";

export const createPurchase = async (data) => {
  const res = await api.post(
    "/purchases",
    data
  );

  return res.data;
};

export const getPurchases = async () => {
  const res = await api.get(
    "/purchases"
  );

  return res.data;
};

export const deletePurchase = async (id) => {
  const res = await api.delete(
    `/purchases/${id}`
  );

  return res.data;
};
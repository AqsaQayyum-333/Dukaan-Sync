import api from "./api";

export const getBestSellingProducts =
async () => {

const res =
await api.get(
"/reports/best-selling"
);

return res.data;

};
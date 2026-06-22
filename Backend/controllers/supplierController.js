const Supplier = require("../models/Supplier");
// CREATE
const createSupplier = async (req, res) => {
const data = await Supplier.create(req.body);
res.json(data);
};
// GET ALL
const getSuppliers = async (req, res) => {
const data = await Supplier.find().sort({ createdAt: -1 });
res.json(data);
};
// GET BY ID
const getSupplierById = async (req, res) => {
const data = await Supplier.findById(req.params.id);
res.json(data);
};
// UPDATE
const updateSupplier = async (req, res) => {
const data = await
Supplier.findByIdAndUpdate(req.params.id, req.body, { new:
true });
res.json(data);
};
const patchSupplier = async (req, res) => {
try {
const updatedSupplier = await
Supplier.findByIdAndUpdate(
req.params.id,
{ $set: req.body },
{ new: true }
);
if (!updatedSupplier) {
return res.status(404).json({
message: "Supplier not Found!"
});
}
res.json(updatedSupplier);
} catch (error) {
res.status(500).json({
message: error.message
});
}
};
// DELETE
const deleteSupplier = async (req, res) => {
await Supplier.findByIdAndDelete(req.params.id);
res.json({ message: "Deleted!" });
};
module.exports = {
createSupplier,
getSuppliers,
getSupplierById,
updateSupplier,
patchSupplier,
deleteSupplier
}
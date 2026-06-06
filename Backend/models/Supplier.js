const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Supplier", supplierSchema);

const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
    quantity: Number,
    price: Number,
    subTotal: Number,

    saleId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
});

module.exports = mongoose.model("SaleItem", saleItemSchema);
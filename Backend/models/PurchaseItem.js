const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema({

    quantity: Number,

    costPrice: Number,

    subTotal: Number,

    purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase"
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
});

module.exports = mongoose.model(
    "PurchaseItem",
    purchaseItemSchema
);
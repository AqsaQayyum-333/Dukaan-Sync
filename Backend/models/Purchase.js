const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    totalAmount: Number,

    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Supplier",
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Purchase", purchaseSchema);
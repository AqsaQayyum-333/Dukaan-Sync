const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    totalAmount: Number,
    paymentMethod: String,
    paymentStatus: String,
    discount: Number,
    tax: Number,

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Sale", saleSchema);
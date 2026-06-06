const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: ["IN", "OUT"], // IN = Purchase & OUT = Sale
    },

    quantity: Number,
    price: Number,

    referenceType: String,  // Purchase OR Sale
    referenceId: mongoose.Schema.Types.ObjectId,

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    createdAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model("Transaction", transactionSchema);
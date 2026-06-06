const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    sku: {
        type: String,
        unique: true
    },

    costPrice: Number,

    sellingPrice: Number,

    image: {
        type: String
    },

    lowStockThreshold: {
        type: Number,
        default: 5
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Product", productSchema);
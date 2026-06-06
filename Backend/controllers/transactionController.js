const Transaction = require("../models/Transaction");

// GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("productId")
            .populate("createdBy");

        res.json(transactions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET STOCK BY PRODUCT ID
const getStockByProduct = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            productId: req.params.productId
        });

        let stock = 0;

        transactions.forEach(t => {
            if (t.type === "IN") {
                stock += t.quantity;
            } else {
                stock -= t.quantity;
            }
        });

        res.json({
            productId: req.params.productId,
            currentStock: stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    getStockByProduct
};
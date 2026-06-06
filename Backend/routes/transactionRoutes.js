const express = require("express");
const router = express.Router();

const {
    getTransactions,
    getStockByProduct
} = require("../controllers/transactionController");

router.get("/", getTransactions);

router.get("/stock/:productId", getStockByProduct);

module.exports = router;
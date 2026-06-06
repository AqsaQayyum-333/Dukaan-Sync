const express = require("express");

const router = express.Router();

const {
    dashboardSummary,
    lowStockProducts,
    dailySalesReport,
    bestSellingProducts
} = require("../controllers/reportController");

const auth = require("../middleware/authMiddleware");


// DASHBOARD
router.get(
    "/dashboard",
    auth,
    dashboardSummary
);


// LOW STOCK
router.get(
    "/low-stock",
    auth,
    lowStockProducts
);


// DAILY SALES
router.get(
    "/daily",
    auth,
    dailySalesReport
);

router.get(
"/best-selling",
bestSellingProducts
);

module.exports = router;
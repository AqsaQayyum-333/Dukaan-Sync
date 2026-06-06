const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const express = require("express");
const router = express.Router();

const {
    createPurchase,
    getPurchases,
    getPurchaseById,
    deletePurchase
} = require("../controllers/purchaseController");

router.post(
    "/",
    auth,
    role(["ADMIN", "OWNER"]),
    createPurchase
);

router.get(
    "/",
    auth,
    role(["ADMIN", "OWNER"]),
    getPurchases
);

router.get(
    "/:id",
    auth,
    role(["ADMIN", "OWNER"]),
    getPurchaseById
);

router.delete(
    "/:id",
    auth,
    role(["OWNER"]),
    deletePurchase
);

module.exports = router;
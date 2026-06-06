const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const express = require("express");
const router = express.Router();

const {
    createSale,
    getSales,
    getSaleById,
    deleteSale
} = require("../controllers/saleController");


router.post(
    "/",
    auth,
    role(["ADMIN", "OWNER", "STAFF"]),
    createSale
);

router.get(
    "/",
    auth,
    role(["ADMIN", "OWNER"]),
    getSales
);

router.get(
    "/:id",
    auth,
    role(["ADMIN", "OWNER"]),
    getSaleById
);

router.delete(
    "/:id",
    auth,
    role(["OWNER"]),
    deleteSale
);


module.exports = router;
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const express = require("express");
const router = express.Router();

const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  patchSupplier,
  deleteSupplier
} = require("../controllers/supplierController");


router.post(
    "/",
    auth,
    role(["ADMIN", "OWNER"]),
    createSupplier
);

router.get(
    "/",
    auth,
    getSuppliers
);

router.get(
    "/:id",
    auth,
    getSupplierById
);

router.put(
    "/:id",
    auth,
    role(["ADMIN", "OWNER"]),
    updateSupplier
);

router.patch(
    "/:id",
    auth,
    role(["ADMIN", "OWNER"]),
    patchSupplier
);

router.delete(
    "/:id",
    auth,
    role(["OWNER"]),
    deleteSupplier
);


module.exports = router;
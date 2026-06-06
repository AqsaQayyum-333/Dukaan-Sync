const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    patchProduct,
    deleteProduct,
    getLowStock,
    uploadImage
} = require("../controllers/productController");

router.post(
    "/",
    auth,
    role(["ADMIN", "OWNER"]),
    createProduct
);

router.get(
    "/",
    auth,
    getProducts
);

router.put(
    "/:id",
    auth,
    role(["ADMIN", "OWNER"]),
    updateProduct
);

router.patch(
    "/:id",
    auth,
    role(["ADMIN", "OWNER"]),
    patchProduct
);

router.delete(
    "/:id",
    auth,
    role(["OWNER"]),
    deleteProduct
);

router.get(
    "/low-stock",
    auth,
    role(["ADMIN", "OWNER"]),
    getLowStock
);

router.get(
    "/:id",
    auth,
    getProductById
);

// IMAGE UPLOAD
router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
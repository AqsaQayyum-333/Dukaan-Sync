const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  patchCategory,
  deleteCategory
} = require("../controllers/categoryController");


router.post(
    "/",
    auth,
    role(["ADMIN", "OWNER"]),
    createCategory
);

router.get(
    "/",
    auth,
    getCategories
);

router.get(
    "/:id",
    auth,
    getCategoryById
);

router.put(
    "/:id",
    auth,
    role(["ADMIN", "OWNER"]),
    updateCategory
);

router.patch(
    "/:id",
    auth,
    role(["ADMIN", "OWNER"]),
    patchCategory
);

router.delete(
    "/:id",
    auth,
    role(["OWNER"]),
    deleteCategory
);

module.exports = router;
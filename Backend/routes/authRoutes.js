const express = require("express");
const router = express.Router();
const {
registerUser,
loginUser,
verifyResetEmail,
resetPassword
} = require("../controllers/authController");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-reset-email", verifyResetEmail);
router.post("/reset-password", resetPassword);
module.exports = router;
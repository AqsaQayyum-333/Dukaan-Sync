const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
createUser,
getUsers,
getUserById,
updateUser,
deleteUser
} = require("../controllers/usersController");
// GET
router.get("/", auth, role(["OWNER", "ADMIN"]), getUsers);
router.get("/:id", auth, role(["OWNER", "ADMIN"]), getUserById);
// CREATE
router.post(
"/",
auth,
role(["OWNER", "ADMIN"]),
createUser
);
// UPDATE
router.put(
"/:id",
auth,
role(["OWNER", "ADMIN"]),
updateUser
);
// DELETE
router.delete(
"/:id",
auth,
role(["OWNER", "ADMIN"]),
deleteUser
);
module.exports = router;
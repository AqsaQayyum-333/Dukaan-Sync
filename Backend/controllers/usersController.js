const User = require("../models/User");
const bcrypt = require("bcryptjs");
// Same strong password rule enforced on login/reset-password:
// 13+ characters, at least one uppercase, one lowercase, one digit,
// and one special character.
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{13,}$/;
const STRONG_PASSWORD_MESSAGE = "Password must be at least 13 Characters & include Uppercase, Lowercase, a Number & a Special Character.";
// CREATE USER
const createUser = async (req, res) => {
try {
console.log("REQ.USER:");
console.log(req.user);
const { name, email, password, role } = req.body;
if (!req.user) {
return res.status(401).json({
message: "User not Authenticated!"
});
}
if (
req.user.role === "ADMIN" &&
role === "ADMIN"
) {
return res.status(403).json({
message: "Admin cannot create Admin."
});
}
if (!password || !STRONG_PASSWORD_REGEX.test(password)) {
return res.status(400).json({
message: STRONG_PASSWORD_MESSAGE
});
}
const existingUser = await User.findOne({
email
});
if (existingUser) {
return res.status(400).json({
message: "User Already Exists!"
});
}
const hashedPassword =
await bcrypt.hash(password, 10);
const user = await User.create({
name,
email,
password: hashedPassword,
role
});
res.status(201).json(user);
} catch (error) {
console.log("CREATE USER ERROR:");
console.log(error);
res.status(500).json({
message: error.message
});
}
};
// GET ALL USERS
const getUsers = async (req, res) => {
try {
const users = await User.find().sort({ name: 1 });
res.json(users);
} catch (error) {
res.status(500).json({
message: error.message,
});
}
};
// GET USER BY ID
const getUserById = async (req, res) => {
try {
const user = await User.findById(
req.params.id
);
if (!user) {
return res.status(404).json({
message: "Not Found!",
});
}
res.json(user);
} catch (error) {
res.status(500).json({
message: error.message,
});
}
};
// UPDATE USER
const updateUser = async (req, res) => {
try {
const updateData = { ...req.body };
if (updateData.password) {
if (!STRONG_PASSWORD_REGEX.test(updateData.password)) {
return res.status(400).json({
message: STRONG_PASSWORD_MESSAGE
});
}
updateData.password =
await bcrypt.hash(
updateData.password,
10
);
}
const user =
await User.findByIdAndUpdate(
req.params.id,
updateData,
{ new: true }
);
res.json(user);
} catch (error) {
res.status(500).json({
message: error.message,
});
}
};
// DELETE USER
const deleteUser = async (req, res) => {
try {
const targetUser =
await User.findById(req.params.id);
if (!targetUser) {
return res.status(404).json({
message: "User not Found!",
});
}
// Admin cannot delete Owner
if (
req.user.role === "ADMIN" &&
targetUser.role === "OWNER"
) {
return res.status(403).json({
message:
"Cannot Delete Owner!",
});
}
await User.findByIdAndDelete(
req.params.id
);
res.json({
message: "User Deleted!",
});
} catch (error) {
res.status(500).json({
message: error.message,
});
}
};
module.exports = {
createUser,
getUsers,
getUserById,
updateUser,
deleteUser,
};
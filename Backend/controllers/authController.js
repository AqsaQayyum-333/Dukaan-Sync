const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// REGISTER USER
const registerUser = async (req, res) => {
try {
const { name, email, password, role } = req.body;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{13,}$/;
if (!password || !strongPasswordRegex.test(password)) {
return res.status(400).json({
message: "Password must be at least 13 Characters & include Uppercase, Lowercase, a Number & a Special Character."
});
}
// CHECK EXISTING USER
const existingUser = await User.findOne({ email });
if (existingUser) {
return res.status(400).json({
message: "User Already Exists."
});
}
// HASH PASSWORD
const hashedPassword = await bcrypt.hash(password, 10);
// CREATE USER
const user = await User.create({
name,
email,
password: hashedPassword,
role
});
const safeUser = {
_id: user._id,
name: user.name,
email: user.email,
role: user.role
};
res.status(201).json({
message: "User registered successfully",
user: safeUser
});
} catch (error) {
res.status(500).json({
message: error.message
});
}
};
// LOGIN USER
const loginUser = async (req, res) => {
try {
const { email, password } = req.body;
// FIND USER
const user = await User.findOne({ email });
if (!user) {
return res.status(404).json({
message: "User not Found."
});
}
// CHECK PASSWORD
const isMatch = await bcrypt.compare(
password,
user.password
);
if (!isMatch) {
return res.status(400).json({
message: "Invalid Credentials!"
});
}
// GENERATE TOKEN
const token = jwt.sign(
{
id: user._id,
role: user.role
},
process.env.JWT_SECRET,
{
expiresIn: "1d"
}
);
const safeUser = {
_id: user._id,
name: user.name,
email: user.email,
role: user.role
};
res.json({
token,
user: safeUser
});
} catch (error) {
res.status(500).json({
message: error.message
});
}
};
// FORGOT PASSWORD - VERIFY EMAIL EXISTS
const verifyResetEmail = async (req, res) => {
try {
const { email } = req.body;
const user = await User.findOne({ email });
if (!user) {
return res.status(404).json({
message: "No Account Found with this Email."
});
}
res.json({
message: "Email Verified!",
name: user.name
});
} catch (error) {
res.status(500).json({
message: error.message
});
}
};
// FORGOT PASSWORD - RESET TO NEW PASSWORD
const resetPassword = async (req, res) => {
try {
const { email, newPassword } = req.body;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{13,}$/;
if (!newPassword || !strongPasswordRegex.test(newPassword)) {
return res.status(400).json({
message: "Password must be at least 13 Characters & include Uppercase, Lowercase, a Number & a Special Character"
});
}
const user = await User.findOne({ email });
if (!user) {
return res.status(404).json({
message: "No Account Found with this Email."
});
}
const hashedPassword = await bcrypt.hash(newPassword, 10);
user.password = hashedPassword;
await user.save();
res.json({
message: "Password Reset Successfully!"
});
} catch (error) {
res.status(500).json({
message: error.message
});
}
};
module.exports = {
registerUser,
loginUser,
verifyResetEmail,
resetPassword
};
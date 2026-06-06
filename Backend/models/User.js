const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
    type: String,
    required: true
},
    
  role: {
        type: String,
        enum: ["OWNER", "ADMIN", "STAFF"],
        default: "STAFF"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
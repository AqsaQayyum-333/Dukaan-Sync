require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const saleRoutes = require("./routes/saleRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// DB Connection
connectDB();

// Middeware
app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Routes
app.get("/", (req, res) => {
    res.send("API Running...");
});

// Start Server
app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});
const SaleItem = require("../models/SaleItem");
const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");


// DASHBOARD SUMMARY
const dashboardSummary = async (req, res) => {
    try {

        const totalProducts = await Product.countDocuments();

        const totalSales = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalPurchases = await Purchase.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        res.json({
            totalProducts,

            totalSales:
                totalSales.length > 0
                    ? totalSales[0].total
                    : 0,

            totalPurchases:
                totalPurchases.length > 0
                    ? totalPurchases[0].total
                    : 0
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// LOW STOCK PRODUCTS
const lowStockProducts = async (req, res) => {

    try {

        const products = await Product.find();

        let lowStock = [];

        for (let product of products) {

            const transactions =
                await Transaction.find({
                    productId: product._id
                });

            let stock = 0;

            transactions.forEach((t) => {

                if (t.type === "IN") {
                    stock += t.quantity;
                } else {
                    stock -= t.quantity;
                }

            });

            if (stock <= product.lowStockThreshold) {

                lowStock.push({
                    productName: product.name,
                    stock,
                    lowStockThreshold:
                        product.lowStockThreshold
                });

            }

        }

        res.json(lowStock);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// DAILY SALES REPORT
const dailySalesReport = async (req, res) => {

    try {

        const sales = await Sale.find()
            .populate("userId");

        res.json(sales);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const bestSellingProducts = async (req, res) => {

    try {

        const bestProducts =
            await SaleItem.aggregate([

                {
                    $group: {
                        _id: "$productId",
                        totalSold: {
                            $sum: "$quantity"
                        }
                    }
                },

                {
                    $sort: {
                        totalSold: -1
                    }
                },

                {
                    $limit: 5
                }

            ]);

        const Product = require("../models/Product");

        const result = [];

        for (let item of bestProducts) {

            const product =
                await Product.findById(
                    item._id
                );

            result.push({
                _id: product._id,
                name: product.name,
                totalSold: item.totalSold
            });

        }

        res.json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    dashboardSummary,
    lowStockProducts,
    dailySalesReport,
    bestSellingProducts
};
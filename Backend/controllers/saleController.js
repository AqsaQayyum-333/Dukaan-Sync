const Sale = require("../models/Sale");
const SaleItem = require("../models/SaleItem");
const Transaction = require("../models/Transaction");
const Product = require("../models/Product");


// CREATE SALE
const createSale = async (req, res) => {

    try {

        const {
            items,
            paymentMethod,
            paymentStatus,
            discount,
            tax,
            userId
        } = req.body;

        let total = 0;

        // VALIDATION FIRST
        for (let item of items) {

            // CHECK PRODUCT EXISTS
            const product = await Product.findById(
                item.productId
            );

            if (!product) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }

            // GET STOCK
            const transactions =
                await Transaction.find({
                    productId: item.productId
                });

            let stock = 0;

            transactions.forEach((t) => {

                if (t.type === "IN") {
                    stock += t.quantity;
                } else {
                    stock -= t.quantity;
                }

            });

            // CHECK STOCK
            if (stock < item.quantity) {

                return res.status(400).json({
                    message:
                        `Insufficient Stock for ${product.name}.`
                });

            }

        }

        // CREATE SALE
        const sale = new Sale({
            paymentMethod,
            paymentStatus,
            discount,
            tax,
            userId,
            totalAmount: 0
        });

        await sale.save();

        // SAVE ITEMS
        for (let item of items) {

            const subTotal =
                item.quantity * item.price;

            const saleItem = new SaleItem({
                saleId: sale._id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                subTotal
            });

            await saleItem.save();

            total += subTotal;

            // STOCK OUT
            await Transaction.create({
                type: "OUT",
                quantity: item.quantity,
                price: item.price,
                referenceType: "Sale",
                referenceId: sale._id,
                productId: item.productId,
                createdBy: userId
            });

        }

        total =
            total
            - (discount || 0)
            + (tax || 0);

        sale.totalAmount = total;

        await sale.save();

        res.status(201).json(sale);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// GET ALL SALES
const getSales = async (req, res) => {

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


// GET SINGLE SALE
const getSaleById = async (req, res) => {

    try {

        const sale = await Sale.findById(
            req.params.id
        );

        if (!sale) {

            return res.status(404).json({
                message: "Sale not Found!"
            });

        }

        res.json(sale);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// DELETE SALE
const deleteSale = async (req, res) => {

    try {

        const sale =
            await Sale.findByIdAndDelete(
                req.params.id
            );

        if (!sale) {

            return res.status(404).json({
                message: "Sale not Found!"
            });

        }

        res.json({
            message: "Sale Deleted!"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    createSale,
    getSales,
    getSaleById,
    deleteSale
};
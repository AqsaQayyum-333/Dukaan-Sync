const Purchase = require("../models/Purchase");
const PurchaseItem = require("../models/PurchaseItem");
const Transaction = require("../models/Transaction");

// CREATE PURCHASE
const createPurchase = async (req, res) => {
    try {

        const {
            supplierId,
            items
        } = req.body;

        const purchase = new Purchase({
            supplierId,
            userId: req.user.id,
            totalAmount: 0
        });

        await purchase.save();

        let total = 0;

        for (let item of items) {

            const purchaseItem =
                new PurchaseItem({
                    purchaseId:
                        purchase._id,
                    productId:
                        item.productId,
                    quantity:
                        item.quantity,
                    costPrice:
                        item.costPrice
                });

            await purchaseItem.save();

            total +=
                item.quantity *
                item.costPrice;

            await Transaction.create({
                type: "IN",
                quantity:
                    item.quantity,
                price:
                    item.costPrice,
                referenceType:
                    "Purchase",
                referenceId:
                    purchase._id,
                productId:
                    item.productId,
                createdBy:
                    req.user.id
            });

        }

        purchase.totalAmount =
            total;

        await purchase.save();

        res.status(201).json(
            purchase
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                error.message
        });

    }
};

// GET ALL PURCHASES
const getPurchases = async (
    req,
    res
) => {
    try {

        const purchases =
            await Purchase.find()
                .populate(
                    "supplierId"
                )
                .populate(
                    "userId"
                );

        res.json(purchases);

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }
};

// GET SINGLE PURCHASE
const getPurchaseById =
async (req, res) => {

    try {

        const purchase =
            await Purchase.findById(
                req.params.id
            );

        if (!purchase) {

            return res.status(404)
                .json({
                    message:
                        "Not found"
                });

        }

        res.json(purchase);

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};

// DELETE PURCHASE
const deletePurchase =
async (req, res) => {

    try {

        const purchase =
            await Purchase.findByIdAndDelete(
                req.params.id
            );

        if (!purchase) {

            return res.status(404)
                .json({
                    message:
                        "Not found"
                });

        }

        res.json({
            message:
                "Purchase deleted"
        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};

module.exports = {
    createPurchase,
    getPurchases,
    getPurchaseById,
    deletePurchase
};
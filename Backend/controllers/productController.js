
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const cloudinary = require("../config/cloudinary");



// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {

    const products = await Product.find()
      .populate("categoryId");

    const updatedProducts = [];

    for (let product of products) {

      const transactions = await Transaction.find({
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

      updatedProducts.push({
        ...product._doc,
        stock
      });
    }

    res.json(updatedProducts);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};


// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// PUT - FULL UPDATE
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// PATCH - PARTIAL UPDATE
const patchProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// LOW STOCK (Transaction based)
const getLowStock = async (req, res) => {
    try {
        const products = await Product.find();
        let result = [];

        for (let product of products) {
            const transactions = await Transaction.find({ productId: product._id });

            let stock = 0;

            transactions.forEach(t => {
                if (t.type === "IN") stock += t.quantity;
                else stock -= t.quantity;
            });

           if (stock <= product.lowStockThreshold) {
    result.push({
        ...product._doc,
        stock
    });
}
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// IMAGE UPLOAD (Cloudinary)
const uploadImage = async (req, res) => {
    try {
        cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) return res.status(500).json(error);
                res.json(result);
            }
        ).end(req.file.buffer);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    patchProduct,
    deleteProduct,
    getLowStock,
    uploadImage   
};
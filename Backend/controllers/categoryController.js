const Category = require("../models/Category");

// CREATE
const createCategory = async (req, res) => {
    const data = await Category.create(req.body);
    res.json(data);
};

// GET ALL
const getCategories = async (req, res) => {
    const data = await Category.find();
    res.json(data);
};

// GET BY ID
const getCategoryById = async (req, res) => {
    const data = await Category.findById(req.params.id);
    res.json(data);
};

// UPDATE
const updateCategory = async (req, res) => {
    const data = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
};

const patchCategory = async (req, res) => {
    try {

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not Found!"
            });
        }

        res.json(updatedCategory);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE
const deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};

module.exports = {
   createCategory,
   getCategories,
   getCategoryById,
   updateCategory,
   patchCategory,
   deleteCategory
}
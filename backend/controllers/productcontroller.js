const Product = require("../models/Product");

// =====================================================
// GET ALL PRODUCTS
// =====================================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE PRODUCT
// =====================================================

const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(
      "GET PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE PRODUCT
// =====================================================

const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      price,
      description,
      category,
    } = req.body;

    // VALIDATION

    if (!name || !price) {
      return res.status(400).json({
        message:
          "Product name and price are required.",
      });
    }

    // IMAGE

    let image = "";

    // IMAGE FILE UPLOAD

    if (req.file) {
      image =
        `http://localhost:8000/uploads/${req.file.filename}`;
    }

    // IMAGE URL IF PROVIDED

    if (!image && req.body.image) {
      image = req.body.image;
    }

    if (!image) {
      return res.status(400).json({
        message:
          "Product image is required.",
      });
    }

    // CREATE PRODUCT

    const product =
      await Product.create({
        name: name.trim(),

        price: Number(price),

        image,

        description:
          description?.trim() || "",

        category:
          category?.trim() || "Crochet",
      });

    res.status(201).json({
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create product",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PRODUCT
// =====================================================

const updateProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      price,
      description,
      category,
    } = req.body;

    const updateData = {};

    // NAME

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    // PRICE

    if (price !== undefined) {
      updateData.price =
        Number(price);
    }

    // DESCRIPTION

    if (description !== undefined) {
      updateData.description =
        description.trim();
    }

    // CATEGORY

    if (category !== undefined) {
      updateData.category =
        category.trim();
    }

    // NEW IMAGE UPLOAD

    if (req.file) {
      updateData.image =
        `http://localhost:8000/uploads/${req.file.filename}`;
    }

    // IMAGE URL

    if (
      !req.file &&
      req.body.image
    ) {
      updateData.image =
        req.body.image;
    }

    // UPDATE PRODUCT

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update product",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE PRODUCT
// =====================================================

const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
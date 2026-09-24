
import productModel from '../model/Product.js';
import ApiFeatures from "../utils/apiFeatures.js";

import Product from '../model/Product.js';


export const newProduct = async (req, res) => {
  try {
    const { name, price, color, cutprice, describe, stock, category, seller, rating, size } = req.body;
    const images = req.body.images;

    const product = new Product({
      name,
      price,
      color,
      cutprice,
      describe,
      stock,
      category,
      seller,
      rating,
      size,
      images,
    });

    await product.save();
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};



export const getproducts = async (req, res) => {
  try {
    const resultsPerPage = 12;
    const apiFeature = new ApiFeatures(Product.find().sort({ orderIndex: 1, createdAt: -1 }), req.query) // ✅ ApiFeatures, not apiFeature
      .search()
      .filter()
      .paginate(resultsPerPage);

    const product = await apiFeature.query;

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const singleproduct = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product found',
      product: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const updateproduct = async (req, res, next) => {
  try {
    // If no new images were uploaded, remove images key so existing ones are preserved
    if (!req.body.images) {
      delete req.body.images;
    }

    let product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: false, // partial updates should not re-validate required fields
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const singleproductupdate = async (req, res) => {
  let product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runvalidator: true

  })
  if (!product) {
    return res.status(404).json({
      success: true,
      message: "product not found"
    })
  }
  res.status(200).json({
    success: true,
    message: "product updated ",
    product
  })
}

export const deleteproduct = async (req, res, next) => {


  let product = await productModel.findByIdAndDelete(req.params.id)

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not find"
    })
  }
  res.status(200).json({
    success: true,
    message: "product deleted success",
    product
  })

}



// Reorder images for a product
export const reorderProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderedImages } = req.body;

    if (!orderedImages || !Array.isArray(orderedImages)) {
      return res.status(400).json({ message: 'orderedImages must be an array of image URLs' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update images array
    product.images = orderedImages;
    await product.save();

    res.status(200).json({ message: 'Images reordered successfully', product });
  } catch (error) {
    console.error('Error reordering images:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Reorder products
export const reorderProducts = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array' });
    }

    const updatePromises = orderedIds.map((id, index) => {
      return Product.findByIdAndUpdate(id, { orderIndex: index });
    });

    await Promise.all(updatePromises);
    res.status(200).json({ success: true, message: 'Products reordered successfully' });
  } catch (error) {
    console.error('Error reordering products:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

import express from 'express';
import multer from 'multer';
import { deleteproduct, getproducts, newProduct, singleproduct, updateproduct, reorderProductImages } from '../controllers/Products.js';
import { isauthticateuser, authorizeRoles } from '../middlewares/Authenticate.js';
import cloudinary from '../utils/Cloudinary.js';
import { uploadToR2 } from '../utils/r2.js';
import fs from 'fs';
import { userInfo } from 'os';
import { createClient } from '@supabase/supabase-js';
import { url } from 'inspector';
import { createGallery, getGallery } from '../controllers/Creategallery.js';
import galleryModel from '../model/Gallery.js';
import Product from '../model/Product.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const routes = express.Router();

const uploads = multer({ storage: multer.memoryStorage() });



// Route for creating a new product
routes.post('/products/new', isauthticateuser, authorizeRoles('admin'), uploads.array('images', 5), async (req, res) => {
  try {
    const { name, price, color, cutprice, stock, category, describe, seller, rating, size } = req.body;

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToR2(file.buffer, `products/${Date.now()}-${file.originalname}`, file.mimetype);
        imageUrls.push(url);
      }
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'Images are required' });
    }

    const product = new Product({
      name,
      price,
      color,
      cutprice,
      stock,
      category,
      describe,
      seller,
      rating,
      size: size || '100',
      images: imageUrls, 
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


routes.get('/products', getproducts);
routes.get('/products/:id', singleproduct);
routes.put('/products/update/:id', isauthticateuser, authorizeRoles('admin'), uploads.array('images', 5), async (req, res, next) => {
  try {
    // keepImages: existing image URLs the admin chose to keep (sent as keepImages[] in formData)
    let keepImages = [];
    if (req.body.keepImages) {
      keepImages = Array.isArray(req.body.keepImages)
        ? req.body.keepImages
        : [req.body.keepImages];
    }

    // Upload any newly selected files to R2
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToR2(file.buffer, `products/${Date.now()}-${file.originalname}`, file.mimetype);
        newImageUrls.push(url);
      }
    }

    // Merge: kept existing images + newly uploaded images
    const finalImages = [...keepImages, ...newImageUrls];
    if (finalImages.length > 0) {
      req.body.images = finalImages;
    }
    // If finalImages is empty (all removed, no new ones) we leave images untouched
    // so the controller's delete-if-undefined logic will preserve MongoDB's current value.
    // To explicitly clear all: send keepImages=[] with no new files.
    if (req.body.keepImages !== undefined && finalImages.length === 0) {
      req.body.images = []; // admin explicitly cleared all images
    }

    next();
  } catch (error) {
    console.error("Error uploading images during update:", error);
    res.status(500).json({ message: "Failed to upload images", error: error.message });
  }
}, updateproduct);
routes.put('/products/update/stock/:id', updateproduct);
routes.delete('/products/delete/:id', isauthticateuser, authorizeRoles('admin'), deleteproduct);
routes.put('/products/reorder-images/:id', isauthticateuser, authorizeRoles('admin'), reorderProductImages);




//gallery for userInfo


routes.post('/upload', uploads.single('file'), async (req, res, next) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: 'File is required' });
  }

  try {
    // Upload the file to Cloudflare R2
    const publicUrl = await uploadToR2(
      file.buffer,
      `gallery/${Date.now()}-${file.originalname}`,
      file.mimetype
    );

    // Save publicUrl and filename to MongoDB
    const newGalleryItem = new galleryModel({
      publicUrl,         // Save the public URL
      filename: file.originalname // Save the original filename
    });

    await newGalleryItem.save(); // Save the document in MongoDB

    // Send a response back to the client
    return res.json({ message: 'File uploaded and saved successfully', url: publicUrl });
    
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(500).json({ error: 'File upload failed', details: err.message });
  }
});



// gallery comparison upload
routes.post('/gallery/upload-comparison', uploads.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), async (req, res) => {
  try {
    const files = req.files;
    if (!files.beforeImage || !files.afterImage) {
      return res.status(400).json({ error: 'Both beforeImage and afterImage are required' });
    }

    const beforeFile = files.beforeImage[0];
    const afterFile = files.afterImage[0];

    const beforeUrl = await uploadToR2(
      beforeFile.buffer,
      gallery/before- + Date.now() + - + beforeFile.originalname,
      beforeFile.mimetype
    );

    const afterUrl = await uploadToR2(
      afterFile.buffer,
      gallery/after- + Date.now() + - + afterFile.originalname,
      afterFile.mimetype
    );

    const newGalleryItem = new galleryModel({
      beforeImageUrl: beforeUrl,
      afterImageUrl: afterUrl
    });

    await newGalleryItem.save();

    return res.json({ message: 'Comparison gallery uploaded successfully', beforeUrl, afterUrl });
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(500).json({ error: 'Comparison upload failed', details: err.message });
  }
});

routes.get('/gallery',getGallery)

export default routes;



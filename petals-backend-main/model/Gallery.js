import mongoose from "mongoose";

const galleryschema = mongoose.Schema({
  beforeImageUrl: { type: String, required: true },
  afterImageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const galleryModel = new mongoose.model('bgallermodel', galleryschema)

export default galleryModel;

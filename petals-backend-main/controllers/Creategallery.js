import galleryModel from "../model/Gallery.js";

export const createGallery = async (req, res) => {
  try {
    const  galery = req.body.image;

    const result = new galleryModel({
      galery,
    });

    const response = await result.save();

    res.status(200).json({
      success: "true",
      message: "created",
      response,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getGallery = async (req, res) => {
    try {
        // Return publicUrl + createdAt so client can sort newest-first
        const images = await galleryModel.find({}, 'beforeImageUrl afterImageUrl createdAt').sort({ createdAt: -1 });
        res.json(images || []);
      } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: 'Failed to fetch gallery images' });
      }
};


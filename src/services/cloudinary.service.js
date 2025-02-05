import cloudinary from '../../src/config/cloudinary.js';
export const uploadImageToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'band_images', // 📂 Carpeta en Cloudinary
      transformation: [{ width: 500, height: 500, crop: 'limit' }], // 🖼️ Optimizar tamaño
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary Upload Error: ${error.message}`);
  }
};

export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split('/').pop().split('.')[0]; // 🔍 Extraer el publicId de la URL
    await cloudinary.uploader.destroy(`band_images/${publicId}`);
  } catch (error) {
    console.error(`Cloudinary Delete Error: ${error.message}`);
  }
};

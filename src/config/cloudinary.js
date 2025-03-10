import { v2 as cloudinary } from 'cloudinary';
import config from '../config.js';

cloudinary.config({
  cloud_name: config.cloudinary.CLOUDINARY_CLOUD_NAME,
  api_key: config.cloudinary.CLOUDINARY_API_KEY,
  api_secret: config.cloudinary.CLOUDINARY_API_SECRET,
  secure: true, 
});

export default cloudinary;

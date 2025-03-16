// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name:'dk2j7fw7m',
    api_key:'798252169915734',
    api_secret:'wI62XI0ezoJGGL256ll3VoiMSoA'
});

// Setup multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads', // Optional: Specify the folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: (req, file) => file.originalname.split('.')[0]
    }
});

module.exports = {
    cloudinary,
    storage
};

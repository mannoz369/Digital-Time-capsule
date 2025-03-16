// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name:'',
    api_key:'',
    api_secret:''
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

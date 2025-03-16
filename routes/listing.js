// routes/listing.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedin, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../utils/cloudinary.js"); // Import the Cloudinary storage

const upload = multer({ storage });
const CryptoJS = require("crypto-js");
const SECRET_KEY = "yourSecretKey123"; 

// 📌 Create Route - Add a new listing with an image upload
// router.post("/", isLoggedin, upload.single("listing[image]"), validateListing, wrapAsync(async (req, res, next) => {
//     const newListing = new Listing(req.body.listing);
//     let url = req.file.path;
//     let filename = req.file.filename;
//     newListing.image = {url,filename};
//     // 🔹 Save uploaded image URL from Cloudinary
//     // if (req.file) {
//     //     newListing.media = req.file.path; // Cloudinary auto-generates a URL
//     // }

//     newListing.owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "New Listing added!");
//     res.redirect("/listings");
// }));

router.post("/", isLoggedin, upload.single("listing[image]"), validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    // 🔒 Encrypt the description if provided
    if (req.body.listing.description) {
        newListing.description = CryptoJS.AES.encrypt(req.body.listing.description, SECRET_KEY).toString();
    }

    // 🔒 Encrypt the image URL if an image is uploaded
    if (req.file) {
        const encryptedUrl = CryptoJS.AES.encrypt(req.file.path, SECRET_KEY).toString();
        newListing.image = {
            url: encryptedUrl, // Encrypted URL
            filename: req.file.filename
        };
    }

    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing added!");
    res.redirect("/listings");
}));


// 📌 Index Route - Show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// 📌 New Route - Form for new listing
router.get("/new", isLoggedin, (req, res) => {
    res.render("listings/new.ejs");
});

// // 📌 Show Route - Display single listing
// router.get("/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("owner");
//     if (!listing) {
//         req.flash("error", "Listing Requested not found!");
//         return res.redirect("/listings");
//     }
//     res.render("listings/show.ejs", { listing });
// }));

router.get("/:id",isLoggedin,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
        req.flash("error", "Listing Requested not found!");
        return res.redirect("/listings");
    }

    // 🔓 Decrypt the description if available
    if (listing.description) {
        listing.description = CryptoJS.AES.decrypt(listing.description, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    }

    // 🔓 Decrypt the image URL if available
    if (listing.image && listing.image.url) {
        listing.image.url = CryptoJS.AES.decrypt(listing.image.url, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    }

    res.render("listings/show.ejs", { listing });
}));

module.exports = router;


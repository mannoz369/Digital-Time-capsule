const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    unlockDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value.getTime() > Date.now(); // Ensure it's a future date and time
            },
            message: "Unlock date and time must be in the future.",
        },
    },
    image:{
        url: String,
        filename: String,
    } ,
    createdAt: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) {
                return value <= Date.now(); // Prevent future timestamps
            },
            message: "Created date cannot be in the future.",
        },
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})

    }
    

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
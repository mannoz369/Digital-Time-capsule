const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        unlockDate: Joi.date().greater("now").required(),
        // media: Joi.alternatives().try(
        //     Joi.array().items(Joi.string().uri()).max(10), // If URLs are used
        //     Joi.array().items(Joi.string()).max(10) // If file paths are used
        // ).optional(),
        image: Joi.string(),
        createdAt: Joi.date().default(() => new Date()),
    }).required()
});

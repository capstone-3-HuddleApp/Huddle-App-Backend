const cloudinary = require("../cloudinary.config");
const {Image} = require('../models/index')

module.exports = {
  //Because upload_stream() is callback-based, it needs to be
  //  wrapped in a Promise first, then you can await it.
  async uploadImage(file, publicId, userId, eventId) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: publicId }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file);
    });

    // Database save happens after Promise resolves
    console.log("type: ",typeof(eventId) ," value: ", eventId)
    const imageData = await Image.create({
      public_id: result.public_id,
      url: result.secure_url,
      type: eventId ? 'event' : 'profile',
      user_id: userId,
      event_id: eventId? parseInt(eventId) : null
    });
    console.log(imageData)
    return imageData;
  },

  async deleteImage(publicId) {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  },

  async generateUrl(publicId, transformations) {
    return await cloudinary.url(publicId, transformations);
  },

  async getEventImages(eventId) {
    const images = await Image.findAll({
        where: {event_id: eventId}
    });
    console.log(images)
    return images;
  },

  async getProfileImages(userId){
    const images = await Image.findAll({
        where: {user_id: userId,
            type: "profile"
        }
    });
    return images;
  }
};

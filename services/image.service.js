const cloudinary = require("../cloudinary.config");

module.exports = {
  //Because upload_stream() is callback-based, it needs to be
  //  wrapped in a Promise first, then you can await it.
  async uploadImage(file, publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: publicId }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file);
    });
  },

  async deleteImage(publicId) {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  },

  async generateUrl(publicId, transformations) {
    return await cloudinary.url(publicId, transformations);
  },
};

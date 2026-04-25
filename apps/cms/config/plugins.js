module.exports = ({ env }) => {
  const cloudinaryEnabled =
    env("CLOUDINARY_NAME") && env("CLOUDINARY_KEY") && env("CLOUDINARY_SECRET");

  return {
    upload: cloudinaryEnabled
      ? {
          config: {
            provider: "cloudinary",
            providerOptions: {
              cloud_name: env("CLOUDINARY_NAME"),
              api_key: env("CLOUDINARY_KEY"),
              api_secret: env("CLOUDINARY_SECRET")
            },
            actionOptions: {
              upload: {
                folder: env("CLOUDINARY_FOLDER", "dayaprima")
              },
              uploadStream: {
                folder: env("CLOUDINARY_FOLDER", "dayaprima")
              },
              delete: {}
            }
          }
        }
      : {}
  };
};

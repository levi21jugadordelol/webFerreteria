import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

console.log("CLOUDINARY CHECK", {
  cloudName: env.CLOUDINARY.CLOUD_NAME,
  apiKeyExists: !!env.CLOUDINARY.API_KEY,
  apiSecretExists: !!env.CLOUDINARY.API_SECRET,
});

cloudinary.config({
  cloud_name: env.CLOUDINARY.CLOUD_NAME,
  api_key: env.CLOUDINARY.API_KEY,
  api_secret: env.CLOUDINARY.API_SECRET,
  secure: true,
});

cloudinary.api
  .ping()
  .then((res) => {
    console.log("CLOUDINARY PING OK", res);
  })
  .catch((error) => {
    console.error("CLOUDINARY PING ERROR", {
      message: error?.message,
      name: error?.name,
      http_code: error?.http_code,
    });
  });

export default cloudinary;

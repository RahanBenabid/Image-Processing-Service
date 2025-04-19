import Picture from "./../models/picture.model.js";
import { processImage } from "./../handlers/imageProcessor.js";
import { downloadImage } from "./../handlers/supabase.js";
import fs from "fs";

class TransformationController {
  async transformImage(req, res, next) {
    try {
      const imageId = req.params.id;
      const { resize } = req.body;

      const changes = {
        resize: resize,
      };

//    const image = await Picture.findById(imageId);
//    if (!image) return res.status(404).json({ message: "Image not found" });

//    const publicUrl = image.url;
//    const path = publicUrl.split("/image-processing/")[1].replace(/^\//, "");

      // Download image from Supabase (uncomment when ready)
//    const imageBuffer = await downloadImage(path);
      
      // Temporary local image read (remove this in production)
      const imageBuffer = fs.readFileSync(
        "/Users/RahanBen/Downloads/test/67b61459f4d6322eefb4018f.jpeg"
      );
      
      // Process the image with the changes
      const transformedImageBuffer = await processImage(imageBuffer, changes);

      // Write the transformed image to a file (optional, for debugging)
      fs.writeFileSync(
        "/Users/RahanBen/Downloads/test/transformed_image.png",
        transformedImageBuffer
      );

      // Send the transformed image as a response
      return res.status(200).send("Everything was successful yay!");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
}

export default new TransformationController();
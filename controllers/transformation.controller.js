import sharp from "sharp";
import Picture from "./../models/picture.model.js";
import Transformation from "./../models/transformation.model.js";
import { processImage } from "./../handlers/imageProcessor.js";
import { downloadImage, saveImage } from "./../handlers/supabase.js";
import fs from "fs";

class TransformationController {
  async transformImage(req, res, next) {
    try {
      const imageId = req.params.id;
      const { resize } = req.body;

      const changes = {
        resize: resize,
      };

      const image = await Picture.findById(imageId);
      if (!image) return res.status(404).json({ message: "Image not found" });

      const publicUrl = image.url;
      const path = publicUrl.split("/image-processing/")[1].replace(/^\//, "");

      // Download image from Supabase (uncomment when ready)
      //    const imageBuffer = await downloadImage(path);

      // Temporary local image read (remove this in production)
      const imageBuffer = fs.readFileSync(
        "/Users/RahanBen/Downloads/test/6806571e9980c54be72c6a48.jpeg",
      );

      // Process the image with the changes
      const transformedImageBuffer = await processImage(imageBuffer, changes);

      // Write the transformed image to a file (optional, for debugging)
      fs.writeFileSync(
        "/Users/RahanBen/Downloads/test/transformed_image.png",
        transformedImageBuffer,
      );

      // create a mongodb instance of the transformation instance
      const myTransformation = await Transformation({
        image_id: image._id,
        params: changes,
      });

      const newTransformation = await myTransformation.save();
      const transformedPictureId = newTransformation._id;

      // upload the transformed image into supabase
      const urlData = await saveImage(
        transformedImageBuffer,
        `transformed/${transformedPictureId}.jpeg`,
      );

      // update the public url and serve it
      await Transformation.updateOne(
        { _id: transformedPictureId },
        { url: urlData.publicUrl },
      );

      // Send the transformed image as a response
      res.status(200).json({
        success: true,
        publicUrl,
        urlData,
      });
      
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
}

export default new TransformationController();

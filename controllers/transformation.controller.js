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
      const raw = req.body.changes;
      const changes = typeof raw === "string" ? JSON.parse(raw) : raw;
      
      const image = await Picture.findById(imageId);
      if (!image) return res.status(404).json({ message: "Image not found" });

      const publicUrl = image.url;
      const path = publicUrl.split("/image-processing/")[1].replace(/^\//, "");

      // Download image from Supabase (uncomment when ready)
      const imageBuffer = await downloadImage(path);

      // Process the image with the changes
      const transformedImageBuffer = await processImage(imageBuffer, changes);

      // Write the transformed image to a file (optional, for debugging)
//    fs.writeFileSync(
//      "/Users/RahanBen/Downloads/test/transformed_image.png",
//      transformedImageBuffer,
//    );

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
      const myPublicUrl = urlData.publicUrl;

      // Send the transformed image as a response
      res.status(200).json({
        success: true,
        publicUrl: myPublicUrl,
        urlData,
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  async showPreview(req, res, next) {
    try {
      if (!req.files || req.files.length !== 1)
        return res.status(400).json({ error: "error in file upload" });
      const raw = req.body.changes;
      const changes = typeof raw === "string" ? JSON.parse(raw) : raw;
      let transformedImageBuffer;
      
      try {
        const file = req.files[0];
        const fileBuffer = file.buffer;
        transformedImageBuffer = await processImage(fileBuffer, changes);
        
        res.set("Content-Type", "image/png");
        return res.send(transformedImageBuffer);
      } catch (err) {
        console.error("Error creating the preview: ", err.message);
        return res
        .status(500)
        .json({ message: "Failed to create the preview" });
      }
    } catch (err) {
      return next(err);
    }
  }
}

export default new TransformationController();

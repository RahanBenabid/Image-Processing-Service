import Picture from "./../models/picture.model.js";

import { processImage } from "./../handlers/imageProcessor.js";
import { downloadImage } from "./../handlers/supabase.js";
import fs from "fs";

class TransfornationController {
  async tranformImage(req, res, next) {
    try {
      const imageId = req.params.id;
      const { width, height } = req.body;

      const changes = {
        width: width,
        height: height,
      };

      const image = await Picture.findById(imageId);
      if (!image) return res.status(404).json({ message: "Image not found" });

      const publicUrl = image.url;
      const path = publicUrl.split("/image-processing/")[1].replace(/^\//, "");

      //		const image_buffer = await downloadImage(path);
      const image_buffer = fs.readFileSync(
        "/Users/RahanBen/Downloads/test/67b61459f4d6322eefb4018f.jpeg",
      );

      processImage(changes, image_buffer);

      return res.status(200).send();
    } catch (err) {
      return next(err);
    }
  }
}

export default new TransfornationController();

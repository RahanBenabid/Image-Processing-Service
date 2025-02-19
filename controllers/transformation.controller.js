import Picture from "./../models/picture.model.js";

import { processImage } from './../handlers/imageProcessor.js';
import { downloadImage } from "./../handlers/supabase.js";

class TransfornationController {
	async tranformImage (req, res, next) {
		try {
			const imageId = req.params.id;
			
			const image = await Picture.findById(imageId);
			if (!image)
				return res.status(404).json({ message: "Image not found" });
			
			const publicUrl = image.url;
			const path = publicUrl.split("/image-processing/")[1].replace(/^\//, '');
			
			await downloadImage(path);
			
			return res.status(200).send();
			
		} catch (err) {
			return next(err);
		}
	};
}

export default new TransfornationController();
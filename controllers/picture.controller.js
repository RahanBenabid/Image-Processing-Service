import mongoose from "mongoose";
import Picture from './../models/picture.model.js';
import { processImage } from './processing.controller.js';


class PictureController {
	async getAllPictures (req, res, next) {
		try {
			const pictures = await Picture.find({});
			res.status(200).json(pictures);
		} catch (err) {
			return next(err);
		}
	}
	
	async getPictureById (req, res, next) {
		try {
			const pictureId = req.params.id;
			const picture = await Picture.findOne({ _id: pictureId });
			res.status(200).json({ picture: picture });
		} catch (err) {
			return next(err);
		}
	}

	// http://localhost:3000/hello/world
	
	async createPictureRequest (req, res, next) {
		try {
			let {
				path,
				filename,
				user_id,
				changes_made,
			} = req.body;
			
			/*
			TODO: decode the userId through the jwt
						get the watermark from the changes object, if the changes.watermark.add == true then look for the path or something like that
			*/
			
			processImage(changes_made);
			
			//	const decoded = jwt.verify(token, PROCESS.ENV.TOKEN_SECRET);
			//	const user_id = decoded.user_id;
			
			const newPicture = Picture({
				path: path,
				filename: filename,
				user_id: user_id,
				changes_made: changes_made,
			});
			
			const pictureRequest = await newPicture.save();
			res.status(201).json({ message: "Image processed successully", request: pictureRequest });
		} catch (err) {
			return next(err);
		}
	}
	
	async deletePictureById (req, res, next) {
		try {
			const pictureId = req.params.id;
			const result = await Picture.deleteOne({ _id: pictureId });
			if (result.deleteCount === 0) {
				return res.status(404).json({ message: "Picture not found" });
			}
 			res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}

export default new PictureController();

/*
TODO: add 	a route where it handles picture upload not just a simple HTTP request


POST /images/:id/transform
{
		"transformations": {
			"resize": {
				"width": "number",
				"height": "number"
			},
			"crop": {
				"width": "number",
				"height": "number",
				"x": "number",
				"y": "number"
			},
			"rotate": "number",
			"format": "string",
			"filters": {
				"grayscale": "boolean",
				"sepia": "boolean"
		}
	}
}

*/
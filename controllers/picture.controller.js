import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Picture from './../models/picture.model.js';
import { processImage } from './processing.controller.js';
import dotenv from "dotenv";

dotenv.config();

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
	
	async createPictureRequest (req, res, next) {
		try {
			let {
				path,
				filename,
				changes_made,
			} = req.body;
			
			const userId = req.user.userId;
			
			processImage(changes_made, path);
			
			const newPicture = Picture({
				path: path,
				filename: filename,
				user_id: userId,
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
	
	async uploadPicture (req, res, next) {
		try {
			
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
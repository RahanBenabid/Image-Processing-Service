import sharp from "sharp";
import jwt from "jsonwebtoken";

import Picture from './../models/picture.model.js';
import { processImage } from './../handlers/imageProcessor.js';
import { saveImage, deleteImage, replaceImage } from "./../handlers/supabase.js";

const getMetadata = async (file) => {
	const fileName = file.originalname;
	const fileSize = file.size;
	const format = file.originalname.split('.').pop();
	
	try {
		const metadata = await sharp(file.buffer).metadata();
		return {
			fileName,
			fileSize,
			format,
			width: metadata.width,
			height: metadata.height,
		};
	} catch (err) {
		console.error("failed to read image dimentions:", err);
		throw err;
	}
}

class PictureController {
	async getAllPictures (req, res, next) {
		try {
			const pictures = await Picture.find({});
			res.status(200).json(pictures);
		} catch (err) {
			return next(err);
		}
	};
	
	async getPictureById (req, res, next) {
		try {
			const pictureId = req.params.id;
			
			if (!pictureId || pictureId === "null" || pictureId === "undefined") {
				return res.status(400).json({ message: "No valid picture ID provided" });
			}
			
			const picture = await Picture.findOne({ _id: pictureId });
			res.status(200).json({ picture: picture });
		} catch (err) {
			return next(err);
		}
	};
	
	async uploadPicture (req, res, next) {
		try {
			if (!req.files || req.files.length === 0)
				return res.status(400).json({ error: "No file uploaded" });
			
			const userId = req.user.userId;
			
			const uploadedFiles = [];
			
			for (const file of req.files) {
				
				let metadata = await getMetadata(file);
				
				const myPicture = await Picture({
					user_id: userId,
					metadata: metadata,
				});
				
				const newPicture = await myPicture.save();
				
				const picture_id = newPicture._id;
				const file_name = `originals/${picture_id}.${metadata.format}`;
				const urlData = await saveImage(file.buffer ,file_name);
				
				await Picture.updateOne(
					{ _id: picture_id },
					{ url: urlData.publicUrl },
				);
				
				uploadedFiles.push({
					picture_id,
					url: urlData.publicUrl,
					metadata,
				});
			}
		res.status(200).json({ success: true, uploadedFiles });	
		} catch (err) {
			return next(err);
		}
	};
	
	getPublicUrl = async (req, res, next) => {
		try {
			const pictureId = req.params.id;
			const picture = await Picture.findById(pictureId);
			
			if (!picture)
				return res.status(404).json({
					message: "No matching picture found",
				});
			
			return res.status(200).json({
				success: true,
				publicUrl: picture.url,
			});
		} catch (err) {
			return next(err);
		}
	};
	
	updatePictureById = async (req, res, next) => {
		try {
			if (!req.files || req.files.length !== 1) {
				return res.status(400).json({ error: "error in file upload" });
			}
			
			let metadata = null
			
			const pictureId = req.params.id;
			
			if (!pictureId || pictureId === "null" || pictureId === "undefined") {
				return res.status(400).json({ message: "No valid picture ID provided" });
			}
			
			const picture = await Picture.findById(pictureId);
			if (!picture)
				return res.status(404).json({ error: "picture not found" });
			
			// update in the cloud
			try {
				const file = req.files[0];
				const fileBuffer = await file.buffer;
				const publicUrl = picture.url;
				const filePath = publicUrl.split("/image-processing")[1];
				
				metadata = await getMetadata(file);
				await replaceImage(filePath, fileBuffer);
			} catch (err) {
				console.error("Cloud error, couldn't update the picture: ", err.message);
				return res.status(500).json({
					message: "Failed to update from cloud storage"
				});
			}
			
			// update in the database
			const updatedPicture = await Picture.findOneAndUpdate(
				{ _id: pictureId },
				{ metadata: metadata },
				{ new: true },
			);
			
			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	};
	
	async deletePictureById (req, res, next) {
		try {
			const pictureId = req.params.id;
			
			if (!pictureId || pictureId === "null" || pictureId === "undefined") {
				return res.status(400).json({ message: "No valid picture ID provided" });
			}
			
			// delete from the cloud
			const picture = await Picture.findById(pictureId);
			
			if (!picture) {
				return res.status(404).json({
					message: "Picture not found"
				});
			}
			
			try {
				const publicUrl = picture.url;
				const path = publicUrl.split("/image-processing/")[1].replace(/^\//, '');
				const result = await deleteImage(path);
				
				if (!result.success) {
					throw new Error("Failed to delete from storage");
				}
			} catch (cloudError) {
				console.error("Cloud storage deletion failed:", cloudError);
				return res.status(500).json({
					message: "Failed to delete from cloud storage"
				});
			}
			
			// delete from MongoDB
			const result = await Picture.deleteOne({ _id: pictureId });
			if (result.deletedCount === 0) {
				return res.status(404).json({ message: "Picture not found" });
			}
			res.status(204).send();
		} catch (err) {
			return next(err);
		}
	};
	
}

export default new PictureController();

/*
TODO: add 	a route where it handles picture upload not just a simple HTTP request DONE
	- delete the picture in the database too DONE
	- get publicUrl from pic id DONE
	- Update picture using ID


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
import Picture from './../models/picture.model.js';
import mongoose from "mongoose";

export getAllPictures = async (req, res, next) => {
	try {
		const pictures = await Picture.find({});
		res.status(200).json(pictures);
	} catch (err) {
		return next(err);
	}
}

export getPictureById = async (req, res) => {
	try {
		const pictureId = req.params.id;
		const picture = await Picture.findOne({ _id: id });
		res.status(200).json({ picture: picture });
	} catch (err) {
		return next(err);
	}
}

export createPictureRequest = async (req, res) => {
	try {
		const {
			
		} = req.body;
		
		/*
		TODO: decode the userId through the jwt
		*/
		
		
	} catch (err) {
		return next(err);
	}
}
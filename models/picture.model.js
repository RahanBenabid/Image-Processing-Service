import mongoose from 'mongoose';

const pictureSchema = new mongoose.Schema({
	path: {
		type: String,
		required: true,
		allowNull: false,
	},
	filename: {
		type: String,
		required: true,
		allowNull: false,
	},
	user_id: {
		type: mongoose.Schema.types.ObjectId,
		ref: 'User',
		required: true,
		allowNull: false,
	},
	changes_made: {
		type: mongoose.Schema.types.Mixed,
		default: [],
	},
});

const Picture = mongoose.model('Picture', pictureSchema);

export default picture;
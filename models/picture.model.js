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
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: false,
		allowNull: true,
	},
	changes_made: {
		type: mongoose.Schema.Types.Mixed,
		default: [],
	},
});

const Picture = mongoose.model('Picture', pictureSchema);

export default Picture;
import mongoose from 'mongoose';

const pictureSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	url: {
		type: String,
	},
	metadata: {
		fileName: String,
		fileSize: Number,
		format: String,
		width: Number,
		height: Number,
	},
	transformations: [{     // Reference to transformations
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Transformation'
	}]
}, {
	timestamps: {
		createdAt: true,
		updatedAt: false,
	},
});

const Picture = mongoose.model('Picture', pictureSchema);

export default Picture;
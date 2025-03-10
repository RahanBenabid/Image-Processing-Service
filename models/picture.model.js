import mongoose from "mongoose";

const pictureSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    url: {
      type: String,
      validate: {
        validator: function (v) {
          // Basic URL validation
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: "URL format is invalid",
      },
    },
    metadata: {
      fileName: String,
      fileSize: Number,
      format: String,
      width: Number,
      height: Number,
    },
    transformations: [
      {
        // Reference to transformations
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transformation",
      },
    ],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

const Picture = mongoose.model("Picture", pictureSchema);

export default Picture;

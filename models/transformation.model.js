import mongoose from "mongoose";

const transformationSchema = new mongoose.Schema(
  {
    image_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Picture",
      required: true,
    },
    params: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    url: {
      type: String,
      required: false,
      allowNull: false,
    },
  },
  {
    timestamps: {
      createAt: true,
      updatedAt: false,
    },
  },
);

const Transformation = mongoose.model("Transformation", transformationSchema);

export default Transformation;

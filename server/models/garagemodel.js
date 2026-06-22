import mongoose from "mongoose";

const garageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bikeModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BikeModel",
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    variant: {
      type: String,
      default: "",
      trim: true,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

garageSchema.index({ user: 1 });
garageSchema.index({ user: 1, bikeModel: 1 });

export default mongoose.model("Garage", garageSchema);

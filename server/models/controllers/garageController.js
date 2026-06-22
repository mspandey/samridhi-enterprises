 import Garage from "../models/garageModel.js";
import Part from "../models/partModel.js";

export const addVehicle = async (req, res, next) => {
  try {
    const { bikeModel, year, variant, features, isDefault } = req.body;

    if (!bikeModel || !year) {
      return res.status(400).json({
        success: false,
        message: "Bike model and year are required",
      });
    }

    if (isDefault) {
      await Garage.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    const vehicle = await Garage.create({
      user: req.user._id,
      bikeModel,
      year,
      variant,
      features,
      isDefault,
    });

    res.status(201).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};


export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Garage.find({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      vehicles,
    });
  } catch (error) {
    next(error);
  }

};
export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Garage.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
const vehicle = await Garage.findOne({
  _id: req.params.id,
  user: req.user._id,
});
   const updatedVehicle = await Garage.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      vehicle: updatedVehicle,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Garage.findOne({
  _id: req.params.id,
  user: req.user._id,
});

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const setDefaultVehicle = async (req, res, next) => {
  try {const vehicle = await Garage.findOne({
  _id: req.params.id,
  user: req.user._id,
});

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    await Garage.updateMany(
      {
        user: vehicle.user,
      },
      {
        isDefault: false,
      }
    );

    vehicle.isDefault = true;

    await vehicle.save();

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};
export const getRecommendedProducts = async (req, res, next) => {
  try {
    const defaultVehicle = await Garage.findOne({
      user: req.user._id,
      isDefault: true,
    });

    if (!defaultVehicle) {
      return res.status(404).json({
        success: false,
        message: "No default vehicle found",
      });
    }

    const products = await Part.find({
      vehicleCompatibility: defaultVehicle.bikeModel,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

import express from "express";
import rateLimit from "express-rate-limit";
import upload from "../middleware/multer.js";
import {
  addPart,
  getAllParts,
  getPartById,
  updatePart,
  deletePart,
  createOrUpdateReview,
  deleteReview,
  getSimilarParts,
  getFrequentlyBoughtTogether,
  getRecommendedForYou,
} from "../controllers/partsControllers.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/Admin.js";


// Rate limiter for public catalogue-browsing endpoints (no auth required).
// Allows generous traffic for real shoppers while guarding against scrapers
// and incidental abuse that would hammer the database.
const browseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit to 20 requests per 15 minutes
  message: { success: false, message: "Too many admin requests, please try again later." },
});

// Slightly tighter limiter for the personalized recommendations endpoint,
// which runs several database lookups (cart + wishlist + orders) per call.
const recommendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 requests per IP per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const partRouter = express.Router();


partRouter.get("/get", browseLimiter, getAllParts);
partRouter.get("/get/:id", browseLimiter, getPartById);
partRouter.get("/get/:id/similar", browseLimiter, getSimilarParts);
partRouter.get(
  "/get/:id/frequently-bought-together",
  browseLimiter,
  getFrequentlyBoughtTogether
);
partRouter.get(
  "/recommendations/for-you",
  recommendLimiter,
  auth,
  getRecommendedForYou
);
partRouter.post("/add", adminLimiter, upload.array("images", 5), validateImageSignature, auth, admin, addPart);

partRouter.put("/update/:id", adminLimiter, upload.array("images", 5), validateImageSignature, auth, admin, updatePart);
partRouter.delete("/delete/:id", auth, admin, deletePart);
partRouter.post("/review/:id", auth, createOrUpdateReview);
partRouter.delete("/review/:id", auth, deleteReview);

export default partRouter;

// routes/authRoutes.js
import { Router } from "express";
import { body } from "express-validator";
import { register, login, getProfile, updateProfile, deleteProfile } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
    body("role").notEmpty().withMessage("Role is required"),
    body("vesselName").notEmpty().withMessage("Vessel name is required"),
    body("vesselType").notEmpty().withMessage("Vessel type is required"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/getProfile", auth, getProfile);
router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteProfile",auth, deleteProfile);

export default router;

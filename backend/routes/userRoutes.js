import { Router } from "express";
import {body} from "express-validator";
import {  listUsers, getUserById, createUser, deleteUser, updateUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import {requireRoles} from "../middleware/roles.js";

const router = Router();

router.use(auth);

//rules for the validations 

const userValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .optional({ checkFalsy: true }) // optional for updates
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["sailor", "captain", "admin"]),
  body("vesselName").notEmpty().withMessage("Vessel name is required"),
  body("vesselType").notEmpty().withMessage("Vessel type is required").isIn(["cargo", "fishing", "pleasure", "tanker", "passenger", "other"]),
  body("isActive").optional().isBoolean(),
];

// Routes
router.get("/", auth, requireRoles("admin"), listUsers);
router.get("/:id", auth, requireRoles("admin"), getUserById);
router.post("/", auth, requireRoles("admin"), userValidationRules, createUser);
router.put("/:id", auth, requireRoles("admin"), userValidationRules, updateUser);
router.delete("/:id", auth, requireRoles("admin"), deleteUser);

export default router;
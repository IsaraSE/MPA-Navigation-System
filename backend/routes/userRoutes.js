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
  body("vesselName").optional().isString(),
  body("vesselType").optional().isIn(["cargo", "tanker"]),
  body("isActive").optional().isBoolean(),
];

// Routes
router.get("/", auth, authorizeRoles("admin"), listUsers);
router.get("/:id", auth, getUserById);
router.post("/", auth, authorizeRoles("admin"), userValidationRules, createUser); 
router.put("/:id", auth, authorizeRoles("admin"), userValidationRules, updateUser);
router.delete("/:id", auth, authorizeRoles("admin"), deleteUser);

export default router;
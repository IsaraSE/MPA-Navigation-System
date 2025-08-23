import { Router } from "express";
import {body} from "express-validator";
import {  listUsers, getUserById, createUser, deleteUser, updateUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import requireRoles from "../middleware/roles.js";

const router = Router();

router.use(auth);

router.get("/", requireRoles("admin"), listUsers);
router.get("/:id", requireRoles("admin", "captain"), getUserById);
router.put("/:id", requireRoles("admin", "captain"), [
    body("role").optional().isIn(["admin", "captain", "sailor"]),
    body("vesselType").optional().isIn(["cargo", "fishing", "pleasure", "tanker", "passenger", "other"])
],
        update
    );

    router.delete("/:id", requireRoles("admin"), deleteUser);


    export default router;
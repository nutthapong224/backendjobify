import { Router } from "express";
import {
  getapplitionstats,
  getCurrentuser,
  updateUser,
} from "../controller/userController.js";
import { validateUpdateUserInput } from "../middleware/validationmiddleware.js";
import {
  authorizePermissions,
  checkforTestUser,
} from "../middleware/authmiddleware.js"; 
import multer from "multer";


const storage = multer.memoryStorage();

const upload = multer({ storage });


const router = Router();

router.get("/current-user",getCurrentuser );
router.get("/admin/app-stats", [

  getapplitionstats,
]);
router.patch(
  "/update-user",
  checkforTestUser,
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);

export default router;

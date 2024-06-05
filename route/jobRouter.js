import { Router } from "express";

const router = Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStat,
} from "../controller/jobController.js";
import { validateJobInput } from "../middleware/validationmiddleware.js";

// router.get('/', getAllJobs);
// router.post('/', createJob);
import { checkforTestUser } from "../middleware/authmiddleware.js";

router
  .route("/")
  .get(getAllJobs)
  .post(checkforTestUser, validateJobInput, createJob);
router.route("/stats").get(showStat);
router
  .route("/:id")
  .get(getJob)
  .patch(checkforTestUser, updateJob)
  .delete(checkforTestUser, deleteJob);
export default router;

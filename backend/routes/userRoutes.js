import Router from "express";
import { getMyGrievances, createGrievance, withdrawGrievance } from "../controllers/grievanceController.js";
import { protect } from "../middleware/auth.js"
import upload from "../middleware/upload.js";;

const router = Router();

router.use(protect);

router.post("/", protect, upload.single("image"), createGrievance);
router.get("/mine", protect, getMyGrievances);
router.delete("/:id", protect, withdrawGrievance);

export default router;
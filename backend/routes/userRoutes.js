import Router from "express";
import { getMyGrievances, createGrievance } from "../controllers/grievanceController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post('/', protect, createGrievance);
router.get('/mine', protect, getMyGrievances);

export default router;
import Router from "express"
import { protect, admin } from "../middleware/auth.js"
import { getAllGrievances, getStats, getAllUsers, updateGrievanceStatus } from "../controllers/adminController.js"

const router = Router()

router.use(protect);
router.use(admin);

router.get('/stats', getStats)
router.get('/users', getAllUsers)
router.get('/grievances', getAllGrievances)
router.patch(
  "/grievances/:id/status",
  protect,
  admin,
  updateGrievanceStatus,
);

export default router;
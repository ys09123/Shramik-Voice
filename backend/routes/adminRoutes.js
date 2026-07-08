import Router from "express"
import { protect, admin } from "../middleware/auth.js"
import { getAllGrievances, getStats, getAllUsers, updateGrievanceStatus, deleteGrievance } from "../controllers/adminController.js"

const router = Router()

router.use(protect);
router.use(admin);

router.get('/stats', getStats)
router.get('/users', getAllUsers)
router.get('/grievances', getAllGrievances)
router.patch("/grievances/:id/status", updateGrievanceStatus);
router.delete("/grievances/:id", deleteGrievance);

export default router;
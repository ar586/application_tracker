import express from "express";
import {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    parseJD,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/parse").post(protect, parseJD);
router.route("/").get(protect, getApplications).post(protect, createApplication);
router.route("/:id").put(protect, updateApplication).delete(protect, deleteApplication);

export default router;

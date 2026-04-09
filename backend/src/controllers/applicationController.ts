import type { Response } from "express";
import { Application } from "../models/Application.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import { parseJobDescription } from "../services/aiService.js";

// @route   POST /api/applications/parse
// @desc    Parse JD using Gemini AI
// @access  Private
export const parseJD = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            res.status(400).json({ error: "Job description is required" });
            return;
        }

        const parsedData = await parseJobDescription(jobDescription);
        res.json(parsedData);
    } catch (error: any) {
        console.error("AI Parse Error message:", error?.message);
        console.error("AI Parse Error details:", JSON.stringify(error?.errorDetails || error?.status || {}));
        console.error("Full error:", error);
        res.status(500).json({ error: "Failed to parse job description", detail: error?.message });
    }
};

// @route   GET /api/applications
// @desc    Get user applications
// @access  Private
export const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const applications = await Application.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @route   POST /api/applications
// @desc    Create an application
// @access  Private
export const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { company, role, ...rest } = req.body;

        if (!company || !role) {
            res.status(400).json({ error: "Company and role are required" });
            return;
        }

        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const application = await Application.create({
            userId: req.userId,
            company,
            role,
            ...rest,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            res.status(404).json({ error: "Application not found" });
            return;
        }

        if (application.userId.toString() !== req.userId) {
            res.status(401).json({ error: "User not authorized" });
            return;
        }

        const updatedApp = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedApp);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private
export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            res.status(404).json({ error: "Application not found" });
            return;
        }

        if (application.userId.toString() !== req.userId) {
            res.status(401).json({ error: "User not authorized" });
            return;
        }

        await application.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

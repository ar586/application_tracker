import mongoose, { Schema, Document } from "mongoose";

export type ApplicationStatus = "Applied" | "Phone Screen" | "Interview" | "Offer" | "Rejected";

export interface IApplication extends Document {
    userId: mongoose.Types.ObjectId;
    company: string;
    role: string;
    jdLink?: string;
    notes?: string;
    dateApplied: Date;
    status: ApplicationStatus;
    salaryRange?: string;

    // AI Extracted/Generated Fields
    resumeBullets?: string[];
    skills?: string[];
    seniority?: string;
    location?: string;

    // Track sorting order in the Kanban board
    order?: number;
}

const applicationSchema = new Schema<IApplication>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        company: { type: String, required: true },
        role: { type: String, required: true },
        jdLink: { type: String },
        notes: { type: String },
        dateApplied: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"],
            default: "Applied",
            required: true,
        },
        salaryRange: { type: String },
        resumeBullets: { type: [String], default: [] },
        skills: { type: [String], default: [] },
        seniority: { type: String },
        location: { type: String },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Add an index to efficiently query user applications by status
applicationSchema.index({ userId: 1, status: 1 });

export const Application = mongoose.model<IApplication>("Application", applicationSchema);

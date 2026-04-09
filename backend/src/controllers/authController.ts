import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "supersecretjwt", {
        expiresIn: "30d",
    });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Please provide email and password" });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            passwordHash,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error: any) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Server error during registration", details: error.message });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                _id: user.id,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error: any) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login", details: error.message });
    }
};

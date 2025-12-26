import type { NextFunction, Request, Response } from "express";
import {
    generateToken,
    verifyRefreshToken,
    verifyToken
} from "../services/auth.service.js";

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const token = verifyToken(req.cookies.token);
    const refreshToken = verifyRefreshToken(req.cookies.refreshToken);

    if (token && refreshToken) {
        req.user = token as any;
        next();
        return;
    }

    if (!token && refreshToken) {
        const decodedRefreshToken = refreshToken as {
            _id: string;
            email: string;
            role: any;
        };
        const newToken = generateToken({
            _id: decodedRefreshToken._id as any,
            email: decodedRefreshToken.email,
            role: decodedRefreshToken.role
        });
        res.cookie("token", newToken, { httpOnly: true });
        req.user = decodedRefreshToken as any;
        next();
        return;
    }

    if (!token && !refreshToken) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
}

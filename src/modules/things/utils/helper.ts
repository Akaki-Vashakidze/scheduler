import { JwtTokenService } from "../services/jwt-token.service";
import { Request } from "express";

export class Helper {
    public static getUserIdFromHeaderToken(req: Request | any, jwtTokenService: JwtTokenService): string {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        return jwtTokenService.getUserIdFromToken(token ?? "");
    }
}
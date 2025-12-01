import { JwtTokenService } from "../services/jwt-token.service";
import { Request } from "express";

export class Helper {
    public static getUserIdFromHeaderToken(req: Request | any, jwtTokenService: JwtTokenService): string {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        return jwtTokenService.getUserIdFromToken(token ?? "");
    }

    private static timeToMinutes(t) {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    }

    public static compareTimes(t1, t2) {
        return this.timeToMinutes(t1) - this.timeToMinutes(t2);
    }
}
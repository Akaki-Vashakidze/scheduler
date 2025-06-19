
import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtTokenService {

    constructor() { }
    getUserIdFromToken(token: string): string {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
            return decoded.userId;
        } catch (err) {
            console.error('Invalid token', err);
            return 'Invalid Token, userId not found';
        }
    }
}
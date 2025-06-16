import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/user.schema";
import { Model, ObjectId } from "mongoose";
import { SignupDto } from "../dtos/signup.dto";
import * as bcrypt from 'bcrypt';
import { ApiException } from "../classes/ApiException.class";
import { LoginDto } from "../dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from "../models/refresh-token.schema";
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>, private readonly jwtService: JwtService) { }
    async signup(signupData: SignupDto) {
        const { email, password, username, photo } = signupData;
        const emailInUse = await this.userModel.exists({ email });
        if (emailInUse) {
            return new ApiException("Email already in use", 400);
        }
        const usernameInUse = await this.userModel.exists({ username });
        if (usernameInUse) {
            return new ApiException("username already in use", 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.userModel.create({
            username,
            email,
            password: hashedPassword,
            photo
        });
    }

    async login(loginData: LoginDto) {
        const { username, password } = loginData;
        const user = await this.userModel.findOne({ username });
        if (!user) {
            return new ApiException("Invalid username or password", 400);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new ApiException("Invalid username or password", 401);
        }
        const accessToken = await this.generateToken(user._id);
        return { user, token: accessToken };
    }

    async generateToken(userId: ObjectId) {
        const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
        const refreshToken = uuidv4()
        await this.storeRefreshToken(userId, refreshToken);
        return { accessToken, refreshToken };
    }

    async storeRefreshToken(userId: ObjectId, token: string) {
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        await this.refreshTokenModel.updateOne({
            userId: userId,
        },
        { $set: { expiryDate, token } },
        { upsert: true });
    }

    async refreshTokens(refreshToken: string) {
        const token = await this.refreshTokenModel.findOne({ token: refreshToken, expiryDate: { $gt: new Date() } });
        if (!token || token.expiryDate < new Date()) {
            return new ApiException("Invalid or expired refresh token", 401);
        }
        const user = await this.userModel.findById(token.userId);
        if (!user) {
            return new ApiException("User not found", 404);
        }
        const newAccessToken = await this.generateToken(user._id);
        return { accessToken: newAccessToken.accessToken, refreshToken: newAccessToken.refreshToken, user: user._id };
    }

    async logout() {
        // Implement logout logic here
        return { message: "User logged out successfully" };
    }
}
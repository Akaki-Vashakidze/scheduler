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
import { nanoid } from 'nanoid';
import { ResetToken } from "../models/reset-token.schema";
import { MailService } from "./mail.service";

@Injectable()
export class AuthService {
    constructor(@InjectModel(ResetToken.name) private ResetTokemModel: Model<ResetToken>, private mailService:MailService, @InjectModel(User.name) private userModel: Model<User>, @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>, private readonly jwtService: JwtService) { }
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

    async changePassword( userId: ObjectId, oldPassword: string, newPassword: string ) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            return new ApiException("User not found", 404);
        }
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return new ApiException("Old password is incorrect", 400);
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return { message: "Password changed successfully" };
    }

    async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return new ApiException("Email not found", 404);
        } else {
            const resetToken = nanoid(64)
            await this.ResetTokemModel.create({
                token: resetToken,
                userId: user._id,
                expiryDate: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
            });
            this.mailService.sendMail(user.email, "Password Reset Request", `To reset your password, please click the link below:\n\nhttp://yourapp.com/reset-password?token=${resetToken}`, `<p>To reset your password, please click the link below:</p><p><a href="http://yourapp.com/reset-password?token=${resetToken}">Reset Password</a></p>`);
            return {
                message: "If this email is registered, a password reset link will be sent to it."
            };  
        }
    }

    async resetPassword(token: string, newPassword: string) {
        const resetToken = await this.ResetTokemModel.findOneAndDelete({ token, expiryDate: { $gt: new Date() } });
        if (!resetToken) {
            return new ApiException("Invalid or expired reset token", 400);
        }
        const user = await this.userModel.findById(resetToken.userId);
        if (!user) {
            return new ApiException("User not found", 404);
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        await this.ResetTokemModel.deleteOne({ _id: resetToken._id });
        return { message: "Password reset successfully" };
    }
}
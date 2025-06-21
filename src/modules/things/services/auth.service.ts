import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/user.schema";
import { Model, ObjectId } from "mongoose";
import { SignupDto } from "../dtos/signup.dto";
import * as bcrypt from 'bcrypt';
import { ApiException } from "../classes/ApiException.class";
import { LoginDto } from "../dtos/login.dto";
import * as jwt from 'jsonwebtoken';
import { AccessToken } from "../models/access-token.schema";
import { MailService } from "./mail.service";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";
import { EmailVerification } from "../models/email-verification.schema";
import { ConfirmCodeDto } from "../dtos/confirm-code.dto";

@Injectable()
export class AuthService {
    constructor(private mailService: MailService, @InjectModel(User.name) private userModel: Model<User>, @InjectModel(EmailVerification.name) private emailVerificationModel: Model<EmailVerification>, @InjectModel(AccessToken.name) private accessTokenModel: Model<AccessToken>) { }
    async signup(signupData: SignupDto) {
        let { email, password , code } = signupData;
        email = email.toLowerCase()
        const verificationRecord = await this.emailVerificationModel.findOne({
            email,
            code,
            passwordExpire: { $gt: new Date() }, // check if still valid
        });

        if (!verificationRecord) {
            return new ApiException("Email not verified or password creation time expired", 400);
        }
        const emailInUse = await this.userModel.exists({ email });
        if (emailInUse) {
            return new ApiException("Email already in use", 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            email,
            password: hashedPassword,
        });

        const accessToken = this.generateToken(user._id.toString());
        try {
            await this.storeAccessToken(user._id, await accessToken);
        } catch (err) {
            console.error('Failed to store access token:', err);
            throw new ApiException('Internal server error while creating token', 500);
        }
        return { user, token: await accessToken };
    }

    async generateToken(userId: string) {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET);
        return token;
    }

    async confirmCodeEmail(data: ConfirmCodeDto) {
        const email = data.email.toLowerCase();
        const code = data.code;

        const record = await this.emailVerificationModel.findOne({
            email,
            code,
            expiresAt: { $gt: new Date() },
        });

        if (!record) {
            return new ApiException("Invalid or expired code", 400);
        }

        const passwordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this.emailVerificationModel.updateOne(
            { _id: record._id },
            { $set: { passwordExpire } }
        );

        return ApiResponse.success('Email verified successfully');
    }

    async sendVerificationCodeEmail(email: string) {
        email = email.toLowerCase();
        const emailInUse = await this.userModel.exists({ email });
        if (emailInUse) {
            return new ApiException("Email already in use", 400);
        }
        const existing = await this.emailVerificationModel.findOne({
            email,
            expiresAt: { $gt: new Date() }, // not expired
        });
        if (existing) {
            const now = new Date();
            const expiresInMs = existing.expiresAt.getTime() - now.getTime();
            const expiresInSec = Math.floor(expiresInMs / 1000);

            return ApiResponse.success({ message: `Verification code already sent. You can send new one in ${expiresInSec} seconds.`, alreadySent: true });
        }
        const code = Math.floor(1000 + Math.random() * 9000).toString();

        // Set expiration time (e.g. 2 minutes from now)
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await this.emailVerificationModel.create({ email, code, expiresAt });

        await this.mailService.sendMail(
            email,
            `Your Verification Code`,
            `To continue registration, please use this code on the website: ${code}`
        );

        return ApiResponse.success('Verification code sent to email');
    }


    async login(loginData: LoginDto) {
        let { email, password } = loginData;
        let user = await this.userModel.findOne({ email });
        if (!user) {
            email = email.toLowerCase();
            user = await this.userModel.findOne({ email: email });
        }
        if (!user) {
            return new ApiException("Invalid email or password", 400);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new ApiException("Invalid email or password", 401);
        }
        const accessToken = this.generateToken(user._id.toString());
        try {
            await this.storeAccessToken(user._id, await accessToken);
        } catch (err) {
            console.error('Failed to store access token:', err);
            throw new ApiException('Internal server error while creating token', 500);
        }
        return { user, token: await accessToken };
    }

    async storeAccessToken(user: ObjectId, token: string) {
        const expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

        await this.accessTokenModel.updateOne(
            { user }, // match by userId only
            { $set: { token, expiryDate } },
            { upsert: true } // create if doesn't exist
        );
    }

    async checkAccessToken(token: string) {

        const tokenDoc = await this.accessTokenModel.findOne({ token }).populate('userId');

        if (!tokenDoc) {
            return false; // token not found
        }

        const now = new Date();
        if (tokenDoc.expiryDate > now) {
            return { token: tokenDoc }; // token is still valid
        }

        return false; // token expired
    }

    async logout(userId: ObjectId) {
        await this.accessTokenModel.deleteOne({ userId });
        return { message: "User logged out successfully" };
    }

    async changePassword(userId: ObjectId, oldPassword: string, newPassword: string) {
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

            const accessToken = this.generateToken(user._id.toString());
            await this.accessTokenModel.create({
                token: accessToken,
                user: user._id,
                expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hour
            });
            this.mailService.sendMail(user.email, "Password Reset Request", `To reset your password, please click the link below:\n\nhttp://yourapp.com/reset-password?token=${accessToken}`, `<p>To reset your password, please click the link below:</p><p><a href="http://yourapp.com/reset-password?token=${accessToken}">Reset Password</a></p>`);
            return {
                message: "If this email is registered, a password reset link will be sent to it."
            };
        }
    }

    async resetPassword(token: string, newPassword: string) {
        const accessToken = await this.accessTokenModel.findOneAndDelete({ token, expiryDate: { $gt: new Date() } });
        if (!accessToken) {
            return new ApiException("Invalid or expired reset token", 400);
        }
        const user = await this.userModel.findById(accessToken.user);
        if (!user) {
            return new ApiException("User not found", 404);
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        await this.accessTokenModel.deleteOne({ _id: accessToken._id });
        return { message: "Password reset successfully" };
    }
}
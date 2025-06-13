import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/user.schema";
import { Model } from "mongoose";
import { SignupDto } from "../dtos/signup.dto";
import * as bcrypt from 'bcrypt';
import { ApiException } from "../classes/ApiException.class";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    async signup(signupData: SignupDto) {
        const { email, password, username } = signupData;
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
        });
    }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new ApiException("Invalid email or password", 400);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiException("Invalid email or password", 401);
        }
        return { message: "User logged in successfully" };
    }

    async logout() {
        // Implement logout logic here
        return { message: "User logged out successfully" };
    }
}
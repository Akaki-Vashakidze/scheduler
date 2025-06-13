import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/user.schema";
import { Model } from "mongoose";
import { SignupDto } from "../dtos/signup.dto";
import * as bcrypt from 'bcrypt';
import { ApiException } from "../classes/ApiException.class";
import { LoginDto } from "../dtos/login.dto";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    async signup(signupData: SignupDto) {
        const { email, password, username , photo} = signupData;
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

    async login(loginData:LoginDto) {
        const {username, password} = loginData;
        const user = await this.userModel.findOne({ username });
        if (!user) {
            return new ApiException("Invalid username or password", 400);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new ApiException("Invalid username or password", 401);
        }
        return { user };
    }

    async logout() {
        // Implement logout logic here
        return { message: "User logged out successfully" };
    }
}
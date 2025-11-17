import { Injectable } from '@nestjs/common';
import { User } from '../models/user.schema';
import { ApiResponse } from 'src/modules/base/classes/ApiResponse.class';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getUsers(searchQuery: string): Promise<ApiResponse<User[]>> {
        const users = await this.userModel.find(
            {
                email: { $regex: searchQuery, $options: 'i' },
                "record.state": 1,
                isActive: true,
                "record.isDeleted": { $ne: true }
            },
            {
                email: 1,
                _id: 1
            }
        ).exec();

        return ApiResponse.success(users);
    }
}
import { Injectable } from '@nestjs/common';
import { User } from '../models/user.schema';
import { ApiResponse } from 'src/modules/base/classes/ApiResponse.class';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getUsers(searchQuery: string, userId: string): Promise<ApiResponse<User[]>> {
    const users = await this.userModel.find(
        {
            email: { $regex: searchQuery, $options: 'i' },
            "record.state": 1,
            "record.isDeleted": { $ne: true },
            _id: { $ne: new mongoose.Types.ObjectId(userId) }
        },
        {
            email: 1,
            _id: 1
        }
    ).exec();

    return ApiResponse.success(users);
}
}
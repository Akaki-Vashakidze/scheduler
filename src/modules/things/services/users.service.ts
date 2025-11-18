import { Injectable } from '@nestjs/common';
import { User } from '../models/user.schema';
import { ApiResponse } from 'src/modules/base/classes/ApiResponse.class';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RequestContact } from '../models/requestContact.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(RequestContact.name) private requestContactModel: Model<RequestContact>) { }

    async getUsers(searchQuery: string, userId: string): Promise<ApiResponse<User[]>> {
        if (!searchQuery || searchQuery.trim() === '') {
            return ApiResponse.success([]);
        }

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

    async createContactRequest(userId: string, contactId: string): Promise<ApiResponse<RequestContact[]>> {
        const existingRequest = await this.requestContactModel.findOne({
            requester: new mongoose.Types.ObjectId(userId),
            contact: new mongoose.Types.ObjectId(contactId),
        });

        if (existingRequest) {
            return ApiResponse.error('Contact request already exists', 400);
        }

        const newRequest = new this.requestContactModel({
            requester: new mongoose.Types.ObjectId(userId),
            contact: new mongoose.Types.ObjectId(contactId),
        });

        await newRequest.save();

        return ApiResponse.success(newRequest);
    }

    async getMyContactRequests(userId: string): Promise<ApiResponse<RequestContact[]>> {
        const requests = await this.requestContactModel.find({
            contact: new mongoose.Types.ObjectId(userId),
        }).populate('requester', 'email');

        return ApiResponse.success(requests);
    }

    async getSentContactRequests(userId: string): Promise<ApiResponse<RequestContact[]>> {
        const requests = await this.requestContactModel.find({
            requester: new mongoose.Types.ObjectId(userId),
        }).populate('contact', 'email');

        return ApiResponse.success(requests);
    }

    async deleteContactRequest(requestId: string, userId: string): Promise<ApiResponse<null>> {
        const request = await this.requestContactModel.findById(requestId);

        if (!request) {
            return ApiResponse.error('Contact request not found', 404);
        }

        if (request.contact?.toString() !== userId || request.requester?.toString() !== userId) {
            return ApiResponse.error('Unauthorized', 403);
        }

        await this.requestContactModel.deleteOne({ _id: requestId });

        return ApiResponse.success(null);
    }       

}
import { Injectable } from '@nestjs/common';
import { User } from '../models/user.schema';
import { ApiResponse } from 'src/modules/base/classes/ApiResponse.class';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RequestContact } from '../models/requestContact.schema';
import { UserContact } from '../models/contacts.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel(UserContact.name) private userContactstModel: Model<UserContact>, @InjectModel(User.name) private userModel: Model<User>, @InjectModel(RequestContact.name) private requestContactModel: Model<RequestContact>) { }

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

        if (
            request.contact?.toString() !== userId &&
            request.requester?.toString() !== userId
        ) {
            return ApiResponse.error('Unauthorized', 403);
        }

        await this.requestContactModel.deleteOne({ _id: requestId });

        return ApiResponse.success(null);
    }

async deleteContact(contactId: string, userId: string): Promise<ApiResponse<null>> {
    const ownerIdObj = new mongoose.Types.ObjectId(userId);
    const contactIdObj = new mongoose.Types.ObjectId(contactId);

    const result = await this.userContactstModel.deleteMany({
        $or: [
            { owner: ownerIdObj, contact: contactIdObj },
            { owner: contactIdObj, contact: ownerIdObj }
        ]
    }).exec();

    if (result.deletedCount === 0) {
        return ApiResponse.error('Contact not found', 404);
    }

    return ApiResponse.success(null);
}




    async acceptContactRequest(userId: string, requestId: string): Promise<ApiResponse<any>> {
        const reqId = new mongoose.Types.ObjectId(requestId);
        const userIdObj = new mongoose.Types.ObjectId(userId);

        const request = await this.requestContactModel.findOne({
            _id: reqId,
            contact: userIdObj
        }).exec();

        if (!request) {
            return ApiResponse.error('Contact request not found', 404);
        }

        const contactIdObj = new mongoose.Types.ObjectId(request.requester);

        let deleted = await this.deleteContactRequest(requestId, userId);

        if (deleted.statusCode != 200) {
            return ApiResponse.error('error happened while deleting the contact request', 404);
        }

        const existing = await this.userContactstModel.findOne({
            owner: userIdObj,
            contact: contactIdObj
        });

        if (existing) {
            return ApiResponse.error('Contact is already added', 400);
        }

        const contactA = new this.userContactstModel({
            owner: userIdObj,
            contact: contactIdObj,
            isFavorite: false,
            isBlocked: false
        });

        await contactA.save();

        const contactB = new this.userContactstModel({
            owner: contactIdObj,
            contact: userIdObj,
            isFavorite: false,
            isBlocked: false
        });

        await contactB.save();

        return ApiResponse.success({
            userA: contactA,
            userB: contactB
        });
    }

    async getContacts(userId: string): Promise<ApiResponse<UserContact[]>> {
        const contacts = await this.userContactstModel.find({
            owner: new mongoose.Types.ObjectId(userId),
        })
        .populate('contact', 'email');

        return ApiResponse.success(contacts);
    }

}
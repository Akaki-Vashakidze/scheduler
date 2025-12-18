import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Invitation } from "../models/invitation.schema";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";
import { User } from "../models/user.schema";
import { UserContact } from "../models/contacts.schema";
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ScheduleService {

    constructor(@InjectModel(UserContact.name) private userContactModel: Model<UserContact>, @InjectModel(Invitation.name) private invitationModel: Model<Invitation>, @InjectModel(User.name) private userModel: Model<User>) { }

    async getScheduleInvitations(userId: string, subjectuserId: string): Promise<ApiResponse<any>> {
        const userobjId = new mongoose.Types.ObjectId(userId);
        const subjectuserObjId = new mongoose.Types.ObjectId(subjectuserId);

        const isContact = await this.userContactModel.findOne({
            owner: userobjId,
            contact: subjectuserObjId
        });

        if (!isContact) {
            return ApiResponse.error('This user is not your contact', 400);
        }

        const invitations = await this.invitationModel.find({
            approved: 1,
            $or: [
                { invitee: subjectuserObjId },
                { inviter: subjectuserObjId }
            ]
        }).exec();
        return ApiResponse.success(invitations);
    }

    async getMyScheduleInvitations(userId: string): Promise<ApiResponse<any>> {
        const userObjId = new mongoose.Types.ObjectId(userId);

        const invitations = await this.invitationModel.find({
            approved: 1,
            $or: [
                { invitee: userObjId },
                { inviter: userObjId }
            ]
        }).exec();

        return ApiResponse.success(invitations);
    }

}
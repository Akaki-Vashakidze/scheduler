import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Invitation } from "../models/invitation.schema";
import { Model } from "mongoose";
import { invitationDto } from "../dtos/invitation.dto";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";
import { User } from "../models/user.schema";

@Injectable()
export class InvitationService {

    constructor(@InjectModel(Invitation.name) private invitationModel: Model<Invitation>, @InjectModel(User.name) private userModel: Model<User>) { }

    async invite(invitationData: invitationDto, userId: string): Promise<ApiResponse<Invitation>> {
    const inviteeExists = await this.userModel.exists({ _id: invitationData.invitee });
    if (!inviteeExists) {
        return ApiResponse.error('Invitee does not exist', 404);
    }
    
    // Check duplicate invitation
    const existing = await this.invitationModel.findOne({
        inviter: userId,
        invitee: invitationData.invitee,
        weekday: invitationData.weekday,
        time: invitationData.time,
        active: true
    });

    if (existing) {
        return ApiResponse.error('You have already sent an invitation at this time', 404);
    }

    const approved = invitationData.invitee == userId ? true : false;

    const newInvitation = new this.invitationModel({
        ...invitationData,
        inviter: userId,
        approved,
        active: true,
        canceled: false,
    });

    const saved = await newInvitation.save();
    return ApiResponse.success(saved);
}


    async getInvitationsByUser(userId: string): Promise<ApiResponse<Invitation[]>> {
        const invitations = await this.invitationModel.find({ invitee: userId }).exec();
        return ApiResponse.success(invitations);
    }

    async getInvitationsProposed(userId: string): Promise<ApiResponse<Invitation[]>> {
        const invitations = await this.invitationModel.find({ inviter: userId }).exec();
        return ApiResponse.success(invitations);
    }

    async editInvitation(invitationData: invitationDto, invitationId: string): Promise<ApiResponse<Invitation>> {
        const updatedInvitation = await this.invitationModel.findByIdAndUpdate(invitationId, { ...invitationData, updated: true, approved: false }, { new: true }).exec();
        return ApiResponse.success(updatedInvitation);
    }

    async cancelInvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
        const updatedInvitation = await this.invitationModel.findByIdAndUpdate(invitationId, { canceled: true }, { new: true }).exec();
        return ApiResponse.success(updatedInvitation);
    }

    async removeInvitation(userId: string, invitationId: string): Promise<ApiResponse<null>> {
    const invitation = await this.invitationModel.findById(invitationId).exec();

    if (!invitation) {
        return ApiResponse.error('Invitation not found', 404);
    }

    if (invitation.inviter.toString() !== userId) {
        return ApiResponse.error('You are not allowed to delete this invitation', 403);
    }
    await this.invitationModel.findByIdAndDelete(invitationId).exec();

    return ApiResponse.success('Invitation successfully deleted');
    }

    async remindInvitation(invitationId: string): Promise<ApiResponse<null>> {
        await this.invitationModel.findByIdAndUpdate(invitationId, { reminder: true }, { new: true }).exec();
        return ApiResponse.success('invitation successfully updated');
    }
}
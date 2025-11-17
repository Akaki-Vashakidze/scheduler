import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Invitation } from "../models/invitation.schema";
import { Model } from "mongoose";
import { ScheduleMeetDto } from "../dtos/schedule-meet.dto";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";

@Injectable()
export class InvitationService {

    constructor(@InjectModel(Invitation.name) private invitationModel: Model<Invitation>) { }

    async invite(invitationData: ScheduleMeetDto, userId: string): Promise<ApiResponse<Invitation>> {
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

    const newSchedule = new this.invitationModel({
        ...invitationData,
        inviter: userId,
        approved,
        active: true,
    });

    const saved = await newSchedule.save();
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

    async editInvitation(invitationData: ScheduleMeetDto, invitationId: string): Promise<ApiResponse<Invitation>> {
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
        return ApiResponse.success('Schedule successfully updated');
    }
}
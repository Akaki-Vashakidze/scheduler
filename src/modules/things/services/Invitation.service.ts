import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Invitation } from "../models/invitation.schema";
import { Model } from "mongoose";
import { invitationDto } from "../dtos/invitation.dto";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";
import { User } from "../models/user.schema";
import { GetInvitationsDto } from "../dtos/getInvitations.dto";
import { Approved } from "../enums/shared.enums";

@Injectable()
export class InvitationService {

    constructor(@InjectModel(Invitation.name) private invitationModel: Model<Invitation>, @InjectModel(User.name) private userModel: Model<User>) { }

    async invite(invitationData: invitationDto, userId: string): Promise<ApiResponse<Invitation>> {
        const inviteeExists = await this.userModel.exists({ _id: invitationData.invitee });
        if (!inviteeExists) {
            return ApiResponse.error('Invitee does not exist', 404);
        }

        const existing = await this.invitationModel.findOne({
            inviter: userId,
            invitee: invitationData.invitee,
            weekday: invitationData.weekday,
            time: invitationData.time,
            "record.state"  : 1
        });

        if (existing) {
            return ApiResponse.error('You have already sent an invitation at this time', 404);
        }

        const approved = invitationData.invitee == userId ? 1 : 0;

        const newInvitation = new this.invitationModel({
            ...invitationData,
            inviter: userId,
            approved,
            active: 1,
            canceled: 0,
        });

        const saved = await newInvitation.save();
        return ApiResponse.success(saved);
    }

    async getInvitationsByUser(
        userId: string,
        getInvitationsData: GetInvitationsDto
    ): Promise<ApiResponse<Invitation[]>> {

        const filter: any = { invitee: userId };

        if (getInvitationsData.location) {
            filter.location = getInvitationsData.location;
        }

        if (getInvitationsData.weekday) {
            filter.weekday = getInvitationsData.weekday;
        }

        if (getInvitationsData.approved !== undefined) {
            filter.approved = getInvitationsData.approved;
        }

        if (getInvitationsData.urgent !== undefined) {
            filter.urgent = getInvitationsData.urgent;
        }

        if (getInvitationsData.active !== undefined) {
            filter['record.state'] = getInvitationsData.active;
        }

        if (getInvitationsData.specificDate) {
            filter.specificDate = getInvitationsData.specificDate;
        }

        if (getInvitationsData.searchQuery) {
            const regex = { $regex: getInvitationsData.searchQuery, $options: 'i' };
            filter.$or = [
                { title: regex },
                { location: regex },
                { weekday: regex },
            ];
        }

        const invitations = await this.invitationModel.find(filter).exec();
        return ApiResponse.success(invitations);
    }

    async getInvitationsProposed(userId: string): Promise<ApiResponse<Invitation[]>> {
        const invitations = await this.invitationModel.find({ inviter: userId }).exec();
        return ApiResponse.success(invitations);
    }

    async editInvitation(invitationData: invitationDto, invitationId: string): Promise<ApiResponse<Invitation>> {
        const updatedInvitation = await this.invitationModel.findByIdAndUpdate(invitationId, { ...invitationData, updated: 1, approved: 0 }, { new: true }).exec();
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

    async remindInvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
        await this.invitationModel.findByIdAndUpdate(invitationId, { reminder: true }, { new: true }).exec();
        return ApiResponse.success('invitation successfully updated');
    }

    async acceptInvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
        const updated = await this.invitationModel.findByIdAndUpdate(
            invitationId,
            { approved: 1 },
            { new: true }
        ).exec();

        return ApiResponse.success(updated);
    }

    async declinenvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
        const updated = await this.invitationModel.findByIdAndUpdate(
            invitationId,
            { approved: -1 },
            { new: true }
        ).exec();

        return ApiResponse.success(updated);
    }
}
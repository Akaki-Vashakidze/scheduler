import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Invitation } from "../models/invitation.schema";
import { isValidObjectId, Model } from "mongoose";
import { InvitationArrayDto, InvitationDto } from "../dtos/invitation.dto";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";
import { User } from "../models/user.schema";
import { GetInvitationsDto } from "../dtos/getInvitations.dto";
import { Approved } from "../enums/shared.enums";
import { getMySentInvitationsDto } from "../dtos/getMySentInvitations.dto";

@Injectable()
export class InvitationService {

    constructor(@InjectModel(Invitation.name) private invitationModel: Model<Invitation>, @InjectModel(User.name) private userModel: Model<User>) { }

    async invite(invitationData: InvitationArrayDto, userId: string): Promise<ApiResponse<Invitation[]>> {
        const invitations = invitationData.invitations;
        // 1. VALIDATE INVITEE EXISTS FOR ALL
        for (const inv of invitations) {
            if (inv.invitee && isValidObjectId(inv.invitee)) {
                const inviteeExists = await this.userModel.exists({ _id: inv.invitee });
                if (!inviteeExists) {
                    return ApiResponse.error(`Invitee ${inv.invitee} does not exist`, 404);
                }
            }
        }

        // result collector
        const savedInvitations: Invitation[] = [];

        for (const inv of invitations) {

            // 2. CHECK IF THIS USER ALREADY SENT THIS INVITATION
            if (inv.invitee && isValidObjectId(inv.invitee)) {
                let invitationAlreadySent;

                if (inv.isSingleUse) {
                    invitationAlreadySent = await this.invitationModel.findOne({
                        inviter: userId,
                        invitee: inv.invitee,
                        date: inv.date,
                        startHour: inv.startHour,
                        startMinute: inv.startMinute,
                        "record.state": 1
                    });
                } else {
                    invitationAlreadySent = await this.invitationModel.findOne({
                        inviter: userId,
                        invitee: inv.invitee,
                        weekday: inv.weekday,
                        startHour: inv.startHour,
                        startMinute: inv.startMinute,
                        "record.state": 1
                    });
                }

                if (invitationAlreadySent) {
                    return ApiResponse.error(
                        `You have already sent an invitation at ${inv.startHour}:${inv.startMinute} (${inv.weekday ?? inv.date})`,
                        400
                    );
                }
            }
            // 3. CHECK IF INVITEE IS BUSY (STRICT OVERLAP)
            let inviteeIsBusy;

            const overlapQuery = {
                invitee: (inv.invitee && isValidObjectId(inv.invitee)) ? inv.invitee : userId,
                "record.state": 1,
                $or: [
                    { startHour: { $gt: inv.startHour, $lt: inv.endHour }, startMinute: { $gte: inv.startMinute, $lt: inv.endMinute } },
                    { endHour: { $gt: inv.startHour, $lt: inv.endHour }, endMinute: { $gt: inv.startMinute, $lte: inv.endMinute } }
                ]
            };

            if (inv.isSingleUse) {
                inviteeIsBusy = await this.invitationModel.findOne({
                    ...overlapQuery,
                    date: inv.date
                });
            } else {
                inviteeIsBusy = await this.invitationModel.findOne({
                    ...overlapQuery,
                    weekday: inv.weekday
                });
            }

            if (inviteeIsBusy) {
                if (inv.isSingleUse) {
                    return ApiResponse.error(
                        `Hey, he is busy from ${inviteeIsBusy.start} to ${inviteeIsBusy.end}`,
                        400
                    );
                } else {
                    return ApiResponse.error(
                        `Hey, he is busy from ${inviteeIsBusy.start} to ${inviteeIsBusy.end} on ${inviteeIsBusy.weekday}`,
                        400
                    );
                }
            }

            // 4. CREATE THE INVITATION
            const approved = (inv.invitee && isValidObjectId(inv.invitee)) ? 0 : 1;

            const newInvitation = new this.invitationModel({
                ...inv,
                inviter: userId,
                invitee: (inv.invitee && isValidObjectId(inv.invitee)) ? inv.invitee : userId,
                approved,
                active: 1,
                canceled: 0,
            });

            const saved = await newInvitation.save();
            savedInvitations.push(saved);
        }

        // 5. RETURN ALL SAVED INVITATIONS
        return ApiResponse.success(savedInvitations);
    }

    async getMySentInvitations(
        userId: string,
        getMySentInvitationsData: getMySentInvitationsDto
    ): Promise<ApiResponse<Invitation[]>> {

        const query: any = {
            inviter: userId,
            approved: 0
        };

        if (getMySentInvitationsData.active !== undefined) {
            query['record.state'] = getMySentInvitationsData.active;
        }

        if (getMySentInvitationsData.urgent !== undefined) {
            query.urgent = getMySentInvitationsData.urgent;
        }

        if (getMySentInvitationsData.approved !== undefined) {
            query.approved = getMySentInvitationsData.approved;
        }

        if (getMySentInvitationsData.location) {
            query.location = getMySentInvitationsData.location;
        }

        const invitations = await this.invitationModel.find(query).populate({
            path: 'invitee',
            select: '-password'
        }).exec();

        return ApiResponse.success(invitations);
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
            filter.date = getInvitationsData.specificDate;
        }

        if (getInvitationsData.searchQuery) {
            const regex = { $regex: getInvitationsData.searchQuery, $options: 'i' };
            filter.$or = [
                { title: regex },
                { location: regex },
                { weekday: regex },
            ];
        }

        const invitations = await this.invitationModel.find(filter).populate({
            path: 'inviter',
            select: '-password'
        }).exec();
        return ApiResponse.success(invitations);
    }

    async getInvitationsProposed(userId: string): Promise<ApiResponse<Invitation[]>> {
        const invitations = await this.invitationModel.find({ inviter: userId }).exec();
        return ApiResponse.success(invitations);
    }

    async editInvitation(invitationData: InvitationDto, invitationId: string): Promise<ApiResponse<Invitation>> {
        const updatedInvitation = await this.invitationModel.findByIdAndUpdate(invitationId, { ...invitationData, updated: 1, approved: 0 }, { new: true }).exec();
        return ApiResponse.success(updatedInvitation);
    }

    async cancelInvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
        const updatedInvitation = await this.invitationModel.findByIdAndUpdate(invitationId, { canceled: 1 }, { new: true }).exec();
        return ApiResponse.success(updatedInvitation);
    }

    async reactivateMySentInvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
        const updatedInvitation = await this.invitationModel.findByIdAndUpdate(invitationId, { canceled: 0 }, { new: true }).exec();
        return ApiResponse.success(updatedInvitation);
    }

    async removeMySentInvitation(userId: string, invitationId: string): Promise<ApiResponse<null>> {
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
        await this.invitationModel.findByIdAndUpdate(invitationId, { reminder: 1 }, { new: true }).exec();
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
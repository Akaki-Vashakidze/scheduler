import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Invitation } from "../models/invitation.schema";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";
import { User } from "../models/user.schema";
import { UserContact } from "../models/contacts.schema";
import mongoose, { Model, Types } from 'mongoose';
import { Team } from "../models/team.schema";

@Injectable()
export class ScheduleService {

    constructor(@InjectModel(UserContact.name) private userContactModel: Model<UserContact>, @InjectModel(Team.name) private teamModel: Model<Team>, @InjectModel(Invitation.name) private invitationModel: Model<Invitation>, @InjectModel(User.name) private userModel: Model<User>) { }

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

    async getTeamSchedule(teamId: string, userId: string): Promise<ApiResponse<any>> {
        const team = await this.teamModel.findById(teamId);

        if (!team) {
            return ApiResponse.error('Team not found', 404);
        }

        const teamMembers: Types.ObjectId[] = [
            ...team.members,
            team.leader
        ];

        const invitations = await this.invitationModel.aggregate([
            {
                $match: {
                    approved: 1,
                    $or: [
                        { invitee: { $in: teamMembers } },
                        { inviter: { $in: teamMembers } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'invitee',
                    foreignField: '_id',
                    as: 'invitee'
                }
            },
            { $unwind: '$invitee' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'inviter',
                    foreignField: '_id',
                    as: 'inviter'
                }
            },
            { $unwind: '$inviter' },
            {
                $project: {
                    'invitee.password': 0,
                    'inviter.password': 0
                }
            },
            {
                $group: {
                    _id: {
                        title: "$title",
                        inviter: "$inviter._id",
                        date: "$date",
                        weekday:"$weekday"
                    },
                    originalDoc: { $first: "$$ROOT" },
                    meetParticipants: { $push: "$invitee" }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$originalDoc", { meetParticipants: "$meetParticipants" }]
                    }
                }
            },
            {
                $project: {
                    invitee: 0
                }
            }
        ]);

        return ApiResponse.success(invitations);
    }



}
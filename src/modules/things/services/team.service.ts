import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Team } from "../models/team.schema";
import { UserContact } from "../models/contacts.schema";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";

@Injectable()
export class TeamService {

    constructor(@InjectModel(Team.name) private teamModel: Model<Team>, @InjectModel(UserContact.name) private userContactModel: Model<UserContact>) { }

    async createTeam(
        leaderId: string,
        memberIds: string[],
        title: string
    ): Promise<ApiResponse<Team>> {
        const leaderObjectId = new Types.ObjectId(leaderId);

        const uniqueMemberIds = [...new Set(memberIds)]
            .filter(id => id !== leaderId)
            .map(id => new Types.ObjectId(id));

        const validContacts = await this.userContactModel.find({
            owner: leaderObjectId,
            contact: { $in: uniqueMemberIds }
        }).select('contact');

        const validatedMemberIds = validContacts.map(c => c.contact);

        const team = new this.teamModel({
            leader: leaderObjectId,
            members: validatedMemberIds,
            title
        });

        const savedTeam = await team.save();

        return ApiResponse.success(savedTeam);
    }

    async getTeamsByUserId(userId: string): Promise<ApiResponse<Team[]>> {
        const userObjectId = new Types.ObjectId(userId);

        const teams = await this.teamModel.find({
            $or: [
                { leader: userObjectId },
                { members: userObjectId }
            ]
        });

        return ApiResponse.success(teams);
    }
}
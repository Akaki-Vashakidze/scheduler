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

        const teams = await this.teamModel
            .find({
                $or: [
                    { leader: userObjectId },
                    { members: userObjectId }
                ]
            })
            .populate('leader', 'name surname email')
            .populate('members', 'name surname email');

        return ApiResponse.success(teams);
    }

    async removeMemberFromTeam(teamId: string, memberId: string, userId: string): Promise<ApiResponse<Team>> {
        const team = await this.teamModel.findById(teamId);
        if (!team) {
            return ApiResponse.error('Team not found', 404);
        }

        const isMyTeam = team.leader.equals(new Types.ObjectId(userId));
        if (!isMyTeam) {
            return ApiResponse.error('You are not authorized to remove this member', 403);
        }

        const memberObjectId = new Types.ObjectId(memberId);
        team.members = team.members.filter(m => !m.equals(memberObjectId));

        const updatedTeam = await team.save();
        return ApiResponse.success(updatedTeam);
    }   

    async deleteTeam(teamId: string, userId: string): Promise<ApiResponse<null>> {
        const team = await this.teamModel.findById(teamId);     
        if (!team) {
            return ApiResponse.error('Team not found', 404);
        }

        const isMyTeam = team.leader.equals(new Types.ObjectId(userId));
        if (!isMyTeam) {
            return ApiResponse.error('You are not authorized to delete this team', 403);
        }

        await this.teamModel.deleteOne({ _id: teamId });
        return ApiResponse.success(null);   
    }

    async giveLeadership(teamId: string, newLeaderId: string, userId: string): Promise<ApiResponse<Team>> {
        const team = await this.teamModel.findById(teamId);
        if (!team) {
            return ApiResponse.error('Team not found', 404);
        }

        const isMyTeam = team.leader.equals(new Types.ObjectId(userId));
        if (!isMyTeam) {
            return ApiResponse.error('You are not authorized to give leadership', 403);
        }

        const newLeaderObjectId = new Types.ObjectId(newLeaderId);

        team.leader = newLeaderObjectId;

        team.members.push(new Types.ObjectId(userId));

        team.members = team.members.filter(
            memberId => !memberId.equals(newLeaderObjectId)
        );

        const updatedTeam = await team.save();
        return ApiResponse.success(updatedTeam);
    }


    async addMemberToTeam(teamId: string, memberId: string, userId: string): Promise<ApiResponse<Team>> {
        const team = await this.teamModel.findById(teamId);
        if (!team) {
            return ApiResponse.error('Team not found', 404);
        }

        const isMyTeam = team.leader.equals(new Types.ObjectId(userId));
        if (!isMyTeam) {
            return ApiResponse.error('You are not authorized to add members', 403);
        }

        const memberObjectId = new Types.ObjectId(memberId);
        if (team.members.includes(memberObjectId) || team.leader.equals(memberObjectId)) {
            return ApiResponse.error('User is already a member of the team', 400);
        }

        team.members.push(memberObjectId);
        const updatedTeam = await team.save();
        return ApiResponse.success(updatedTeam);
    }   

}
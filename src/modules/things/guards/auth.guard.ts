import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessToken } from '../models/access-token.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(AccessToken.name)
    private accessTokenModel: Model<AccessToken>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenDoc = await this.accessTokenModel.findOne({ token , expiryDate: { $gt: new Date() } });
      if (!tokenDoc) {
        throw new UnauthorizedException('Invalid token');
      }
      request.userId = tokenDoc.user; // set userId to request
    } catch (error) {
      Logger.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers['authorization']?.split(' ')[1]
        return authHeader
    }
}


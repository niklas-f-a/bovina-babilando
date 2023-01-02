import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './db';
import { AuthFrom } from '@app/shared/config';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserById(id: string, authFrom: AuthFrom) {
    return authFrom === AuthFrom.GITHUB_ID
      ? await this.userModel.findOne({ githubId: id }).exec()
      : await this.userModel.findById(id).exec();
  }

  async findOrCreate(details: User, authFrom: AuthFrom) {
    const user = await this.findUserById(details.githubId, authFrom);
    if (user) return user;

    return await this.createUser(details);
  }

  async createUser(details: User) {
    return this.userModel.create(details);
  }
}

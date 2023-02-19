import * as bcrypt from 'bcrypt';
import { SignUpDto } from '@app/shared/dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, User, UserDocument } from './db';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(details: SignUpDto) {
    try {
      return await new this.userModel({
        ...details,
        password: (details.password = await bcrypt.hash(details.password, 10)),
      }).save();
    } catch (error) {
      if (error.code === 11000) {
        return new ConflictException('User with email already exist');
      }
      return error;
    }
  }

  findByEmail(email: string, selectOptions?: string) {
    return this.userModel.findOne({ email }).select('+' + selectOptions);
  }

  findByGithubId(githubId: string) {
    return this.userModel.findOne({ githubId }).exec();
  }

  async findByGithubIdOrCreate(user: Partial<IUser>) {
    const foundUser = await this.findByGithubId(user.githubId);

    if (foundUser) return foundUser;

    return await this.userModel.create(user);
  }

  async addChatRoom({
    userId,
    chatRoomId,
  }: {
    userId: string;
    chatRoomId: string;
  }) {
    const user = await this.userModel.findById(userId).exec();
    user.chatRooms.push(+chatRoomId);

    return user.save();
  }

  async deleteChatRoom({ userId, roomId }: { userId: string; roomId: number }) {
    const user = await this.userModel.findById(userId).exec();

    user.chatRooms = user.chatRooms.filter((room) => room !== Number(roomId));
    user.save();
  }
}

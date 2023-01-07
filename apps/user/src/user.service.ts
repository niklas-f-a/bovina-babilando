import { SignUpDto } from '@app/shared/dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './db';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(details: SignUpDto) {
    try {
      return await new this.userModel({
        ...details,
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
}

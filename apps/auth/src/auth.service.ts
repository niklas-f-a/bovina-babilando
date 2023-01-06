import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/src/db';
import { AuthFrom } from '@app/shared/config';
import { LoginDto } from '../../../libs/shared/src/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async findUserById(id: string, authFrom: AuthFrom) {
    return authFrom === AuthFrom.GITHUB_ID
      ? await this.userModel.findOne({ githubId: id }).exec()
      : await this.userModel.findById(id).exec();
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findOrCreate(details: User, authFrom: AuthFrom) {
    const user = await this.findUserById(details.githubId, authFrom);
    if (user) return user;

    return await this.createUser(details);
  }

  async createUser(details: User) {
    return this.userModel.create(details);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.findUserByEmail(email);
    const isMatch = await bcrypt.compare(password, user.hashPass);
    if (isMatch) {
      const payload = { email: user.email, sub: user._id };
      return { access_token: this.jwtService.sign(payload) };
    } else {
      return new ForbiddenException('Invalid credentials');
    }
  }
}

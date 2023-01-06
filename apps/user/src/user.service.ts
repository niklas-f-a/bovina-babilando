import { SignUpDto } from '@app/shared/dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, of, switchMap } from 'rxjs';
import { User, UserDocument } from './db';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  signUp({ email, password }: SignUpDto): Observable<User | Error> {
    return this.findByEmail(email).pipe(
      switchMap((value) => {
        if (value) return of(new BadRequestException('User already exist'));
        const newUser = new this.userModel({ email, hashPass: password });
        return from(newUser.save());
      }),
    );
  }

  findByEmail(email: string): Observable<User> {
    return from(this.userModel.findOne({ email }));
  }
}

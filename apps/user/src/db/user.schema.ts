import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id?: ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ unique: true, sparse: true })
  githubId: string | null;

  @Prop()
  photos: { value: string }[];
}

export interface IUser {
  _id: string;
  email: string;
  githubId?: string;
  photos?: { value: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

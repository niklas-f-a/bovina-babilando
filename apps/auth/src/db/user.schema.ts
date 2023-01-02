import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id?: ObjectId;

  @Prop()
  username: string;

  @Prop({ unique: true })
  githubId: string;

  @Prop()
  photos: { value: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

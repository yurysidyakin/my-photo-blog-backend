import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhotoDocument = Photo & Document;

@Schema({ timestamps: true })
export class Photo {
  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  camera: string;

  @Prop({ required: true })
  film: string;

  @Prop({ required: true })
  lens: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);

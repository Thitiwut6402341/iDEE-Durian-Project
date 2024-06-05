import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NgCaseDocument = NgCase & Document;

@Schema({ collection: 'NgCases', versionKey: false })
export class NgCase extends Document {
  @Prop({ required: true, unique: true })
  case_name: string;

  @Prop()
  description: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const NgCaseSchema = SchemaFactory.createForClass(NgCase);

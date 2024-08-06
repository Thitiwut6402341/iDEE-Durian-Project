import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { mongo } from 'mongoose';

export type GpsLoggingDocument = GpsLogging & Document;

@Schema({ collection: 'GpsLogging', versionKey: false })
export class GpsLogging {
  @Prop()
  creator_by: mongo.ObjectId;

  @Prop()
  grade_system: string[];

  @Prop()
  effective_date: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const GpsLoggingSchema = SchemaFactory.createForClass(GpsLogging);

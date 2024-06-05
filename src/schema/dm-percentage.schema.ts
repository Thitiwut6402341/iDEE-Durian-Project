import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type DMPercentageDocument = Document<DMPercentageDocument>;

@Schema({ collection: 'DMPercentage', versionKey: false })
export class DMPercentage {
  @Prop()
  dm_percentage: number;

  @Prop()
  dm_img: string;  

  @Prop()
  qualified_by: string;

  @Prop()
  qa_by: mongo.ObjectId;;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const DMPercentageSchema = SchemaFactory.createForClass(DMPercentage);

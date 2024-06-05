import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QAProcessDocument = QAProcess & Document;

@Schema({ collection: 'QAProcess', versionKey: false })
export class QAProcess extends Document {
  @Prop()
  
  

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const QAProcessSchema = SchemaFactory.createForClass(QAProcess);

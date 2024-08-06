import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type QAProcessDocument = Document<QAProcess>;

@Schema({ collection: 'QAProcess', versionKey: false })
export class QAProcess {
  @Prop()
  qa_process: string;

  @Prop()
  reserve_id: mongo.ObjectId;

  @Prop()
  location: string;

  @Prop()
  temperature: string;

  @Prop()
  humidity: string;

  @Prop()
  container_no: string;

  @Prop()
  container_img: string;

  @Prop()
  seal_sending: string;

  @Prop()
  seal_no_sending: string;

  @Prop()
  gps_no: string;

  @Prop()
  seal_receiving: string;

  @Prop()
  seal_no_receiving: string;

  @Prop()
  is_seal_pass: boolean;

  @Prop()
  remarks: string;

  @Prop()
  dm_percentage: number;

  @Prop()
  dm_img: string;

  @Prop()
  qa_by: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const QAProcessSchema = SchemaFactory.createForClass(QAProcess);

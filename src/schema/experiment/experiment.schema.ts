import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExperimentDocument = Experiment & Document;

@Schema({ collection: 'Experiment', versionKey: false })
export class Experiment {
  @Prop({ type: Object })
  data: Record<string, any>;

  @Prop({ default: Date.now }) created_at: Date;
  @Prop({ default: Date.now }) updated_at: Date;
}

export const ExperimentSchema = SchemaFactory.createForClass(Experiment);

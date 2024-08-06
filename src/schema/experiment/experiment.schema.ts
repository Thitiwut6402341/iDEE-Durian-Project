import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExperimentDocument = Experiment & Document;

@Schema({ collection: 'Experiment', versionKey: false })
export class Experiment {
  @Prop({ type: Object })
  data: Record<string, any>;

  @Prop() created_at: Date;
  @Prop() updated_at: Date;
}

export const ExperimentSchema = SchemaFactory.createForClass(Experiment);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ContainerDocument = Document<Container>;

@Schema({ collection: 'Container', versionKey: false })
export class Container {
  @Prop()
  reserve_id: mongo.ObjectId;

  @Prop()
  container_no: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ContainerSchema = SchemaFactory.createForClass(Container);

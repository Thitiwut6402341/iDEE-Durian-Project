import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, mongo } from 'mongoose';

export type DurianRegistrationDocument = HydratedDocument<DurianRegistration>;

@Schema({ collection: 'DurianRegistration', versionKey: false })
export class DurianRegistration {
  @Prop({ nullable: false })
  tree_code: string;

  @Prop({ nullable: false })
  orchard_code: string;

  @Prop({ nullable: false })
  packing_house_code: string;

  @Prop({ nullable: false })
  rfid_code: string;

  @Prop({ nullable: false })
  fruit_code: string;

  @Prop({ nullable: true })
  lot_id: string;

  @Prop({ nullable: true })
  inspected_grade: string;

  // @Prop({nullable: true})
  // is_passed: boolean;

  @Prop({ nullable: true })
  inspected_by: mongo.ObjectId;

  @Prop()
  remarks: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  registered_at: Date;
}

export const DurianRegistrationSchema =
  SchemaFactory.createForClass(DurianRegistration);

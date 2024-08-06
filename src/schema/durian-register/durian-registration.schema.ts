import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, mongo } from 'mongoose';

export type DurianRegistrationDocument = HydratedDocument<DurianRegistration>;

@Schema({ collection: 'DurianRegistration', versionKey: false })
export class DurianRegistration {
  @Prop({ nullable: false })
  tree_code: string;

  @Prop({ nullable: false })
  orchard_code: string;

  @Prop()
  packing_house_code: string;

  @Prop({ nullable: false, unique: true })
  rfid_code: string;

  @Prop()
  reserve_id: mongo.ObjectId;

  @Prop()
  container_no: string;

  @Prop({ nullable: true })
  inspected_grade: string;

  @Prop({ nullable: true })
  export_grade: string;

  @Prop({ nullable: true })
  maturity: number;

  @Prop({ nullable: true })
  weight: number;

  @Prop({ nullable: true })
  weight_sale: number;

  @Prop({ nullable: true })
  number_of_segments: number;

  // @Prop({ nullable: true })
  // gps_no: string;

  @Prop({ nullable: true })
  inspected_by: mongo.ObjectId;

  @Prop()
  remarks: string;

  @Prop()
  status: boolean;

  @Prop()
  is_reject: boolean;

  // @Prop()
  // booking_ref: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  registered_at: Date;
}

export const DurianRegistrationSchema =
  SchemaFactory.createForClass(DurianRegistration);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type OrchardRegisterDocument = OrchardRegister & Document;

@Schema({ collection: 'OrchardRegistration', versionKey: false })
export class OrchardRegister extends Document {
  @Prop()
  creator_id: mongo.ObjectId;

  @Prop()
  orchard_code: string;

  @Prop()
  orchard_name: string;

  @Prop()
  province: string;

  @Prop()
  district: string;

  @Prop()
  sub_district: string;

  @Prop()
  zip_code: string;

  @Prop()
  address: string;

  @Prop()
  area_rai: number;

  @Prop()
  area_ngan: number;

  @Prop()
  area_wa: number;

  @Prop()
  title_name: string;

  @Prop()
  owner_first_name: string;

  @Prop()
  owner_last_name: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;

  @Prop()
  gap_no: string;

  @Prop()
  gap_img: string;

  @Prop()
  gap_exp: string;

  @Prop()
  tax_id: string;

  @Prop()
  soil_type: string;

  @Prop()
  total_trees: number;

  @Prop()
  harvest_season: string;

  @Prop()
  cultivar: string;

  @Prop()
  capacity: number;

  @Prop()
  is_qa_verify?: boolean;

  @Prop()
  qa_by?: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const OrchardRegisterSchema =
  SchemaFactory.createForClass(OrchardRegister);

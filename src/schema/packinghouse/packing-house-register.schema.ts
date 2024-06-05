import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type PackingHouseRegisterDocument = PackingHouseRegister & Document;

@Schema({ collection: 'PackingHouseRegisteration', versionKey: false })
export class PackingHouseRegister extends Document {

    @Prop()
    creator_id: mongo.ObjectId;

    @Prop()
    packing_house_name: string;

    @Prop()
    packing_house_code: string;

    @Prop()
    is_qa_verify: boolean;

    @Prop()
    qa_by: mongo.ObjectId;

    @Prop()
    register_type: string;

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
    registration_no?: string;

    @Prop()
    doa_no?: string;

    @Prop()
    doa_img?: string;

    @Prop()
    gmp_no?: string;

    @Prop()
    gmp_img?: string;


    @Prop()
    latitude?: string;

    @Prop()
    longitude?: string;

    @Prop()
    title_name: string;

    @Prop()
    owner_first_name: string;

    @Prop()
    owner_last_name: string;

    @Prop()
    tax_id?: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    capacity_per_day: number;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const PackingHouseRegisterSchema =
    SchemaFactory.createForClass(PackingHouseRegister);
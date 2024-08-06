import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, mongo } from 'mongoose';

export type DurainRegisterDocument = HydratedDocument<DurianRegister>;

@Schema({ collection: 'DurianRegistration', versionKey: false })
export class DurianRegister {


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
    container_no: string;

    @Prop({ nullable: true })
    inspected_grade: string;

    @Prop({ nullable: true })
    gps_no: string;

    @Prop({ nullable: true })
    inspected_by: mongo.ObjectId;

    @Prop()
    remarks: string;

    @Prop()
    status: boolean;

    @Prop()
    is_reject: boolean;

    @Prop()
    booking_ref: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    registered_at: Date;
}

export const DurianRegisterSchema = SchemaFactory.createForClass(DurianRegister);
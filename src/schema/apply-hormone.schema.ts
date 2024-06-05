import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplyHormoneDocument = Document<ApplyHormone>;

@Schema({ collection: 'ApplyHormonesProcess', versionKey: false })
export class ApplyHormone {
    @Prop()
    packing_house_code: string;

    @Prop()
    fruit_code: string;

    @Prop({ nullable: false })
    rfid_code: string[];

    @Prop({ nullable: true })
    creator_id: string;

    @Prop({ nullable: false })
    created_at: Date;

    @Prop({ nullable: false })
    updated_at: Date;

}

export const ApplyHormoneSchema = SchemaFactory.createForClass(ApplyHormone);
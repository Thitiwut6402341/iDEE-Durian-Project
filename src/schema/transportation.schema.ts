import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransportationlDocument = Document<Transportation>;

@Schema({ collection: 'Transportation', versionKey: false })
export class Transportation {

    @Prop()
    lot_id: string;

    @Prop()
    rfid_code: string[];

    @Prop()
    booking_ref: string;

    @Prop({ nullable: false })
    created_at: Date;

    @Prop({ nullable: false })
    updated_at: Date;

}

export const TransportationSchema = SchemaFactory.createForClass(Transportation);
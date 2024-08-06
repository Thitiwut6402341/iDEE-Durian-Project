import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChinaLoadOutStoreProcessDocument = ChinaLoadOutStoreProcess & Document;

@Schema({ collection: 'ChinaLoadOutStoreProcess', versionKey: false })
export class ChinaLoadOutStoreProcess {

    @Prop()
    rfid_code: string;

    @Prop()
    timestamp: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

}

export const ChinaLoadOutStoreProcessSchema = SchemaFactory.createForClass(ChinaLoadOutStoreProcess);
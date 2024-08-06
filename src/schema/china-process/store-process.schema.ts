import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChinaStoreProcessDocument = ChinaStoreProcess & Document;

@Schema({ collection: 'ChinaStoreProcess', versionKey: false })
export class ChinaStoreProcess {

    @Prop()
    rfid_code: string;

    @Prop()
    timestamp: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

}

export const ChinaStoreProcessSchema = SchemaFactory.createForClass(ChinaStoreProcess);
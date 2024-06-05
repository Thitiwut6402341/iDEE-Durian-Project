import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HardwareDataCollectionDocument = Document<HardwareDataCollection>;

@Schema({collection: 'HardwareDataCollection',  versionKey: false})
export class HardwareDataCollection {

    @Prop({nullable: false})
    data: object[];

    @Prop({nullable: false})
    created_at: Date;

}

export const HardwareDataCollectionSchema = SchemaFactory.createForClass(HardwareDataCollection);
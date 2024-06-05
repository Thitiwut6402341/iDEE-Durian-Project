import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type PackingDocument = Document<Packing>;

@Schema({collection: 'PackingProcess',  versionKey: false})
export class Packing {

    @Prop({ required: true })
    rfid_code: string;
  
    @Prop({ required: true })
    packing_type: string;
  
    @Prop({ required: true })
    creator_id: mongo.ObjectId;
  
    @Prop({ default: Date.now })
    created_at: Date;
  
    @Prop({ default: Date.now })
    updated_at: Date;

}

export const PackingSchema = SchemaFactory.createForClass(Packing);
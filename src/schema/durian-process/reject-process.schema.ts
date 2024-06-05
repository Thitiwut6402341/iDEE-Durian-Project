
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type RejectProcessDocument = RejectProcess & Document;

@Schema({ collection: 'RejectProcess', versionKey: false })
export class RejectProcess extends Document {

    @Prop()
    fruit_code: string;

    @Prop()
    reject_reason: string;

    @Prop()
    created_by: string;

    @Prop()
    creator_id: mongo.ObjectId;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const RejectProcessSchema =
    SchemaFactory.createForClass(RejectProcess);
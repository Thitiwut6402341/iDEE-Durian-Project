import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type TradeMarkSettingDocument = TradeMarkSetting & Document;

@Schema({ collection: 'TradeMarkSetting', versionKey: false })
export class TradeMarkSetting extends Document {

    @Prop()
    creator_by: mongo.ObjectId;

    @Prop()
    trademark_img: string;

    @Prop()
    product_name: string;


    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const TradeMarkSettingSchema =
    SchemaFactory.createForClass(TradeMarkSetting);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoatingSolutionDocument = Document<CoatingSolution>;

@Schema({ collection: 'CoatingSolutionProcess', versionKey: false })
export class CoatingSolution {
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

export const CoatingSolutionSchema = SchemaFactory.createForClass(CoatingSolution);
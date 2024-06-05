import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type WeightingsDocument = Weightings & Document;

@Schema({ collection: 'WeightingsProcess', versionKey: false })
export class Weightings extends Document {
    @Prop()
    rfid_code: string;

    // @Prop()
    // rfid_code: string;

    @Prop()
    fruit_code: string;

    @Prop()
    weight: number;

    @Prop()
    tree_code: string;

    @Prop()
    inspected_grade: string;

    @Prop()
    maturity: string;

    @Prop()
    number_of_segments: number;

    @Prop()
    export_grade: string;

    @Prop()
    creator_id: mongo.ObjectId;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const WeightingsSchema = SchemaFactory.createForClass(Weightings);

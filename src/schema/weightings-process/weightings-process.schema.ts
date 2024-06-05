import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeightingsProcessDocument = Document<WeightingsProcess>;

@Schema({ collection: 'WeightingsProcess', versionKey: false })
export class WeightingsProcess {

    @Prop({ nullable: false })
    fruit_code: string;

    @Prop({ nullable: false })
    weight: string;

    @Prop({ nullable: false })
    inspected_grade: string;

    @Prop({ nullable: false })
    number_of_segment: number;

    @Prop({ nullable: true })
    export_grade: string;

    @Prop({ nullable: true })
    creator_id: string;

    @Prop({ nullable: false })
    created_at: Date;

    @Prop({ nullable: false })
    updated_at: Date;

}

export const WeightingsProcessSchema = SchemaFactory.createForClass(WeightingsProcess);

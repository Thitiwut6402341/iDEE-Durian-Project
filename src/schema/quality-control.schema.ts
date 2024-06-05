import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QualityControlDocument = Document<QualityControl>;

@Schema({collection: 'QualityControlsProcess',  versionKey: false})
export class QualityControl {

    @Prop({nullable: false})
    fruit_code: string;

    @Prop({nullable: false})
    is_passed: boolean;

    @Prop({nullable: false})
    ng_cases: object[];

    @Prop({nullable: false})
    created_at: Date;

    @Prop({nullable: false})
    updated_at: Date;

}

export const QualityControlSchema = SchemaFactory.createForClass(QualityControl);
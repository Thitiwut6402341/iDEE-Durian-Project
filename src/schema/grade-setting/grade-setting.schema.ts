import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, mongo } from 'mongoose';

export type GradeSettingDocument = GradeSetting & Document;;

@Schema({ collection: 'GradeSetting', versionKey: false })
export class GradeSetting {

    @Prop()
    creator_by: mongo.ObjectId;

    @Prop()
    grade_system: string[];

    @Prop()
    effective_date: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

}

export const GradeSettingSchema =
    SchemaFactory.createForClass(GradeSetting);



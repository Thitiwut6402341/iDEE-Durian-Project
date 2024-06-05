import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExperimentDataDocument = HydratedDocument<ExperimentData>;

@Schema({ collection: 'ExperimentData', versionKey: false })
export class ExperimentData {
    @Prop()
    information: any[];

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

}

export const ExperimentDataSchema =
    SchemaFactory.createForClass(ExperimentData);



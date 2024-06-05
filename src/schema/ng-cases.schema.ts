import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NgCasesDocument = Document<NgCases>;

@Schema({collection: 'NgCases',  versionKey: false})
export class NgCases {

    @Prop({nullable: false})
    case_name: string;

    @Prop({nullable: true})
    description: string;

    @Prop({nullable: false})
    created_at: Date;

    @Prop({nullable: false})
    updated_at: Date;

}

export const NgCasesSchema = SchemaFactory.createForClass(NgCases);
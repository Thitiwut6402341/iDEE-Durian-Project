import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DurainRegisterDocument = HydratedDocument<DurianRegister>;

@Schema({collection: 'DurianRegistration',  versionKey: false})
export class DurianRegister {

    @Prop({nullable: false})
    tree_code: string;

    @Prop({nullable: false})
    fruit_code: string;

    @Prop({nullable: true})
    weight: number;

    @Prop({nullable: true})
    number_of_segments: number;

    @Prop({nullable: true})
    ripeness: number;

    @Prop({nullable: true})
    method: string;

    @Prop({nullable: true})
    grade: string;

    @Prop({nullable: true})
    status: boolean;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const DurianRegisterSchema = SchemaFactory.createForClass(DurianRegister);
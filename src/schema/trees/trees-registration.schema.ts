import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TreesRegisterDocument = Document<TreesRegistration>;

@Schema({ collection: 'TreesRegistration', versionKey: false })
export class TreesRegistration {

    @Prop({ nullable: false })
    orchard_code: string;

    @Prop({ nullable: false })
    orchard_name: string;

    @Prop({ nullable: false })
    tree_code: string;

    @Prop({ nullable: false })
    cultivar: string;

    @Prop({ nullable: false })
    sub_district: string;

    @Prop({ nullable: true })
    latitude: string;

    @Prop({ nullable: true })
    longitude: string;

    @Prop({ nullable: true })
    plant_year: number;

    @Prop({ nullable: false })
    tree_height: number;

    @Prop({ nullable: false })
    circumference: number;

    @Prop({ nullable: true })
    fruit_per_tree: number;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const TreesRegistrationSchema = SchemaFactory.createForClass(TreesRegistration);
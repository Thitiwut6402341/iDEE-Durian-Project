import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DestinationModel = Document<Destination>;

@Schema({collection: 'Destination',  versionKey: false})
export class Destination {

    @Prop({nullable: false})
    place_name: string;

    @Prop({nullable: false})
    latitude: string;

    @Prop({nullable: false})
    longitude: string;

    @Prop({nullable: false})
    created_at: Date;

    @Prop({nullable: false})
    updated_at: Date;

}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
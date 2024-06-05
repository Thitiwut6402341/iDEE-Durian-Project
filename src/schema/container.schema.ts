import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ContainerDocument = Document<Container>;

@Schema({collection: 'Container',  versionKey: false})
export class Container {

    @Prop()
    container_no: string;

    @Prop()
    container_img: string;

    @Prop()
    seal_sending: string;

    @Prop()
    seal_receiving: string;

    @Prop()
    sent_by: mongo.ObjectId;

    @Prop()
    received_by: mongo.ObjectId;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

}

export const ContainerSchema = SchemaFactory.createForClass(Container);
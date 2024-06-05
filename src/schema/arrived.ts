import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArrivedDocument = Document<Arrived>;

@Schema({ collection: 'ArrivedProcess', versionKey: false })
export class Arrived {

    @Prop()
    lot_id: string;


    @Prop({ nullable: true })
    creator_id: string;

    @Prop({ nullable: false })
    created_at: Date;

    @Prop({ nullable: false })
    updated_at: Date;

}

export const ArrivedSchema = SchemaFactory.createForClass(Arrived);
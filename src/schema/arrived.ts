import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArrivedDocument = Document<Arrived>;

@Schema({ collection: 'ArrivedProcess', versionKey: false })
export class Arrived {
    @Prop()
    container_no: string;

    @Prop()
    gps_no: string;

    @Prop()
    arrive_date: string;

    @Prop({ nullable: false })
    created_at: Date;

    @Prop({ nullable: false })
    updated_at: Date;
}

export const ArrivedSchema = SchemaFactory.createForClass(Arrived);

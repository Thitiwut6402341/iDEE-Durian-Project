import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeparturelDocument = Document<Departure>;

@Schema({ collection: 'Departure', versionKey: false })
export class Departure {

    @Prop({ nullable: false })
    fruit_code: string;

    @Prop({ nullable: false })
    created_at: Date;

    @Prop({ nullable: false })
    updated_at: Date;

}

export const DepartureSchema = SchemaFactory.createForClass(Departure);
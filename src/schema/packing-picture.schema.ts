import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PackingPictureDocument  = Document<PackingPicture>;

@Schema({collection: 'PackingPictures',  versionKey: false})
export class PackingPicture {

    @Prop({nullable: false})
    fruit_code: string;

    @Prop({nullable: true})
    creator_id: string;

    @Prop({nullable: false})
    created_at: Date;

    @Prop({nullable: false})
    updated_at: Date;

}

export const PackingPictureSchema = SchemaFactory.createForClass(PackingPicture);
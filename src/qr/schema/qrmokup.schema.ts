import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QrMokupDocument = QrMokup & Document;

@Schema({ collection: 'ShowCustomer', versionKey: false })
export class  QrMokup extends Document {
@Prop()
fruit_code: string;

@Prop()
repiness: number;

@Prop()
is_passed:boolean;

@Prop()
registered_at:Date;

@Prop()
duration_ripeness:number;

@Prop()
province_name_en:string;

@Prop()
cultivar:string;

@Prop()
timestamp_departure:Date;

@Prop()
timestamp_arrived:Date;

@Prop()
timestamp_packing:Date;

@Prop()
timestamp_quality:Date;

@Prop()
status_quality:boolean;

@Prop()
status_packing:boolean;

@Prop()
status_arrived:boolean;

@Prop()
status_departure:boolean;

@Prop()
best_before:Date;

@Prop()
status_picking:boolean;

@Prop()
timestamp_picking:Date;

@Prop()
current_level:number;

@Prop()
levels:object[];

}
export const  QrMokupSchema = SchemaFactory.createForClass(QrMokup);
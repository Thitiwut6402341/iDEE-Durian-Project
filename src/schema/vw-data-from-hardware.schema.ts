import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type vwDataFromHardwareDocument = vwDataFromHardware & Document;

@Schema({ collection: 'vwDataFromHardware', versionKey: false })
export class vwDataFromHardware extends Document {

    @Prop()
    soil_humidity: number;
    @Prop()
    soil_temp: number;
    @Prop()
    soil_conductivity: number;
    @Prop()
    soil_ph: number;
    @Prop()
    soil_nitrogen: number;
    @Prop()
    soil_phosphorus: number;
    @Prop()
    soil_potassium: number;
    @Prop()
    soil_salinity: number;
    @Prop()
    air_humidity: number;
    @Prop()
    air_temp: number;
    @Prop()
    air_co2: number;
    @Prop()
    air_pressure: number;
    @Prop()
    rain_fall: number;

    @Prop()
    created_at: Date;
}

export const vwDataFromHardwareSchema = SchemaFactory.createForClass(vwDataFromHardware);

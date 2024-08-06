import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceRegistrationDocument = DeviceRegistration & Document;

@Schema({ collection: 'DeviceRegistration', versionKey: false })
export class DeviceRegistration extends Document {
  @Prop()
  device_name: string;

  @Prop()
  orchard_code: string;
}

export const DeviceRegistrationSchema =
  SchemaFactory.createForClass(DeviceRegistration);

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type DepartmentProvincialDocument = Document<DepartmentProvincial>;

// @Schema({collection: 'DepartmentofProvincialAdministration',  versionKey: false})
// export class DepartmentProvincial {

//     @Prop({nullable: false})
//     sub_district_id: string;

//     @Prop({nullable: false})
//     sub_district_name_th: string;

//     @Prop({nullable: false})
//     sub_district_name_en: string;

//     @Prop({nullable: false})
//     district_name_th: string;

//     @Prop({nullable: false})
//     district_name_en: string;

//     @Prop({nullable: false})
//     province_name_th: string;

//     @Prop({nullable: false})
//     province_name_en: string;

//     @Prop({nullable: false})
//     latitude : string;

//     @Prop({nullable: false})
//     longitude: string;
// }

// export const DepartmentProvincialDetailSchema = SchemaFactory.createForClass(DepartmentProvincial);
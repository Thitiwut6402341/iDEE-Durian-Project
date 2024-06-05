import { IsNotEmpty, IsString } from "class-validator";

export class GradeInspectionDto {
    @IsString()
    @IsNotEmpty()
    rfid_code: string;

    remarks: string;

    @IsString()
    @IsNotEmpty()
    inspected_grade: string;

}

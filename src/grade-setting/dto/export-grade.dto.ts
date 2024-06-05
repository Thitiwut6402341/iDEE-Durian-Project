import { IsNotEmpty, IsString, IsArray, ArrayMinSize, IsNumber } from 'class-validator';

export class ExportGradeDto {
    @IsString()
    @IsNotEmpty()
    inspected_grade: string;

    @IsNumber()
    number_of_segments: number;

    @IsNumber()
    weight: number;
}

import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class CreateGradeConditionDto {
    @IsString()
    @IsNotEmpty()
    effective_date: string;

    @IsArray()
    @ArrayMinSize(1)
    grade_system: string[];
}

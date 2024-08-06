import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DMPercentageDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(["orchard", "packing-house", "agriculture"], { message: "type must be orchard or packing-house or agriculture" })
    qa_type: string // "orchard" or "packing-house" or "agriculture"

    @IsString()
    @IsNotEmpty()
    qualified_by: string // orchard or packing house code or "agriculture"

    @IsNumber()
    @IsNotEmpty()
    dm_percentage: number

    @IsString()
    dm_img: string

}

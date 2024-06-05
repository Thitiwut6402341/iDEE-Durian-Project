import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DMPercentageDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(["orchard", "packing-house", "argiculture"], {message: "type must be orchard or packing-house or argiculture"})
    qa_type: string // "orchard" or "packing-house" or "argiculture"

    @IsString()
    @IsNotEmpty()
    qualified_by: string // orchard or packing house code or "argiculture"

    @IsNumber()
    @IsNotEmpty()
    dm_percentage: number
    
    @IsString()
    dm_img: string

}

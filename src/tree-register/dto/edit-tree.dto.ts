import { IsNotEmpty, IsString } from "class-validator";

export class EditTreeDto {
    @IsString()
    @IsNotEmpty()
    tree_code: string;

    orchard_code: string;

    cultivar: string;

    latitude: string;

    longitude: string;

    plant_year: number;

    tree_height: number;

    circumference: number;

    fruit_per_tree: number;

}

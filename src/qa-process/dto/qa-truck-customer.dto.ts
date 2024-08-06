import { IsNumber } from "class-validator";

export class QATruckCustomerDto {
    @IsNumber()
    temperature: number;

    @IsNumber()
    humidity: number;

}

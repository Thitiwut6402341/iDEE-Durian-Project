import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ContainerReceiveDto {
    @IsString()
    @IsNotEmpty()
    container_no: string;

    @IsString()
    @IsNotEmpty()
    sael_receiving: string;

}

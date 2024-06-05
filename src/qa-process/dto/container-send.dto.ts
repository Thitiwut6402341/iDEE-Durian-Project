import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ContainerSendDto {
    @IsString()
    @IsNotEmpty()
    container_no: string;

    @IsString()
    @IsNotEmpty()
    container_img: string;

    @IsString()
    @IsNotEmpty()
    seal_sending: string;

}

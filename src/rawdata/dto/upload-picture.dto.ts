import { IsEmpty, IsNotEmpty, } from 'class-validator';

export class UploadPictureDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    test_code: string;

    fruit_code: string;

    picture_top: string;


    picture_bottom: string;


    picture_left: string;


    picture_right: string;


    picture_front: string;


    picture_back: string;

}


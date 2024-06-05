import { IsEmpty, IsNotEmpty } from 'class-validator';

export class UploadPictureDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  pictures: {
    top: string | null;
    bottom: string | null;
    left: string | null;
    right: string | null;
    front: string | null;
    back: string | null;
  };
}

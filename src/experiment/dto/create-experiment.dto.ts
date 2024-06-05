import { IsNotEmpty } from 'class-validator';

export class CreateExperimentDto {
  @IsNotEmpty()
  data: Record<string, any>;
}

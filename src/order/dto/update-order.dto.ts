import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator/types/decorator/typechecker/IsString';

export class UpdateOrderDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  items: string[];
}

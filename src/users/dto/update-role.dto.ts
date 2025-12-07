import { IsNotEmpty } from 'class-validator';
import { Role } from '../common/user-roles.enum';

export class UpdateRoleDto {
  @IsNotEmpty({ message: 'role cannot be empty' })
  role: Role[];
}

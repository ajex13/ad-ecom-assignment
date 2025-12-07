import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from './common/roles.decorator';
import { Role } from './common/user-roles.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiBearerAuth('bearer')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() userSignupDto: UserSignupDto) {
    return this.usersService.signup(userSignupDto);
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.usersService.login(userLoginDto);

    const token = this.usersService.issueAccessToken(user);

    return { user: { name: user.name, email: user.email }, token };
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Post(':id/update-role')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.usersService.updateRole(+id, updateRoleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

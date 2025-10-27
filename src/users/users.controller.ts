import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserLoginDto } from './dto/user-login.dto';

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
  findAll() {
    return this.usersService.findAll();
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

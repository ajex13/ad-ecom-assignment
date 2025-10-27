import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignupDto: UserSignupDto) {
    const { email, password } = userSignupDto;

    const foundUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (foundUser) {
      throw new BadRequestException(
        `user with email id ${email} already exists`,
      );
    }

    userSignupDto.password = await hash(password, 10);

    const user = this.userRepository.create(userSignupDto);

    const savedUser = await this.userRepository.save(user);

    return plainToInstance(UserEntity, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

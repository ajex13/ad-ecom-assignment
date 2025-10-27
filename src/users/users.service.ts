import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserLoginDto } from './dto/user-login.dto';

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

  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;

    const foundUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordsMatch = await compare(password, foundUser.password);

    if (!passwordsMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return plainToInstance(UserEntity, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll() {
    const users = await this.userRepository.find();

    return plainToInstance(UserEntity, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    return plainToInstance(UserEntity, user, {
      excludeExtraneousValues: true,
    });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}

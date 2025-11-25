import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserLoginDto } from './dto/user-login.dto';
import { env } from 'config/env';
import { sign } from 'jsonwebtoken';

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

    return foundUser;
  }

  async findAll() {
    const users = await this.userRepository.find();

    return plainToInstance(UserEntity, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserEntity, user, {
      excludeExtraneousValues: true,
    });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  issueAccessToken(userEntity: UserEntity) {
    const { email, password } = userEntity;

    if (!email || !password) {
      throw new BadRequestException('Cannot issue token');
    }

    return sign({ email, password }, env.jwt.secret, { expiresIn: '1hr' });
  }
}

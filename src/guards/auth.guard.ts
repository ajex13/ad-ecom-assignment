import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { env } from 'config/env';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verify(token, env?.jwt?.secret) as {
        email: string;
        password: string;
      };

      const user = await this.usersService.findByEmail(decoded.email);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      request['user'] = user; // Attach user to request object
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid token',
        (error as Error).message,
      );
    }
  }
}

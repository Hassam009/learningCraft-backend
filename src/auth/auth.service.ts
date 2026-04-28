import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(name: string, email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      roles: ['student'],
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}
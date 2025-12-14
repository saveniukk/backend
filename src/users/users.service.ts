import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: Map<string, User> = new Map();

  create(createUserDto: CreateUserDto): User {
    const id = uuidv4();
    const user: User = { id, ...createUserDto };
    this.users.set(id, user);
    return user;
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findOne(id: string): User {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  remove(id: string): boolean {
    if (!this.users.has(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.users.delete(id);
  }
}

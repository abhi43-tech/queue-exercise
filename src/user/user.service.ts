import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.enity';
import * as bcrypt from 'bcrypt';
import { Countries } from 'src/country/entity/country.entity';
import { CountryRepository } from 'src/country/repository/country.repository';

export type User1 = {
  id: number;
  name: string;
  username: string;
  password: string;
};
  
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Countries) private countryRepo: CountryRepository,
  ) {}

  async findOne(username: string): Promise<User> {
    return await this.userRepo.findOne({ where: { username } });
  }

  async createUser(user: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: { username: user.username },
    });
    if (existingUser)
      throw new BadRequestException('User already exist with same username.');
    const hashPass = await bcrypt.hash(user.password, 10);
    const newUser = await this.userRepo.create({
      ...user,
      password: hashPass,
      subscribe: user.subscribe ? user.subscribe.map(Number) : [],
    });
    await this.userRepo.save(newUser);
    return {
      message: 'User register successfully.',
      id: newUser.id,
    };
  }

  async findEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (!user) return null;
    return user;
  }

  async updateUser(subscribe: string[], name: string) {
    if (!Array.isArray(subscribe)) {
      throw new BadRequestException('Subscribe must be an array.');
    }

    const existingUser = await this.userRepo.findOne({
      where: { username: name },
    });

    if (!existingUser) throw new BadRequestException('User not found.');

    const sub_ids = await this.countryRepo.find({
      where: { name: In(subscribe) },
      select: ['id'],
    });

    const sub_id_values = sub_ids.map((sub) => sub.id);

    await this.userRepo.update(existingUser.id, { subscribe: sub_id_values });

    return {
      message: 'User updated successfully.',
      id: existingUser.id,
      subscribe: sub_id_values,
    };
  }
}

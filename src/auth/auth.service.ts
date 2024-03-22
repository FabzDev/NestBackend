import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel( User.name ) 
    private userModel: Model<User>,
   ) {}


  create(createUserDto: CreateUserDto){
    try{
      const { password, ...remainData } = createUserDto;
      const cryptPass = bcryptjs.hashSync( password, 10)

      const newUser = new this.userModel({
        password: cryptPass,
        ...remainData
      });

      return newUser.save();
    } catch(err){
      if(err.code === 11000) throw new BadRequestException(`${createUserDto.email} no exists`);
      throw new InternalServerErrorException('Heavy error')
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

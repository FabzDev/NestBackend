import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayLoad } from './interfaces/JwtPayLoad.interface';
import { JwtService } from '@nestjs/jwt';
import { LoggedUser } from './interfaces/user-logged.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel( User.name ) 
    private userModel: Model<User>,

    private jwtService: JwtService,

   ) {}


  async create(createUserDto: CreateUserDto): Promise<User>{
    try{

      const { password, ...remainData } = createUserDto;
      const cryptPass = bcryptjs.hashSync( password, 10)
      const newUser = new this.userModel({
        password: cryptPass, ...remainData
      });
      await newUser.save();

      const {password:pass, ...remainData2} = newUser.toJSON();

      return {...remainData2};

    } catch(err) {

      if(err.code === 11000) {
        console.log(err);
        
        throw new BadRequestException(`${createUserDto.email} does not exists`)
      };
      throw new InternalServerErrorException('Heavy error');

    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoggedUser> {
    const { password, email } = loginUserDto;

    const userFound = await this.userModel.findOne( { email } );
    
    if(!userFound) throw new UnauthorizedException('Email invalido');

    const doesPassMatch = bcryptjs.compareSync(password, userFound.password)
    if(!doesPassMatch) throw new UnauthorizedException('Password invalido');

    const { password: clavesita, ...remainUserObj} = userFound.toJSON();
    
    return {
      user: remainUserObj ,
      jwt: this.getJwt({ id: userFound.id })
    }
  }

  getJwt(jwtPayLoad: JwtPayLoad){
    const jwt = this.jwtService.sign( jwtPayLoad );
    return jwt
  }

  async register(createUserDto: CreateUserDto): Promise<LoggedUser>{
    const createdUser = await this.create(createUserDto);
    
    if(!createdUser) throw new BadRequestException('User was not created correctly');

    const {email, password} = createUserDto;
    return this.login({email, password});
   
}

  async findAll() {
    return await this.userModel.find();
  }

  async findUserById(id: string){
    const userFoundById = await this.userModel.findById( id );
    const {password: _, ...remainInfo} = userFoundById.toJSON();
    return remainInfo;
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

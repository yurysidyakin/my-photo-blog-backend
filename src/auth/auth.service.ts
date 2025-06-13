import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { RegisterDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: RegisterDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      login: dto.login,
      name: dto.name,
      passwordHash: await hash(dto.password, salt),
    });
    return newUser.save();
  }

  async findUser(login: string) {
    return this.userModel.findOne({ login }).exec();
  }

  async validateUser(
    login: string,
    password: string,
  ): Promise<Pick<User, 'login' | 'name'>> {
    const user = await this.findUser(login);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { login: user.login, name: user.name };
  }

  async login(login: string) {
    const user = await this.findUser(login);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const payload = { login: user.login, name: user.name, _id: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

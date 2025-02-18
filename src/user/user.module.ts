import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LocalStrategy } from 'src/auth/strategy/local.strategy';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { User } from './entity/user.enity';
import { AuthService } from 'src/auth/auth.service';
import { Countries } from 'src/country/entity/country.entity';
import { MailService } from 'src/mail-sender/mail.service';
import { MailModule } from 'src/mail-sender/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Countries]),
    forwardRef(() => AuthModule),
    MailModule,
  ],
  providers: [
    UserService,
    LocalStrategy,
    AuthService,
    JwtService,
    JwtStrategy,
    MailService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  subject: string;
}
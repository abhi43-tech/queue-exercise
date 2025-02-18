import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface SendMailConfiguration {
  email: string;
  subject: string;
  text: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      from: {
        name: 'NestJs + React Emails Test App',
        address: 'Test App',
      },
    });
  }

  async sendMail({ email, subject, text }: SendMailConfiguration) {
    this.transporter.sendMail({
      to: email,
      subject,
      text,
    });
  }
}

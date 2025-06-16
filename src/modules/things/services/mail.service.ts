import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // or your SMTP host
      port: 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: 'akkythings@gmail.com',
        pass: process.env.gmail_app_password, // use App Password if using Gmail
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const info = await this.transporter.sendMail({
      from: '"Akky Things" <akkythings@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  }
}

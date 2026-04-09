import nodemailer from 'nodemailer';
import env from './env.js';

let transporter;

const initMailer = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    console.log('Mailer initialized');
  }

  return transporter;
};

export default initMailer;
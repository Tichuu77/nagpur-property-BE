import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({ jsonTransport: true });

const mailService = {
  send: async (mailOptions) => transporter.sendMail(mailOptions)
};

export default mailService;

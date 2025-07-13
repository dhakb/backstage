import { createTransport, Transporter } from "nodemailer";


export interface EmailTransport {
  create(): Transporter;
}

export class SendinblueTransport implements EmailTransport {
  create(): Transporter {
    return createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {user: process.env.SIB_USER, pass: process.env.SIB_PASS}
    });
  }
}

export class SendgridTransport implements EmailTransport {
  create() {
    return createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      auth: {user: process.env.SG_USER, pass: process.env.SG_PASS}
    });
  }
}

export class CPanelTransport implements EmailTransport {
  create() {
    return createTransport({
      host: "website.com",
      port: 465,
      secure: true,
      auth: {user: process.env.CP_USER, pass: process.env.CP_PASS}
    });
  }
}

export class EmailTransportFactory {
  static get(): EmailTransport {
    switch (process.env.EMAIL_PROVIDER) {
      case "SIB":
        return new SendinblueTransport();
      case "SG":
        return new SendgridTransport();
      default:
        return new CPanelTransport();
    }
  }
}


export const emailTransport = EmailTransportFactory.get().create();
import { config } from "../../config/config";
import { createTransport, Transporter } from "nodemailer";


const {
  SIB_USER,
  SIB_PASS,
  SG_USER,
  SG_PASS,
  CP_USER,
  CP_PASS
} = config;


export interface EmailTransport {
  create(): Transporter;
}

export class SendinblueTransport implements EmailTransport {
  create(): Transporter {
    return createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {user: SIB_USER, pass: SIB_PASS}
    });
  }
}

export class SendgridTransport implements EmailTransport {
  create() {
    return createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      auth: {user: SG_USER, pass: SG_PASS}
    });
  }
}

export class CPanelTransport implements EmailTransport {
  create() {
    return createTransport({
      host: "website.com",
      port: 465,
      secure: true,
      auth: {user: CP_USER, pass: CP_PASS}
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
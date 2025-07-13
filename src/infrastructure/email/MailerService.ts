import { IMailer } from "../../application/ports/IMailer";
import { emailTransport } from "./EmailTransport";


export class MailerService implements IMailer {
  async sendMail(options: { from: string; to: string; subject: string; html: string }): Promise<void> {
    await emailTransport.sendMail(options);
  }
}
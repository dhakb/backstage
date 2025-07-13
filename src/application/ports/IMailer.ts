export interface IMailer {
  sendMail(options: {
    from: string,
    to: string,
    subject: string
    html: string
  }): Promise<void>;
}
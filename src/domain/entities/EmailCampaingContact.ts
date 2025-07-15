export class EmailCampaignContact {
  constructor(
    public readonly email: string,
    public readonly firstName: string = "",
    public readonly lastName: string = "",
    public readonly fullName: string = ""
  ) {
  }

  static fromName(email: string, name?: string, firstName?: string, lastName?: string) {
    let fn = firstName ?? "";
    let ln = lastName ?? "";
    let full = "";

    if (name) {
      if (name.includes(" | ")) {
        const parts = name.split(" | ");
        fn = fn || parts[0];
        ln = ln || parts[1];
        full = `${fn} ${ln}`;
      } else {
        full = name;
      }
    } else {
      full = `${fn} ${ln}`;
    }

    return new EmailCampaignContact(email, fn, ln, full);
  }
}

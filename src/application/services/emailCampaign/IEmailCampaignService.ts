export interface IEmailCampaignService {
  addToNewsletter(email: string, name: string, formType: string, isRegister: boolean): Promise<boolean>;

  addToNewsletterDOI(email: string): Promise<boolean>;

  removeFromList(email: string, listId: number): Promise<boolean>;

  removeFromNewsletter(email: string): Promise<boolean>;

  isSubscribed(email: string): Promise<boolean>;
}
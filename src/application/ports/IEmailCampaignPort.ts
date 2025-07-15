import { EmailCampaignContact } from "../../domain/entities/EmailCampaingContact";


export interface IEmailCampingPort {
  addContact(contact: EmailCampaignContact, listIds: number[]): Promise<boolean>;

  addContactDOI(email: string): Promise<boolean>;

  isSubscribed(email: string): Promise<boolean>;

  removeContactFromList(email: string, listId: number): Promise<boolean>;

  removeContact(email: string): Promise<boolean>;
}
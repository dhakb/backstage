import { IEmailCampaignService } from "./IEmailCampaignService";
import { IEmailCampingPort } from "../../ports/IEmailCampaignPort";
import { EmailCampaignListSelector } from "../../../domain/services/EmailCampaignListSelector";
import { EmailCampaignContact } from "../../../domain/entities/EmailCampaingContact";


export class EmailCampaignService implements IEmailCampaignService {
  constructor(
    private readonly emailCampaign: IEmailCampingPort,
    private readonly productRepository: any
  ) {
  }

  async addToNewsletter(email: string, name: string, formType: string, isRegister: boolean) {
    const products = await this.productRepository.getAll();
    const listIds = EmailCampaignListSelector.getListIds(formType, products, isRegister);
    const contact = EmailCampaignContact.fromName(email, name);
    return this.emailCampaign.addContact(contact, listIds);
  }


  async addToNewsletterDOI(email: string) {
    return this.emailCampaign.addContactDOI(email);
  }

  async removeFromList(email: string, listId: number) {
    return this.emailCampaign.removeContactFromList(email, listId);
  }

  async removeFromNewsletter(email: string) {
    return this.emailCampaign.removeContact(email);
  }

  async isSubscribed(email: string) {
    return this.emailCampaign.isSubscribed(email);
  }
}
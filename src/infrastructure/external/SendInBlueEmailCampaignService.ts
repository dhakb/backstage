import sendInBlue from "sib-api-v3-sdk";


const defaultClient = sendInBlue.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API_KEY;
const apiInstance = new sendInBlue.ContactsApi();


import { EmailCampaignContact } from "../../domain/entities/EmailCampaingContact";
import { IEmailCampingPort } from "../../application/ports/IEmailCampaignPort";


export class SendInBlueEmailCampaignService implements IEmailCampingPort {
  async addContact(contact: EmailCampaignContact, listIds: number[]): Promise<boolean> {
    const createContact = new sendInBlue.CreateContact();
    createContact.email = contact.email;
    createContact.attributes = {
      FIRSTNAME: contact.firstName || undefined,
      LASTNAME: contact.lastName || undefined,
      FULL_NAME: contact.fullName || undefined
    };
    createContact.listIds = listIds;
    createContact.updateEnabled = true;

    try {
      await apiInstance.createContact(createContact);
      return true;
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return false;
    }
  }

  async addContactDOI(email: string): Promise<boolean> {
    const createDoiContact = new sendInBlue.CreateDoiContact();
    createDoiContact.email = email;
    createDoiContact.includeListIds = [99];
    createDoiContact.templateId = 161;
    createDoiContact.redirectionUrl = "https://company.com/?doiconfirm=true";

    try {
      await apiInstance.createDoiContact(createDoiContact);
      return true;
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return false;
    }
  }

  async isSubscribed(email: string): Promise<boolean> {
    try {
      const data = await apiInstance.getContactInfo(email);
      return data?.listIds?.includes(16) || data?.listIds?.includes(99);
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return false;
    }
  }

  async removeContactFromList(email: string, listId: number): Promise<boolean> {
    try {
      const contactEmails = new sendInBlue.RemoveContactFromList();
      contactEmails.emails = [email];
      await apiInstance.removeContactFromList(listId, contactEmails);
      return true;
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return false;
    }
  }

  async removeContact(email: string): Promise<boolean> {
    const contactEmails = new sendInBlue.RemoveContactFromList();
    contactEmails.emails = [email];

    try {
      await apiInstance.deleteContact(email);
      return true;
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return false;
    }
  }
}
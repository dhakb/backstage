import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { config } from "../../../config/config";
import { IMailer } from "../../ports/IMailer";
import { ICustomerAuthService } from "./ICustomerAuthService";
import { ILicensingService } from "../../ports/ILicensingService";
import { getEmailAddress } from "../../../common/utils/emailAddress";
import {
  getAccountCreatedEmailHtml,
  getAccountCreatedWithTrialEmailHtml,
  getConfirmEmailHtml
} from "../../../common/utils/emailHtml";
import { UnverifiedUser } from "../../../domain/entities/UnverifiedUser";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailCampaignService } from "../emailCampaign/IEmailCampaignService";
import { IUnverifiedUserRepository } from "../../../domain/repositories/IUnverifiedUserRepository";
import { CustomerRegisterDto } from "../../../api/dtos/auth/CustomerRegisterDto";
import { generateUnverifiedUserId } from "../../../common/utils/generator";
import { getWebsiteUrl } from "../../../common/utils/getUrl";
import { BadRequestError, ConflictError } from "../../../common/errors/ApiError";
import { importJSON } from "../../../common/utils/importJSON";


const {JWT_SECRET} = config;

export class CustomerAuthService implements ICustomerAuthService {
  constructor(
    private userRepository: IUserRepository,
    private unverifiedUserRepository: IUnverifiedUserRepository,
    private licenseService: ILicensingService,
    private emailCampaignService: IEmailCampaignService,
    private mailer: IMailer
  ) {
  }

  async register(data: CustomerRegisterDto) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const keygenUser = await this.licenseService.getUser(data.email);
    if (keygenUser?.data) {
      throw new ConflictError("Email already registered");
    }

    let unverifiedUserId = generateUnverifiedUserId();
    const unverifiedUser = await this.unverifiedUserRepository.findByEmail(data.email);
    if (unverifiedUser) {
      unverifiedUserId = unverifiedUser.id;
    }

    const newUnverifiedUser = UnverifiedUser.create({
      id: unverifiedUserId,
      email: data.email,
      formType: data.formType,
      trialToActivate: data.trialToActivate
    });
    await this.unverifiedUserRepository.updateOrCreate(newUnverifiedUser);

    const token = jwt.sign({id: unverifiedUserId, password: data.password}, JWT_SECRET, {expiresIn: "2h"});
    const confirmationLink = `${getWebsiteUrl()}/app/confirm-email/${token}`;

    await this.mailer.sendMail({
      from: getEmailAddress("notification"),
      to: data.email,
      subject: "Email Confirmation",
      html: getConfirmEmailHtml({confirmationLink})
    });

    if (data.willJoinNewsLetter) {
      await this.emailCampaignService.addToNewsletter(data.email, "", "", true);
    }
  }

  async confirmRegistration(token: string): Promise<void> {
    const {id, password} = jwt.verify(token, JWT_SECRET) as { id: string, password: string };

    const unverifiedUser = await this.unverifiedUserRepository.findById(id);
    if (!unverifiedUser) {
      throw new BadRequestError("Invalid Credentials or user not found");
    }

    let {email, firstName = "", lastName = "", trialToActivate, formType} = unverifiedUser;

    const {data: keygenUser, error} = await this.licenseService.createUser({firstName, lastName, email, password});
    if (!keygenUser || error) throw new Error("Email already registered. Please log in to continue.");

    let loginLink = `${getWebsiteUrl()}/app/login${formType ? `?type=${formType}` : ""}`;

    let emailData = {firstName, loginLink, password};

    const productsData: Record<string, any>[] = await importJSON("products");

    if (trialToActivate) {
      let productData = productsData.find((p) => p.id === trialToActivate);
      if (!productData) return;

      await this.licenseService.createLicense({
        name: `${productData.fullName}-Trial-${email}`,
        userId: keygenUser?.id,
        policyId: productData.policyId,
        metadata: {},
        maxMachines: undefined
      });
    }

    await this.mailer.sendMail({
      from: getEmailAddress("hello"),
      to: email,
      subject: "Account Activated",
      html: trialToActivate ? getAccountCreatedWithTrialEmailHtml(emailData) : getAccountCreatedEmailHtml(emailData)
    });

    let hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.createOrUpdate({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      keygenUserId: keygenUser.id,
      products: formType ? [formType] : []
    });

    await this.unverifiedUserRepository.deleteByEmail(email);
  }
}

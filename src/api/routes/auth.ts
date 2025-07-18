import { Router } from "express";
import { CustomerAuthController } from "../controllers/auth/CustomerAuthController";
import { CustomerAuthService } from "../../application/services/auth/CustomerAuthService";
import { PrismaUserRepository } from "../../infrastructure/database/repositories/PrismaUserRepository";
import {
  PrismaUnverifiedUserRepository
} from "../../infrastructure/database/repositories/PrismaUnverifiedUserRepository";
import { MailerService } from "../../infrastructure/email/MailerService";
import { KeygenLicensingService } from "../../infrastructure/external/KeygenLicensingService";
import { EmailCampaignService } from "../../application/services/emailCampaign/EmailCampaignService";
import { SendInBlueEmailCampaignService } from "../../infrastructure/external/SendInBlueEmailCampaignService";


const mailerService = new MailerService();
const userRepository = new PrismaUserRepository();
const unverifiedUserRepository = new PrismaUnverifiedUserRepository();
const licenseService = new KeygenLicensingService();
const emailCampaignManager = new SendInBlueEmailCampaignService();
const emailCampaignService = new EmailCampaignService(emailCampaignManager, {});
const customerAuthService = new CustomerAuthService(userRepository, unverifiedUserRepository, licenseService, emailCampaignService, mailerService);
const customerAuthController = new CustomerAuthController(customerAuthService);

const router = Router();

router.post("/register", customerAuthController.register.bind(customerAuthController));
router.post("/confirm", customerAuthController.confirmRegistration.bind(customerAuthController));

export default router;
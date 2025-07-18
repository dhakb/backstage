jest.mock("../../../../../common/utils/emailHtml", () => ({
  getConfirmEmailHtml: jest.fn()
}));


import { User } from "../../../../../domain/entities/User";
import { IMailer } from "../../../../../application/ports/IMailer";
import { ConflictError } from "../../../../../common/errors/ApiError";
import { UnverifiedUser } from "../../../../../domain/entities/UnverifiedUser";
import { CustomerAuthService } from "../../../../../application/services/auth/CustomerAuthService";
import { IUserRepository } from "../../../../../domain/repositories/IUserRepository";
import { IUnverifiedUserRepository } from "../../../../../domain/repositories/IUnverifiedUserRepository";
import { ICustomerAuthService } from "../../../../../application/services/auth/ICustomerAuthService";
import { ILicensingService } from "../../../../../application/ports/ILicensingService";
import { IEmailCampaignService } from "../../../../../application/services/emailCampaign/IEmailCampaignService";
import { CustomerRegisterDto } from "../../../../../api/dtos/auth/CustomerRegisterDto";


const mockUnvUser = new UnverifiedUser({
  id: "unv-user-1",
  email: "test@test.com",
  firstName: "Test",
  lastName: "Tester",
  trialToActivate: "ai-de-esser",
  formType: "some-form-type",
  createdAt: new Date(),
  updatedAt: new Date()
});

const mockUser = new User({
  id: 1,
  email: "test@test.com",
  firstName: "Test",
  lastName: "Tester",
  password: "unsafe-password",
  stripeCustomerId: "",
  keygenUserId: "",
  companyName: "",
  vatNumber: "",
  products: [],
  createdAt: new Date(),
  updatedAt: new Date()
});


describe("CustomerAuthService", () => {
  let userRepo: jest.Mocked<IUserRepository>;
  let unvUserRepo: jest.Mocked<IUnverifiedUserRepository>;

  let customerAuthService: ICustomerAuthService;
  let emailCampaignService: jest.Mocked<IEmailCampaignService>;
  let licenseService: jest.Mocked<ILicensingService>;
  let mailerService: jest.Mocked<IMailer>;

  let registerInput: CustomerRegisterDto = {
    email: "test@test.com",
    password: "test-password",
    formType: "some-form-type",
    trialToActivate: "product-id",
    willJoinNewsLetter: true
  };

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      createOrUpdate: jest.fn()
    };

    unvUserRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      deleteByEmail: jest.fn(),
      updateOrCreate: jest.fn()
    };

    licenseService = {
      createLicense: jest.fn(),
      createUser: jest.fn(),
      getUser: jest.fn(),
      login: jest.fn(),
      getUserAlt: jest.fn()
    };

    emailCampaignService = {
      addToNewsletter: jest.fn(),
      addToNewsletterDOI: jest.fn(),
      isSubscribed: jest.fn(),
      removeFromList: jest.fn(),
      removeFromNewsletter: jest.fn()
    };

    mailerService = {
      sendMail: jest.fn()
    };

    customerAuthService = new CustomerAuthService(userRepo, unvUserRepo, licenseService, emailCampaignService, mailerService);
  });

  describe("CustomerAuthService.register", () => {
    it("should register a user and send a confirmation email", async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      unvUserRepo.findByEmail.mockResolvedValue(null);
      licenseService.getUser.mockResolvedValue({data: null, error: {}});

      await customerAuthService.register(registerInput);

      const unvUserCreateArg = unvUserRepo.updateOrCreate.mock.calls[0][0];
      expect(unvUserCreateArg).toBeInstanceOf(UnverifiedUser);

      expect(userRepo.findByEmail).toHaveBeenCalledWith(registerInput.email);
      expect(licenseService.getUser).toHaveBeenCalledWith(registerInput.email);
      expect(unvUserRepo.findByEmail).toHaveBeenCalledWith(registerInput.email);
      expect(unvUserRepo.updateOrCreate).toHaveBeenCalledWith(expect.objectContaining({
        email: "test@test.com",
        formType: "some-form-type",
        trialToActivate: "product-id"
      }));
      expect(mailerService.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: registerInput.email,
        subject: "Email Confirmation"
      }));
      expect(emailCampaignService.addToNewsletter).toHaveBeenCalledWith(registerInput.email, "", "", true);
    });

    it("should throw ConflictError if email already taken", async () => {
      userRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(customerAuthService.register(registerInput)).rejects.toThrow(ConflictError);
      expect(licenseService.getUser).not.toHaveBeenCalled();
      expect(unvUserRepo.findByEmail).not.toHaveBeenCalled();
      expect(unvUserRepo.updateOrCreate).not.toHaveBeenCalled();
      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it("should throw ConflictError if email already exists in license service", async () => {
      licenseService.getUser.mockResolvedValue({data: {}, error: null});

      const registerInput: CustomerRegisterDto = {
        email: "test@test.com",
        password: "test-password",
        formType: "some-form-type",
        trialToActivate: "product-id",
        willJoinNewsLetter: true
      };

      await expect(customerAuthService.register(registerInput)).rejects.toThrow(ConflictError);
      expect(unvUserRepo.findByEmail).not.toHaveBeenCalled();
      expect(unvUserRepo.updateOrCreate).not.toHaveBeenCalled();
      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it("should reuse existing unverified user ID if found", async () => {
      unvUserRepo.findByEmail.mockResolvedValue(mockUnvUser);
      licenseService.getUser.mockResolvedValue({data: null, error: {}});

      await customerAuthService.register(registerInput);

      const unvUserCreateArg = unvUserRepo.updateOrCreate.mock.calls[0][0];

      expect(unvUserCreateArg.id).toBe(mockUnvUser.id);
    });
  });

  it("should not add user to newsletter if willJoinNewsletter is false", async () => {
    await customerAuthService.register({...registerInput, willJoinNewsLetter: false});

    expect(emailCampaignService.addToNewsletter).not.toHaveBeenCalled();
  });

  it("should propagate error if mailer.sendMail fails", async () => {
    const mailError = new Error("SMTP connection failed");
    mailerService.sendMail.mockRejectedValue(mailError);

    await expect(customerAuthService.register(registerInput)).rejects.toThrow("SMTP connection failed");

    expect(emailCampaignService.addToNewsletter).not.toHaveBeenCalled();
  });
});
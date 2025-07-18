import type { Request, Response } from "express";
import type { ICustomerAuthService } from "../../../application/services/auth/ICustomerAuthService";
import { CustomerRegisterSchema } from "../../dtos/auth/CustomerRegisterDto";


export class CustomerAuthController {
  constructor(private readonly customerAuthService: ICustomerAuthService) {
  }

  async register(req: Request, res: Response) {
    const parseResult = CustomerRegisterSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({error: parseResult.error.message});
      return;
    }
    const dto = parseResult.data;

    await this.customerAuthService.register(dto);

    res.status(201).json({
      success: true,
      message: "A confirmation link has been sent to your email address!"
    });
  }


  async confirmRegistration(req: Request, res: Response) {
    const {token} = req.params;
    if (!token) {
      res.status(400).json({error: "No token was provided!"});
    }

    await this.customerAuthService.confirmRegistration(token);

    res.status(201).json({
      success: true,
      message: "Account created!"
    });
  }
}
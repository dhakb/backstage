import type { CustomerRegisterDto } from "../../../api/dtos/auth/CustomerRegisterDto";


export interface ICustomerAuthService {
  register(data: CustomerRegisterDto): Promise<void>;

  confirmRegistration(token: string): Promise<void>;
}
type KeygenApiResponse = { data: Record<string, any> | null, error: Record<string, any> | null | undefined }


export interface ILicensingService {
  getUser(identifier: string): Promise<KeygenApiResponse>;

  createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<KeygenApiResponse>;

  login(credentials: string): Promise<KeygenApiResponse>;

  getUserAlt(identifier: string): Promise<KeygenApiResponse>;

  createLicense(data: {
    name: string;
    policyId: string;
    userId: string;
    metadata: {};
    maxMachines: string | undefined
  }): Promise<KeygenApiResponse>;
}
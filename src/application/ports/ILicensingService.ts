type KeygenApiResponse = { data: {} | null, error: {} | null | undefined }


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
}
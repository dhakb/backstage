import fs from "node:fs";
import path from "node:path";
import axios, { AxiosError } from "axios";
import { ILicensingService } from "../../application/ports/ILicensingService";


const {
  KG_PWD,
  KEYGEN_API_URL,
  KEYGEN_ACCOUNT_ID,
  KEYGEN_ADMIN_TOKEN,
  KEYGEN_ADMIN_TOKEN_BACKUP
} = process.env;

type KeygenApiResponse = { data: {} | null, error: {} | null | undefined }


export class KeygenLicensingService implements ILicensingService {
  async checkKeygenToken() {
    try {
      let {data: getUserAltData, error: getUserAltError} = await this.getUserAlt("techivation@gmail.com");

      // @ts-ignore
      if (!getUserAltData || getUserAltError.status !== 401) return;

      let keygenCredentials = Buffer.from(`${"info@techivation.com"}:${KG_PWD}`).toString("base64");

      let {data: loginData, error: loginError} = await this.login(keygenCredentials);

      if (loginError) {
        // @ts-ignore
        throw new Error(loginError.message || "Failed to log in to Keygen");
      }

      // @ts-ignore
      if (!loginData?.attributes?.token) {
        throw new Error("No token received from Keygen login");
      }

      // @ts-ignore
      KeygenLicensingService.saveNewAdminToken(loginData.attributes.token);
      console.log("Keygen admin token refreshed");
    } catch (err) {
      const error = err as AxiosError;

      console.error(`Failed to check (refresh) Keygen token: ${error.message}`);
    }
  }

  async getUser(identifier: string): Promise<KeygenApiResponse> {
    try {
      let response = await axios.get(
        `${KEYGEN_API_URL}/accounts/${KEYGEN_ACCOUNT_ID}/users/${identifier}`,
        KeygenLicensingService.buildAuthHeaders("Bearer")
      );

      return {data: response.data.data, error: null};
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) await this.checkKeygenToken();

      return {data: null, error: error.response};
    }
  }

  async getUserAlt(identifier: string): Promise<KeygenApiResponse> {
    try {
      let response = await axios.get(
        `${KEYGEN_API_URL}/accounts/${KEYGEN_ACCOUNT_ID}/users/${identifier}`,
        KeygenLicensingService.buildAuthHeaders("Bearer")
      );

      return {data: response.data.data, error: null};
    } catch (err) {
      const error = err as AxiosError;

      return {data: null, error: error.response};
    }
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string
  }): Promise<KeygenApiResponse> {
    try {
      const body = {
        data: {
          type: "users",
          attributes: {
            firstName: data.firstName ? data.firstName : "",
            lastName: data.lastName ? data.lastName : "",
            email: data.email ? data.email : "",
            password: data.password ? data.password : ""
          }
        }
      };

      let response = await axios.post(
        `${KEYGEN_API_URL}/accounts/${KEYGEN_ACCOUNT_ID}/users`,
        body,
        KeygenLicensingService.buildAuthHeaders("Bearer")
      );

      return {data: response.data.data, error: null};
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) await this.checkKeygenToken();

      return {data: null, error: error.response};
    }
  }

  async login(credentials: string): Promise<KeygenApiResponse> {
    try {
      let response = await axios.post(
        `${KEYGEN_API_URL}/accounts/${KEYGEN_ACCOUNT_ID}/tokens`,
        {},
        KeygenLicensingService.buildAuthHeaders("Basic", credentials)
      );

      return {data: response.data.data, error: null};
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) await this.checkKeygenToken();

      return {data: null, error: error.response};
    }
  }


  private static saveNewAdminToken(newToken: string) {
    let envLine = `KEYGEN_ADMIN_TOKEN_BACKUP="${newToken}"`;
    let envPath = path.resolve(__dirname, "../../.env.backup");

    fs.writeFileSync(envPath, envLine, "utf-8");

    console.log(`🔄 New Keygen token written to ${envPath}`);
  }

  private static buildAuthHeaders(authType: string, authToken?: string) {
    const token = authToken || KEYGEN_ADMIN_TOKEN_BACKUP || KEYGEN_ADMIN_TOKEN;

    return {
      headers: {
        Authorization: `${authType} ${token}`
      }
    };
  }
}
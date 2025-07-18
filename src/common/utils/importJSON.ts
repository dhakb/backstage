import path from "node:path";
import fs from "fs/promises";
import axios from "axios";
import { getApiUrl } from "./getUrl";


export const importJSON = async (fileName: string): Promise<Record<string, any>[]> => {
  let data;

  try {
    const filepath = path.resolve(__dirname, `../public/json/${fileName}.json`);
    data = await fs.readFile(filepath, "utf8");
    data = JSON.parse(data);

    if (!data) {
      const response = await axios.get(`${getApiUrl()}/json/${fileName}.json`);
      data = response.data;
    }

    return data;
  } catch (err) {
    const error = err as Error;

    throw Error(error.message);
  }
};

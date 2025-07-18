import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({path: "./.env"});
dotenv.config({path: "./.env.backup"});


const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("8080"),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.url(),
  EMAIL_PROVIDER: z.string(),
  SIB_USER: z.string(),
  SIB_PASS: z.string(),
  SG_USER: z.string(),
  SG_PASS: z.string(),
  CP_USER: z.string(),
  CP_PASS: z.string(),
  KG_PWD: z.string(),
  KEYGEN_API_URL: z.string(),
  KEYGEN_ACCOUNT_ID: z.string(),
  KEYGEN_ADMIN_TOKEN: z.string(),
  KEYGEN_ADMIN_TOKEN_BACKUP: z.string()
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
  console.error("Invalid environment variable:", JSON.stringify(z.treeifyError(env.error)));
  process.exit(1);
}

export const config = env.data;
import { z } from "zod";


export const CustomerConfirmRegistrationSchema = z.object({
  token: z.jwt()
});

export type CustomerConfirmRegistrationDto = z.infer<typeof CustomerConfirmRegistrationSchema>;
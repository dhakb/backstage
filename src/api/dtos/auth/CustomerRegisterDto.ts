import { z } from "zod";


export const CustomerRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  trialToActivate: z.string().optional(),
  formType: z.string().optional(),
  willJoinNewsLetter: z.boolean()
});

export type CustomerRegisterDto = z.infer<typeof CustomerRegisterSchema>;
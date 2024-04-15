import { object, string, TypeOf } from "zod";

export const loginSchema = {
  body: object({
    email: string({
      required_error: "email is required",
    }).email("NOt a valid Email"),
    password: string({
      required_error: "Password is required",
    }),
  }),
};

export type LoginBody = TypeOf<typeof loginSchema.body>;

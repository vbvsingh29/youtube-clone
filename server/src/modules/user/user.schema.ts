import { object, string, TypeOf } from "zod";

export const registerUserSchema = {
  body: object({
    username: string({
      required_error: "username is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("NOt a valid Email"),
    password: string({
      required_error: "Password is required",
    })
      .min(6, "Password must be at leat 6 characters Long")
      .max(64, "Password must not be longer than 64 characters"),
    confirmPassword: string({
      required_error: "Confirm Password is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
};

export type RegisterUserBody = TypeOf<typeof registerUserSchema.body>;

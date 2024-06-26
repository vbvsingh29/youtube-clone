import { Request, Response } from "express";
import { findUserByEmail } from "../user/user.service";
import { StatusCodes } from "http-status-codes";
import { signJwt } from "./auth.utils";
import omit from "../../helpers/omit";
import { LoginBody } from "./auth.schema";
import { UserDocument } from "../user/user.model";
import { CORS_ORIGIN } from "../../utils/constants";

export async function loginHandler(
  req: Request<{}, {}, LoginBody>,
  res: Response
) {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || !user.comparePassword(password)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Invalid Email or Password");
    }
    const payload = omit((user as UserDocument).toJSON(), ["password", "__v"]);
    const jwt = signJwt(payload);

      // res.cookie("accessToken", jwt, {
      //   maxAge: 3.154e10, // 1 year
      //   httpOnly: true,
      //   domain: ".onrender.com",
      //   path: "/",
      //   sameSite: "none",
      //   secure: true,
      // });

    return res.status(StatusCodes.OK).send(jwt);
  } catch (e: any) {}
}

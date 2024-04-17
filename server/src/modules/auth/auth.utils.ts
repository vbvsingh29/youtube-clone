import jwt from "jsonwebtoken";
import { EXPIRES_IN, JWT_SECRET } from "../../utils/constants";

const jwt_secret = JWT_SECRET;
const expires_in = EXPIRES_IN;

export function signJwt(payload: string | Buffer | object) {
  return jwt.sign(payload, jwt_secret as string, {
    expiresIn: expires_in,
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, jwt_secret as string);
    return decoded;
  } catch (e: any) {
    return null;
  }
}

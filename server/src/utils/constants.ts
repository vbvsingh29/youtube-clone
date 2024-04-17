import "dotenv/config";

export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:1234";
export const PORT = process.env.PORT;
export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
export const JWT_SECRET = process.env.JWT_SECRET;
export const EXPIRES_IN = process.env.EXPIRES_IN;

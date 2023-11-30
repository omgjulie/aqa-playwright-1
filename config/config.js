import dotenv from "dotenv";
dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL,
  apiURL: process.env.API_URL,
  httpCredentials: {
    username: process.env.HTTP_CREDENTIALS_USERNAME,
    password: process.env.HTTP_CREDENTIALS_PASSWORD,
  },
};

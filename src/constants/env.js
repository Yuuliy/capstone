import { config } from "dotenv";
config();
export const CLIENT_URL = process.env.CLIENT_URL;

export const PORT = process.env.SERVER_PORT;
export const HOST = process.env.SERVER_HOST;

export const REDIS_URL = process.env.REDIS_URL;
export const DATABASE_URI = process.env.DATABASE_URI;

export const GOOGLE_CLIENT_ID= process.env.GOOGLE_CLIENT_ID;

export const SHOP_EMAIL = process.env.SHOP_EMAIL;
export const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;
export const EXPIRES_ACCESS_TOKEN = process.env.EXPIRES_ACCESS_TOKEN;
export const EXPIRES_REFRESH_TOKEN = process.env.EXPIRES_REFRESH_TOKEN;

export const TMN_CODE = process.env.TMN_CODE;
export const VNPAY_SECRET_KEY = process.env.VNPAY_SECRET_KEY;
export const VNPAY_URL = process.env.VNPAY_URL;
export const VNP_API = process.env.VNP_API;
export const CURR_CODE = process.env.CURR_CODE;

export const SERVER_URL = process.env.APP_ENV === 'staging' ? process.env.SERVER_URL : `http://${HOST}:${PORT}`;

export const FIRE_BASE_API_KEY = process.env.FIRE_BASE_API_KEY;
export const FIRE_BASE_AUTH_DOMAIN = process.env.FIRE_BASE_AUTH_DOMAIN;
export const FIRE_BASE_PROJECT_ID = process.env.FIRE_BASE_PROJECT_ID;
export const FIRE_BASE_STORAGE_BUCKET = process.env.FIRE_BASE_STORAGE_BUCKET;
export const FIRE_BASE_MESSAGING_SENDER_ID = process.env.FIRE_BASE_MESSAGING_SENDER_ID;
export const FIRE_BASE_APP_ID = process.env.FIRE_BASE_APP_ID;
export const FIRE_BASE_MEASUREMENT_ID = process.env.FIRE_BASE_MEASUREMENT_ID;

export const GHTK_TOKEN = process.env.GHTK_TOKEN;
export const GHTK_ENDPOINT = process.env.GHTK_ENDPOINT;
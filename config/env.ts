import { config } from 'dotenv';

config();

export const env = {
  pgdb: {
    host: process.env.POSTGRES_HOST || 'localhost',
    name: process.env.POSTGRES_DB_NAME || '',
    username: process.env.POSTGRES_USERNAME || '',
    password: process.env.POSTGRES_PASSWORD || '',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
  },
  jwt: {
    secret: process.env.ACCESS_TOKEN_KEY || '',
    expiry: process.env.ACCESS_TOKEN_EXPIRY || '30m',
  },
};

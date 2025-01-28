import dotenv from 'dotenv';
dotenv.config();

const config = {
  app: {
    PORT: process.env.PORT || 3000,
  },
  database: {
    MONGO_URI: process.env.MONGO_URI,
  },
  security: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  email: {
    USER: process.env.USER,
    PASS: process.env.PASS
  }
};

export default config;

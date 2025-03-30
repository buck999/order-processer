import { config } from "dotenv";
import { cleanEnv, port, str, url } from "envalid";

config({
  path: ".env"
});

export const env = cleanEnv(process.env, {
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_HOST: str(),
  POSTGRES_PORT: port({ default: 5432 }),
  POSTGRES_DB: str(),

  MONGO_INITDB_ROOT_USERNAME: str(),
  MONGO_INITDB_ROOT_PASSWORD: str(),
  MONGO_HOST: str(),
  MONGO_PORT: port({ default: 27017 }),
  MONGO_INITDB_DATABASE: str(),

  RABBITMQ_DEFAULT_USER: str(),
  RABBITMQ_DEFAULT_PASS: str(),
  RABBITMQ_HOST: str(),
  RABBITMQ_PORT: port({ default: 5672 }),

  PORT: port({ default: 3000 }),
  FRONTEND_URL: url()
});

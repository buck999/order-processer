import { MongoClient } from "mongodb";

import { env } from "./env";

let clientMongo: MongoClient;

export async function connectMongo() {
  const client = new MongoClient(
    `mongodb://${env.MONGO_INITDB_ROOT_USERNAME}:${env.MONGO_INITDB_ROOT_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}`
  );
  await client.connect();
  clientMongo = client;
}

export function getClientMongo() {
  if (!clientMongo.db()) throw new Error("MongoDB not connected");
  return clientMongo;
}

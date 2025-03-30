import { connectMongo, getClientMongo } from "../config/database.mongo";

async function createCollection() {
  try {
    await connectMongo();
    const clientMongo = getClientMongo();
    const db = clientMongo.db("orders");
    const collections = await db.listCollections({ name: "logs" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("logs");
      console.log("Collection 'logs' created.");
    } else {
      console.log("Collection 'logs' already exists.");
    }
  } catch (error) {
    console.error("Error creating collection:", error);
  }
}

// Run the collection creation
export const initializeMongoDatabase = async () => {
  try {
    await createCollection();
  } catch (error) {
    console.error("Mongo database initialization failed:", error);
  }
};

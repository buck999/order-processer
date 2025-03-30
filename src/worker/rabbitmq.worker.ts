import amqp from "amqplib";

import { env } from "../config/env";
import postgresPool from "../config/database.postgres";
import { connectMongo, getClientMongo } from "../config/database.mongo";
import { Order } from "../orders/orders.model";
import { Collection } from "mongodb";
import { Log } from "./log.model";

async function logOperation(logsCollection: Collection, log: Log) {
  console.log("Logging operation:", log);
  await logsCollection.insertOne(log);
}

async function processOrder(orderId: number) {
  const clientMongo = getClientMongo();
  const logsCollection = clientMongo.db("orders").collection("logs");

  try {
    // Fetch and validate order
    const res = await postgresPool.query("SELECT * FROM orders WHERE id = $1", [orderId]);
    const order = res.rows[0];
    if (!order || order.status !== "pending") {
      console.log(`Order ${orderId} not found or not pending`);
      return;
    }

    // Start processing
    await postgresPool.query<Order>(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      ["processing", orderId]
    );
    await logOperation(logsCollection, {
      order_id: orderId,
      timestamp: new Date(),
      message: "Processing started"
    });

    // Simulate work (e.g., 5 seconds delay)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Simulate occasional failure (10% chance)
    if (Math.random() < 0.1) throw new Error("Simulated failure");

    // Process task (e.g., reverse the string)
    const result = order.task.split("").reverse().join("");

    // Complete processing
    await postgresPool.query(
      "UPDATE orders SET status = $1, result = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      ["completed", result, orderId]
    );
    await logOperation(logsCollection, {
      order_id: orderId,
      timestamp: new Date(),
      message: "Processing completed"
    });
  } catch (error) {
    // Handle failure
    console.error(`Error processing order ${orderId}:`, error);
    await postgresPool.query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      ["failed", orderId]
    );
    await logOperation(logsCollection, {
      order_id: orderId,
      timestamp: new Date(),
      message: `Processing failed: ${(error as Error).message}`
    });
  }
}

async function startWorker() {
  await connectMongo();
  const connection = await amqp.connect(
    `amqp://${env.RABBITMQ_DEFAULT_USER}:${env.RABBITMQ_DEFAULT_PASS}@${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`
  );
  const channel = await connection.createChannel();
  await channel.assertQueue("order_processing", { durable: true });

  channel.consume("order_processing", async (msg) => {
    if (msg) {
      const { orderId } = JSON.parse(msg.content.toString());
      await processOrder(orderId);
      channel.ack(msg);
    }
  });
  console.log("Worker started, waiting for messages...");
}

startWorker().catch(console.error);

import amqp from "amqplib";

import { env } from "../config/env";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(
    `amqp://${env.RABBITMQ_DEFAULT_USER}:${env.RABBITMQ_DEFAULT_PASS}@${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`
  );
  channel = await connection.createChannel();
  await channel.assertQueue("order_processing", { durable: true });
}

export async function publishToQueue(queue: string, message: string) {
  if (!channel) await connectRabbitMQ();
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
}

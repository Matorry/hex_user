import amqp from "amqplib";
import { UserEventBus } from "../domain/UserEventBus";

export class UserRabbitMQPublisher implements UserEventBus {
  private channel!: amqp.Channel;

  constructor(
    private readonly queueName: string = "user-events",
    private readonly url: string = process.env.RABBITMQ_URL || "amqp://localhost"
  ) { }

  async connect(): Promise<void> {
    const conn = await amqp.connect(this.url);
    this.channel = await conn.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  async publish(event: { type: string; data: any }): Promise<void> {
    if (!this.channel) throw new Error("RabbitMQ not connected");
    const message = Buffer.from(JSON.stringify(event));
    this.channel.sendToQueue(this.queueName, message, { persistent: true });
  }
}

import amqp from "amqplib";
import { UserRabbitMQPublisher } from "../../../../src/user/infrastructure/UserRabbitMQPublisher";

jest.mock("amqplib");

describe("Given the UserRabbitMQPublisher", () => {
  let publisher: UserRabbitMQPublisher;
  const mockChannel = {
    assertQueue: jest.fn(),
    sendToQueue: jest.fn(),
  };

  const mockConnection = {
    createChannel: jest.fn().mockResolvedValue(mockChannel),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);
    publisher = new UserRabbitMQPublisher("test-queue", "amqp://test-url");
  });

  describe("When connect is called", () => {
    test("Then it should create a channel and assert the queue", async () => {
      await publisher.connect();

      expect(amqp.connect).toHaveBeenCalledWith("amqp://test-url");
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith("test-queue", { durable: true });
    });
  });

  describe("When publish is called after connect", () => {
    test("Then it should send the event to the queue", async () => {
      await publisher.connect();
      const event = { type: "UserCreated", data: { id: "123" } };

      await publisher.publish(event);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        "test-queue",
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
      );
    });
  });

  describe("When publish is called without connecting first", () => {
    test("Then it should throw an error", async () => {
      await expect(
        publisher.publish({ type: "UserCreated", data: { id: "123" } })
      ).rejects.toThrow("RabbitMQ not connected");
    });
  });
  
});

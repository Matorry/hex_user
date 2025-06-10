import cors from "cors";
import express from 'express';
import morgan from "morgan";
import authRoutes from "./adapter/http/authRoutes";
import userRoutes from "./adapter/http/userRoutes";
import { swaggerDocs } from "./shared/middlewares/swagger";
import { UserRabbitMQPublisher } from "./user/infrastructure/UserRabbitMQPublisher";

export const createApp = async () => {
  const publisher = new UserRabbitMQPublisher();
  await publisher.connect();

  const app = express();

  // Pasa el publisher como dependencia a los routers
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors());
  app.use("/users", userRoutes(publisher));
  app.use("/auth", authRoutes);
  app.use("/docs", swaggerDocs.serve, swaggerDocs.setup);

  return app;
};

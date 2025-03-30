import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import errorMiddleware from "./middleware/error.middleware";
import { type Controller } from "./interfaces/controller.interface";
import { initializePostgresDatabase } from "./db/setup.postgres";
import { initializeMongoDatabase } from "./db/setup.mongo";

class App {
  private app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    initializePostgresDatabase();
    initializeMongoDatabase();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);

    this.app.use(errorMiddleware);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/api/v1", controller.router);
    });
  }

  public listen() {
    this.app.listen(env.PORT, () => {
      console.log(`App listening on the port ${env.PORT}`);
    });
  }
}

export default App;

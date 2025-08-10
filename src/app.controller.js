import express from "express";
import dotenv from "dotenv";
import { globalErrorHandling } from "./utils/response.js";
import connectDB from "./DB/connection.db.js";
dotenv.config({ path: "./src/config/.env.dev" });
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";

const bootstrap = async () => {
  const app = express();
  const port = Number(process.env.PORT);

  await connectDB();

  app.use(express.json());

  app.get("/", (req, res, next) => {
    res.json({ message: "welcome to app" });
  });

  app.use("/auth", authController);
  app.use("/user", userController);

  app.all("/*dummy", (req, res, next) => {
    res.status(404).json({ message: "404 page not found" });
  });

  app.use(globalErrorHandling);

  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
};

export default bootstrap;

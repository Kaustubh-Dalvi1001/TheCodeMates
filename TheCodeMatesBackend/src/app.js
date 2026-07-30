import "dotenv/config";
import express from "express";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRouter.js";
import { userProfileRouter } from "./routes/userProfileRouter.js";
import { connectionReqRouter } from "./routes/connectionReqRouter.js";
import { userRouter } from "./routes/userRouter.js";

// Creating an express server.
const app = express();

// Converts request body into JSON so that all RH can read it.
app.use(express.json());
// Parses cookies so that all the RH can read it.
app.use(cookieParser());

// Routers
app.use("/", authRouter);
app.use("/", userProfileRouter);
app.use("/", connectionReqRouter);
app.use("/", userRouter);

// Error handling
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON in request body.",
    });
  }

  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

// Server and mongodb
const startServer = () => {
  app.listen(1001, () => {
    console.log("server is up at PORT 1001");
  });
};

connectDB(startServer);

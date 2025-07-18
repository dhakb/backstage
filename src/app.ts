import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config({path: "./.env"});
dotenv.config({path: "./.env.backup"});


import authRoutes from "./api/routes/auth";


const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.status(200).json({message: "API is healthy!"});
  });

  app.use("/auth", authRoutes);

  return app;
};


export { createApp };
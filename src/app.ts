import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();


const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.status(200).json({message: "API is healthy!"});
  });


  return app;
};


export { createApp };
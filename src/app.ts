import express, { type Request, type Response } from "express";

const app = express();
import cors from "cors";


app.use(express.json());
app.use(cors())


app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Ride Booking System Backend is running");
});

export default app;

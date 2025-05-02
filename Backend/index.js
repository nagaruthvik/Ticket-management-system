import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import errorLogger from "./middleware/errorLogs.js"; 
import dotenv from "dotenv";
import bodyParser from "body-parser";
import chatRouter from "./routes/chatRoutes.js";
import chatbotRouter from "./routes/chatbotRoutes.js";

const app = express();

dotenv.config();
app.use(bodyParser.json());
app.use(cors({ origin: "hhttps://ticket-management-system-amber.vercel.app", credentials: true }));
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/chatbot",chatbotRouter);
app.use(errorLogger); 

mongoose
  .connect(
    "mongodb+srv://nagaruthvik66:X4u6GyTCKIvyjAlW@cluster0.b1pgini.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("connected to mongodb"));
app.listen(4000, () => {
  console.log("lisiting to 4000"); 
});


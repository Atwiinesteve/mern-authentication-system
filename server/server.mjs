import express, { request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { dbConnection } from "./database/database.connector.mjs";

dbConnection();

config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.get("/", (request, response) => {
  return response.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

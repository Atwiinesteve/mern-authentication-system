import express, { request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { dbConnection } from "./database/database.connector.mjs";
import Router from "./routes/user.routes.mjs";

dbConnection();

config();

const app = express();
const PORT = process.env.PORT;

// app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/server-test", (request, response) => {
  return response.send("Server is running");
});

app.use("/", Router);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

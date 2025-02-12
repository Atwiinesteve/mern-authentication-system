import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.mjs";

const Router = express.Router();

Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.post("/logout", logoutUser);

export default Router;

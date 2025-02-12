import express from "express";
import {
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.mjs";

const Router = express.Router();

Router.get("/users", getAllUsers)
Router.get("/users/:id", getUserById)
Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.post("/logout", logoutUser);

export default Router;

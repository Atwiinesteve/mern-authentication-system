import bcrypt from "bcrypt";

import userModel from "../model/user.model.mjs";

// get all users.
export const getAllUsers = async (request, response) => {
  try {
    const users = await userModel.find();
    if (users.length === 0)
      return response.status(404).json({ message: "No users found" });
    return response.json({ message: users });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};

// get a user by id.
export const getUserById = async (request, response) => {
  try {
    const id = request.body.id;
    const user = await userModel.findById(id);
    if (!user)
      return response
        .status(404)
        .json({ message: `User with id: ${id} was not Found.` });
    return response.json({ message: user });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};

// register user
export const registerUser = async (request, response) => {
  try {
    const existingUser = await userModel.findOne({
      email: request.body.email,
    });
    if (existingUser) {
      return response.status(200).json({ message: "User already exists." });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(request.body.password, salt);
      const newUser = userModel.create({
        name: request.body.name,
        email: request.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      response.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return response
        .status(200)
        .json({ message: "User registered successfully", token });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Error while registering user." + error });
  }
};

// login user
export const loginUser = async (request, response) => {
  try {
    const user = await userModel.findOne({ email: request.body.email });
    if (!user) {
      return response.status(404).json({ message: "User not found." });
    } else {
      const validPassword = await bcrypt.compare(
        request.body.password,
        user.password
      );
      if (!validPassword) {
        return response.status(401).json({ message: "Invalid credentials." });
      } else {
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );
        response.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return response
          .status(200)
          .json({ message: "User logged in successfully", token });
      }
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Error while logging in user." });
  }
};

// logout user
export const logoutUser = async (request, response) => {
  try {
    response.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return response
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Error while logging out user." });
  }
};

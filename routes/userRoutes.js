const express = require("express");
const userRoutes = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

userRoutes.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const registerUser = await userModel.findOne({ email });

    if (registerUser) {
      return res.status(400).send({ msg: "User has been already registerd" });
    }

    const hashPassword = await bcrypt.hash(password, 8);
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
    });
    return res
      .status(200)
      .send({ msg: "User has been registerd successfully", user });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCheck = await userModel.findOne({ email });
    if (!userCheck) {
      return res.status(400).send("User doesn't exist");
    }

    const passwordCheck = await bcrypt.compare(password, userCheck.password);
    if (passwordCheck) {
      const token = jwt.sign({ userID: userCheck._id }, process.env.SECRET_KEY);

      return res.status(200).send({ msg: "Login successful!", token });
    } else {
      return res.status(400).send("Incorrect Password");
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

userRoutes.get("/logout", async (req, res) => {
  try {
    return res.status(200).send({ mag: "Logout Successfully" });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = userRoutes;

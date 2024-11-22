import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  // console.log(req.body);
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword});
  try {
    await newUser.save();
    res.status(201).json({
      message: "User created Successfully",
    });
  } catch (error) {
    next(error)
  }
};

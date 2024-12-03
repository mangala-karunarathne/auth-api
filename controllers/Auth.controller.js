import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json({
      message: "User created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const ValidUser = await User.findOne({ email });

    if (!ValidUser) return next(errorHandler(404, "User Not Found"));

    const validPassword = bcryptjs.compareSync(password, ValidUser.password);

    if (!validPassword) return next(errorHandler(401, "Wrong Credentials"));

    const token = jwt.sign({ id: ValidUser._id }, process.env.JWT_SECRET);

    const { password: hashPassword, ...rest } = ValidUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); //1 hour
    res
      .cookie("access_taken", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

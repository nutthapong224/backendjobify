import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword } from "../utills/passwordUtill.js";
import { UnauthenticatedError } from "../error/customerror.js";
import { createJWT } from "../utills/tokenUtill.js";
export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ mgs: "user created" });
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new UnauthenticatedError("Invalid credentials"); // Throw error if user is not found
    }

    const isValidUser = await comparePassword(req.body.password, user.password);
    if (!isValidUser) {
      throw new UnauthenticatedError("Invalid credentials"); // Throw error if password is invalid
    }

    const token = createJWT({ userId: user._id, role: user.role });

    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
    });

    res.status(StatusCodes.OK).json({ msg: "User logged in" });
  } catch (err) {
    // Pass error to Express error handling middleware
    next(err);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out " });
};

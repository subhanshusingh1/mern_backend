// import modules
import asyncHandler from "express-async-handler";
import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select("-password");
      next();
    } catch (error) {
      res.status(400).json({
        success: true,
        message: `Not Authorized, Invalid Token`,
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: `Not Authorized, Token Not Found!!!`,
    });
  }
});

export default protect;

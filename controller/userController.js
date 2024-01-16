// import modules
import asyncHandler from "express-async-handler";

// import files
import User from "../model/UserModel.js";
import OTP from "../model/otpModel.js";
import generateOtp from "../util/otp.js";
import sendMail from "../util/sendMail.js";

//@Desc User Registeration
//@route POST /api/v1/users/
const userRegister = asyncHandler(async (req, res) => {
  // getting input from the user
  const { name, email, password, mobile } = req.body;

  // check is user exists
  const userInfo = await User.findOne({ email });
  const otpInfo = await OTP.findOne({ email });

  if (userInfo && otpInfo) {
    return res.status(400).send({ message: "User Already Exists!!" });
  }

  // Register User
  const user = await User.create({
    name,
    email,
    password,
    mobile,
  });

  // create OTP document with email and createdAt ( as default Value )
  await OTP.create({
    email,
  });

  // create json web token
  const token = await user.createJwt(res);

  // show response to console
  if (user) {
    res.status(201).send({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      token,
    });
  } else {
    res.status(500).send({
      success: false,
      message: `User can't Be Created`,
    });
  }
});

//@Desc Generate OTP for verification
//@Route GET /api/v1/users/otp-generate
const userOtpGenerate = asyncHandler(async (req, res) => {
  // get email from user
  const { email } = req.body;

  // check for requested user
  let user = await OTP.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "Not User Found Requested Email" });
  }

  // generate OTP
  const otp = await generateOtp();

  // // checking 1 minutes Gap between OTP requests
  const currentTime = new Date();
  const timeDifference = currentTime - user.createdTime;

  if (user.createdTime && timeDifference < 60000) {
    return res
      .status(403)
      .json({ message: "Minimum 1-min Gap Between OTP Requests" });
  }

  // save otp again
  user.otp = otp;
  user.createdTime = currentTime;
  await user.save();

  // response
  if (user) {
    await sendMail(req, res, email, otp);
    res.status(201).send({
      success: true,
      message: "OTP Send to Email Successfully",
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Please Try Again",
    });
  }
});

//@Desc User Login
//@Route Post /api/v1/users/login
const userLogin = asyncHandler(async (req, res) => {
  // Get all Users Data
  const { email, password, otp } = req.body;

  // Check is User is Registered
  const user = await User.findOne({ email });
  const otpData = await OTP.findOne({ email });

  if (!user || !otpData) {
    return res
      .status(400)
      .send({ message: "User Does Not Exists. Please Register" });
  }

  // create jsonweb token
  const token = await user.createJwt(res);

  // Authentication Logic if Password is provided
  if (password && user.comparePassword(password)) {
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
      },
      message: `User Logged In`,
    });
  }

  // Authentication logic is OTP is provided
  if (otp && otpData.otp === otp) {
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
      },
      message: `User Verified, Successful Login`,
      token,
    });
  }

  return res.status(400).json({
    success: false,
    message: `Cant Login Invalid Credentials`,
    token,
  });
});

//@Desc Get User Profile Details
//@Route Get /api/v1/users/profile/:id
const getProfileById = asyncHandler(async (req, res) => {
  // Get User id
  const { id } = req.params;

  // Check if User Exist
  const user = await User.findById(id);

  if (!user) {
    return res.status(400).send({ message: "User Does not Exist!!!" });
  }

  // create jsonweb token
  const token = await user.createJwt(res);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
    message: `User Details Provided`,
    token,
  });
});

//@Desc Get All User Registered
//@Route Get /api/v1/users/
const getAllProfile = asyncHandler(async (req, res) => {
  // Get All User Details
  const user = await User.find({});

  if (!user) {
    return res
      .status(400)
      .json({ message: `No user found with id: ${user._id}` });
  }

  // create jsonweb token
  const token = await user.createJwt(res);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
    message: `All Users Details Provided`,
    token,
  });
});

//@Desc Update User Details
//@Route PUT /api/v1/users/profile/:id
const updatUser = asyncHandler(async (req, res) => {
  // Get User Id
  const { id } = req.params;

  // get User Details
  const { name, email, password, mobile } = req.body;

  // check user details
  const user = await User.findById(id);
  const userEmail = user.email;
  const otpdata = await OTP.findOne({ email: userEmail });

  if (!user && !otpdata) {
    return res
      .status(400)
      .json({ message: `No user found with id: ${user._id}` });
  }

  // update value provided by user in USER Model
  user.name = name;
  user.email = email;
  user.password = password;
  user.mobile = mobile;

  // update value in OTP Model
  otpdata.email = email;

  // save data to database
  await user.save();
  await otpdata.save();

  // create jsonweb token
  const token = await user.createJwt(res);

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      mobile: user.mobile,
    },
    message: `User Updated Successfully!!!`,
    token,
  });
});

//@Desc Delete User
//@Route DELETE /api/v1/users/profile/:id
const deleteUser = asyncHandler(async (req, res) => {
  // Get User Id
  const { id } = req.params;

  // Check if User Exists
  const user = await User.findById(id);
  const userEmail = user.email;
  const otpData = await OTP.findOne({email:userEmail});

  if (!user && !otpData) {
    return res
      .status(400)
      .json({ message: `No user found with id: ${user._id}` });
  }

  // delete requested user from User Model
  await User.deleteOne({ _id: user._id });

  // delete user from OTP model
  await OTP.deleteOne({ _id: otpData._id });

  // create jsonweb token
  const token = await user.createJwt(res);

  res.status(200).json({
    success: true,
    message: "User Profile Deleted Successfully!!!",
    token,
  });
});

export {
  userRegister,
  userLogin,
  userOtpGenerate,
  getProfileById,
  getAllProfile,
  updatUser,
  deleteUser,
};

require("dotenv").config();

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function index(req, res) {
  User.find({})
    .select(
      "fname lname email birthDay gender address phone profileImage latestOrderId lastLoginDate accountStatus"
    )
    .then((users) => {
      if (users.length > 0) {
        return res.status(200).json({
          message: "Users retrieved successfully!",
          method: req.method,
          url: req.originalUrl,
          total: users.length,
          users: users,
        });
      } else {
        return res.status(404).json({
          message: "No users yet!",
          method: req.method,
          url: req.originalUrl,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Server Error! please try again later",
        method: req.method,
        url: req.originalUrl,
        errorCode: err.code,
        errorMessage: err.message,
      });
    });
}

function show(req, res) {
  if (res.user) {
    return res.status(200).json({
      message: "user retrieved successfully!",
      method: req.method,
      url: req.originalUrl,
      user: res.user,
    });
  } else {
    return res.status(404).json({
      message: res.message,
      method: req.method,
      url: req.originalUrl,
    });
  }
}

function register(req, res) {
  const { fname, lname, phone, email, password } = req.body;

  if (!fname || !lname || !phone || !password || !email) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  bcrypt.hash(password, 10).then((hashedPassword) => {
    const user = new User({
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    user.save().then((u) => {
      return res.status(201).json({
        message: "User Registered Successfully",
        user: u,
      });
    });
  });
}

function updateData(req, res) {
  if (res.user) {
    const { fname, lname, birthDay, gender, address, phone } = req.body;
    const profileImage = req.file.path;

    const userFields = {
      fname,
      lname,
      birthDay,
      gender,
      address,
      phone,
      profileImage,
    };

    User.updateOne(res.user, userFields).then(() => {
      return res.status(200).json({
        message: "User Updated Successfully",
      });
    });
  } else {
    return res.status(404).json({
      message: res.message,
      method: req.method,
      url: req.originalUrl,
    });
  }
}

function deleteAccount(req, res) {
  if (res.user) {
    User.updateOne(res.user, { accountStatus: "deleted" }).then(() => {
      return res.status(200).json({
        message: "User account status set to deleted successfully",
      });
    });
  } else {
    return res.status(404).json({
      message: res.message,
      method: req.method,
      url: req.originalUrl,
    });
  }
}

function changePassword(req, res) {}

async function login(req, res) {
  if (res.user) {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    bcrypt.compare(password, user.password).then((isIdentical) => {
      if (isIdentical) {
        const token = jwt.sign({ userId: user._id }, process.env.AUTH_SECRET);
        res.header("Authorization", `Bearer ${token}`);
        console.log(res.header["Authorization"]);
        return res.status(200).json({
          message: `Welcome back ${user.fname}!`,
        });
      } else {
        return res.status(400).json({
          message: "Wrong email or password",
        });
      }
    });
  } else {
    return res.status(404).json({
      message: res.message,
      method: req.method,
      url: req.originalUrl,
    });
  }
}

// function signout(req, res) {
//   const { email, password } = req.body;
// }

module.exports = {
  index,
  show,
  register,
  updateData,
  deleteAccount,
  changePassword,
  login,
  // signout,
};

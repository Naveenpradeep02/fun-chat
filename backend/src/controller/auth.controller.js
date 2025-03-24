import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// signup
export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    //  empty check
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    //  password check
    if (password.length < 6) {
      return res.status(409).json({
        message: "Password must be 6 characters",
      });
    }

    //  User check
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // has password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (err) {
    console.log("error in signup", err.message);
    res.status(500).json({ message: "internal server Error" });
  }
};
// login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).json({
        message: "Invalid User",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        message: "invalid password",
      });
    }
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in login ", error.message);
  }
};
// logout
export const logout = (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "logout successfully !",
    });
  } catch (error) {
    console.log("error in logout ", error.message);
    res.status(500).json({ message: "internal server Error" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      res.status(400).json({
        message: "profile pic is required",
      });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    console.log("error in profile update ", error.message);
    res.status(500).json({ message: "internal server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth ", error.message);
    res.status(500).json({ message: "internal server Error" });
  }
};

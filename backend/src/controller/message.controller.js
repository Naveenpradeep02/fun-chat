import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary";
import { get } from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("error in   getUserForSidebar", error.message);
    res.status(500).json({ message: "internal server Error" });
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;

    const myId = req.user._id;
    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("error in  getMessages", error.message);
    res.status(500).json({ message: "internal server Error" });
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error in   sendMessage", error.message);
    res.status(500).json({ message: "internal server Error" });
  }
};

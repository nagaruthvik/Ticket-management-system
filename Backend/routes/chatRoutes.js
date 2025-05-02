import express from "express";
import Chat from "../models/Chats.js";
import User from "../models/User.js";
import auth from "../middleware/Authorization.js";
import mongoose from "mongoose";


const chatRouter = express.Router();

chatRouter.post("/newChat", async (req, res) => {
  try {
    const { userInfo, assignedBy, messages } = req.body;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); 
    const day = String(now.getDate()).padStart(2, "0");

   
    const ticketName = `${year}-0${month}${day}`;

    const superAdmin = await User.findOne({ role: "super_admin" });
    if (!superAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Super admin not found" });
    }

    const newChat = new Chat({
      ticketName,
      userInfo,
      assignedTo: superAdmin._id,
      assignedBy: superAdmin._id,
      messages,
    });

    const savedChat = await newChat.save();
    res.status(201).json({ success: true, data: savedChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


chatRouter.put("/addMessage/:chatId", auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;
    const { message } = req.body;

    const newMessage = {
      sender: "admin",
      senderId: userId,
      message,
      timestamp: new Date(),
    };

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: newMessage } },
      { new: true }
    );

    if (!updatedChat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, data: updatedChat });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
chatRouter.put("/addMessageUser/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const { message } = req.body;

    const newMessage = {
      sender: "user",
      message,
      timestamp: new Date(),
    };

    const updatedChat = await Chat.findOneAndUpdate(
      { "userInfo.email": email },
      { $push: { messages: newMessage } },
      { new: true }
    );

    if (!updatedChat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, data: updatedChat });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
chatRouter.put("/updateAssignedTo/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { newAssigneeId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { assignedTo: newAssigneeId },
      { new: true }
    );

    if (!updatedChat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, data: updatedChat });
  } catch (error) {
    console.error("Error updating assignee:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
chatRouter.put("/updateStatus/:chatId/:status", async (req, res) => {
  try {
    const { chatId, status } = req.params;

    if (!["resolved", "Unresolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'resolved' or 'Unresolved'",
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        status: status,
        endTime: status === "resolved" ? new Date() : null,
      },
      { new: true }
    );

    if (!updatedChat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({
      success: true,
      message: `Chat marked as "${status}"`,
      data: updatedChat,
    });
  } catch (err) {
    console.error("Error updating chat status:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

chatRouter.put("/missedChat/:chatId/:status", async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const status = req.params.status;

    if (!chatId) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    const result = await Chat.findByIdAndUpdate(
      chatId,
      { missedChat: status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: `missed chat marked as "${status}"`,
      data: result,
    });
  } catch (error) {
    console.error("Error updating chat status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

chatRouter.get("/chatsByStatus/:status", auth, async (req, res) => {
  const status = req.params.status;
  const userId = req.user.userId;



  try {
    let query = { assignedTo: userId };

    if (status === "all") {
      query.status = { $in: ["resolved", "Unresolved"] };
    } else {
      query.status = status;
    }

    const chats = await Chat.find(query).populate("assignedTo assignedBy");

    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    console.error("Error fetching chats by status:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

chatRouter.get("/chatsById/:chatId", async (req, res) => {
  try {
    const chatId = req.params.chatId;
  

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "No chat found",
      });
    }

    const chats = await Chat.findById(chatId);

    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    console.error("Error fetching chats by status:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
chatRouter.get("/chatsByTicketName/:ticket", async (req, res) => {
  try {
    const ticketName = req.params.ticket;

    if (!ticketName) {
      return res.status(400).json({
        success: false,
        message: "No ticket name provided",
      });
    }

    const chats = await Chat.find({
      ticketName: { $regex: `^${ticketName}`, $options: "i" },
    });

    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    console.error("Error fetching chats by ticket name:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


chatRouter.get("/chatsByEmail/:email", async (req, res) => {
  try {
    const email = req.params.email;
   

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "No chat found",
      });
    }

    const chats = await Chat.findOne({ "userInfo.email": email });

    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    console.error("Error fetching chats by Email:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

chatRouter.get("/missed-chats-weekly", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const tenWeeksAgo = new Date();
    tenWeeksAgo.setDate(tenWeeksAgo.getDate() - 70);

    const missedChatsPerWeek = await Chat.aggregate([
      {
        $match: {
          missedChat: true,
          $or: [
            { assignedTo: new mongoose.Types.ObjectId(userId) },
            { assignedBy: new mongoose.Types.ObjectId(userId) },
          ],
          startTime: { $gte: tenWeeksAgo },
        },
      },
      {
        $group: {
          _id: {
            week: { $isoWeek: "$startTime" },
            year: { $isoWeekYear: "$startTime" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      {
        $project: {
          _id: 0,
          week: "$_id.week",
          year: "$_id.year",
          missedChats: "$count",
        },
      },
    ]);
    const formatted = missedChatsPerWeek.map((item, index) => ({
      name: `Week ${index + 1}`,
      chats: item.missedChats,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default chatRouter;

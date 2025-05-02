import express from "express";
import ChatBot from "../models/ChatBot.js";

const chatbotRouter = express.Router();



chatbotRouter.get("/chatbot", async (req, res) => {
  try {
    const chatBotSettings = await ChatBot.findOne();

    if (!chatBotSettings) {
      return res.status(404).json({ message: "ChatBot settings not found" });
    }

    res.status(200).json(chatBotSettings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

chatbotRouter.put("/chatbotupdate", async (req, res) => {
  try {
    const existingBot = await ChatBot.findOne();

    if (existingBot) {
      existingBot.set({ ...req.body, updatedAt: new Date() });
      await existingBot.save();
      return res.json({ message: "ChatBot updated", data: existingBot });
    } else {
      const newBot = new ChatBot({ ...req.body });
      await newBot.save();
      return res.json({ message: "ChatBot created", data: newBot });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default chatbotRouter;

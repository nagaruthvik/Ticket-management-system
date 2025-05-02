import mongoose from "mongoose";

const chatBotSchema = new mongoose.Schema({
  headColor: {
    type: String,
    default: "#33475b",
  },
  bgColor: {
    type: String,
    default: "#eeeeee",
  },
  customMessage1: {
    type: String,
    default: "How can I help you?",
  },
  customMessage2: {
    type: String,
    default: "Ask me anything",
  },
  name: {
    type: String,
    default: "Your name",
  },
  phone: {
    type: String,
    default: "+1 (000) 000-0000",
  },
  email: {
    type: String,
    default: "example@gmail.com",
  },
  btn: {
    type: String,
    default: "Thank you!",
  },
  message: {
    type: String,
    default: "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.",
  },
  savedTime: {
    type: String,
    default: "", 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const ChatBot = mongoose.model("ChatBot", chatBotSchema);

export default ChatBot

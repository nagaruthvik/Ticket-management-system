import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
  ticketName : {type:String , default : "2023-00123"},
    userInfo: {
      name: String,
      email: String,
      phone: String
    },
    status: { type: String, enum: ['resolved', 'Unresolved'], default: 'Unresolved' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    missedChat:{type:Boolean,default : false},
    messages: [
      {
        sender: { type: String, enum: ['user', 'admin', 'member'] }, 
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
        message: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  });
  
const Chat =  mongoose.model('Chat', chatSchema);
export default Chat
  
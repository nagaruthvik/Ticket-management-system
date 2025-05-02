
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
      type: String,
      default: ""
    },
    lastName:{
      type: String,
      default: ""
    },
    email: String,
    password: String,
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'member'], 
      default:"super_admin"
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isInvited: {
      type: Boolean,
      default: false
    },
    isActivated: {
      type: Boolean,
      default: false
    },
    analytics: {
      chatsSolved: { type: Number, default: 0 },
      chatsMissed: { type: Number, default: 0 },
      chatsCompleted: { type: Number, default: 0 }
    }
  });
  
const User = mongoose.model("userModel",userSchema)

export default User
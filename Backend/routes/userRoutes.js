import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import errorLogger from "../middleware/errorLogs.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../middleware/Authorization.js";

const userRouter = express.Router();

userRouter.post("/signup", errorLogger, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    const hashPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.BCRYPT_SALT)
    );

    if (!existingUser) {
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
        isActivated: true,
      });

      await newUser.save();
      return res.status(201).json({ message: "User created successfully" });
    }

    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.password = hashPassword;
    existingUser.isActivated = true;

    await existingUser.save();

    res.status(200).json({ message: "User already exists, details updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/signin", errorLogger, async (req, res) => {
  try {
    let { email, password } = req.body;

    const findEmail = await User.findOne({ email });

    if (findEmail) {
      if (findEmail.isActivated) {
        const unhashedPass = await bcrypt.compare(password, findEmail.password);

        if (unhashedPass) {
          const token = jwt.sign(
            { userId: findEmail._id, email: findEmail.email },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
          );

          return res.status(200).json({
            message: "Login successful",
            token,
            user: {
              id: findEmail._id,
              email: findEmail.email,
              firstName: findEmail.firstName,
              lastName: findEmail.lastName,
            },
          });
        } else {
          return res.status(401).json({ message: "Wrong password" });
        }
      } else {
        return res
          .status(403)
          .json({ message: "Please activate your account by signing up" });
      }
    } else {
      return res.status(404).json({ message: "No user found" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//add new user we are take user id as params and add it to the invited users and makinby user passare the newly created user password
userRouter.post("/addUser", errorLogger, auth, async (req, res) => {
  try {
    const id = req.user.userId;
    const { name, email, role } = req.body;
  
    const findId = await User.findById(id);

    if (!findId) {
      return res.status(404).json({ message: "No user found" });
    }

    const foundEmail = await User.findOne({ email });

    if (foundEmail != null) {
      return res.status(409).json({ message: "User alredy exist" });
    }

    const password = findId.password;

    const newUser = await new User({
      firstName: name,
      email,
      password,
      role,
      invitedBy: id,
      isInvited: true,
    });

    await newUser.save();

    return res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
userRouter.put("/editUser/:id", errorLogger, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const isValid = await User.findById(id);

    if (!isValid) {
      return res.status(404).json({ message: "No user found" });
    }

    const result = await User.findByIdAndUpdate(id, data, { new: true });
    if (!result) {
      return res
        .status(500)
        .json({ message: "Something went wrong while updating" });
    }

    res.status(200).json({ message: "User updated", updatedUser: result });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
userRouter.put("/editUser",auth, errorLogger, async (req, res) => {
  try {
    
      const id = req.user.userId;
      const data = req.body;
    
    const isValid = await User.findById(id);

    if (!isValid) {
      return res.status(404).json({ message: "No user found" });
    }

    const result = await User.findByIdAndUpdate(id, data, { new: true }); 
    if (!result) {
      return res
        .status(500)
        .json({ message: "Something went wrong while updating" });
    }

    res.status(200).json({ message: "User updated", updatedUser: result });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
userRouter.put(
  "/updateChatsSolved/:direction",
  auth,
  errorLogger,
  async (req, res) => {
    try {
      const id = req.user.userId;
      const direction = req.params.direction;

      if (direction !== "increment" && direction !== "decrement") {
        return res
          .status(400)
          .json({ message: "Direction must be 'increment' or 'decrement'" });
      }

      const amount = direction === "increment" ? 1 : -1;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $inc: { "analytics.chatsSolved": amount } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: `chatsSolved ${direction}ed by 1`,
        updatedUser,
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

userRouter.delete("/deleteUser/:id", errorLogger, async (req, res) => {
  try {
    const id = req.params.id;

    const isValid = await User.findById(id);
    if (!isValid) {
      return res.status(404).json({ message: "No user found" });
    }

    const result = await User.findByIdAndDelete(id, { new: true });
    if (!result) {
      return res
        .status(500)
        .json({ message: "Something went wrong while deleting" });
    }

    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/getUser",errorLogger, async (req, res) => {
  try {
  
    const findUser = await User.find();
    if (!findUser) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ data: findUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/getUserId", auth,errorLogger, async (req, res) => {
  try {
   const id = req.user.userId;
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ data: findUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default userRouter;

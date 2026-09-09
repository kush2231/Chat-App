const asyncHandler = require("express-async-handler");
const User = require('../models/UserModel');
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken");

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
        : {};
    // console.log(keyword);

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    
    if (users)
        res.send(users);
    else {
        res.status(400);
        throw new Error("Failed to find the User");
    }
        
});

const registerUser =async (req,res) =>
{
    // console.log("userController");
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password)
    {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists)
    {
        res.status(401).json({
            "message": "User already exists"
        })
        res.status(400);  
        
    }
    const user = await User.create(
        {
            name,
            email,
            password,
            pic
        });
    if (user ) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Failed to create the User");

    }
    
}

const authUser = asyncHandler(async (req, res) => {
    console.log("auth"); 
    const { email, password } = req.body;
    // console.log(req);
    const user = await User.findOne({ email });
    // console.log(user);
    // res.send("hello world");  // old way not working 
    //    if (user && (await User.matchPassword(password)))
    // {
    //     res.json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         pic: user.pic,
    //         token:generateToken(user._id),
    //     })
    // }
    
    if (user &&  ( await bcrypt.compare(password, user.password))) {
         res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token:generateToken(user._id),
        })
        }
       else {
           throw new Error("not matched password");
    }
});

const updateUserPic = asyncHandler(async (req, res) => {
  const { userId, pic } = req.body;

  const user = await User.findById(userId);

  if (user) {
    user.pic = pic;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide current and new password");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  // Fetch user with password field (protect middleware excludes it)
  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save(); // pre-save hook will hash the new password

  res.json({ message: "Password updated successfully" });
});

module.exports = { registerUser, authUser, allUsers, updateUserPic, updatePassword };
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
    console.log(keyword);

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
    console.log("userController");
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password)
    {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists)
    {
        res.status(400);  
        throw new Error("user already Exists");
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
    const { email, password } = req.body;

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
           throw new Error(" not matched password");
    }
});

module.exports={ registerUser, authUser, allUsers };  // not a default export 
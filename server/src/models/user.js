// user.model.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    role: {
      // Role of user: student, librarian, admin
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

// import mongoose,{Schema} from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constants.js";

// const userSchema = new Schema({
//     username : {
//         type : String,
//         required : true,
//         unique : true,
//         lowercase : true,
//         trim : true,
//         index : true
//     },
//     email : {
//         type : String,
//         required : true,
//         unique : true,
//         lowercase : true,
//         trim : true
//     },
//     fullname : {
//         type : String,
//         required : false,
//         trim : true,
//         index : true
//     },
//     watchHistory : [
//         {
//             type : Schema.Types.ObjectId,
//             ref : "Video"
//         }
//     ],
//     password : {
//         type : String,
//         required : [true,'Password is Required'],
//     },
//     refreshToken : {
//         type : String,
//     }
// },{timestamps : true})

// userSchema.pre("save",async function (next){
//     if(!this.isModified("password")){
//         return next();
//     }
//     this.password = await bcrypt.hash(this.password,10)
//     next()
// })

// userSchema.methods.isPasswordCorrect = async function (password){
//     return await bcrypt.compare(password,this.password)
// }

// userSchema.methods.generateAccessToken = function(){
//     return jwt.sign(
//         {
//             _id : this._id,
//             email : this.email,
//             username : this.username,
//             fullname : this.fullname
//         },
//         process.env.ACCESS_TOKEN_SECRET || "access_token_secret",
//         {
//             expiresIn : ACCESS_TOKEN_EXPIRY
//         }
//     )
// }

// userSchema.methods.generateRefreshToken = function(){
//     return jwt.sign(
//         {
//             _id : this._id,
//             email : this.email,
//             username : this.username,
//             fullname : this.fullname
//         },
//         process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret",
//         {
//             expiresIn : REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

// export const User = mongoose.model("User",userSchema)

import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique: true,
        lowcase: true,
        trim: true,
        index: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowrcase: true,
        trim: true,
    },
    fullname:{
        type:String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required: [true, 'Password is require']
    },
    refreshToken:{
        type:String,
    }
}, {timestamps:true}) 

// it work before save password
userSchema.pre("save", async function (next) {
    if(! this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// check pass is correct or not 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//  IT WILL CREATE ACCESS TOKEN 

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
//  IT WILL CREATE REFRESH TOKEN 

userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
        }
    )
}

export const User = mongoose.model("User", userSchema)
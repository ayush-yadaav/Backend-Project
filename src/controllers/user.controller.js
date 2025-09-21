import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/cloudinary.js"
import { ApiRes } from "../utils/ApiRes.js";

const registerUser = asyncHandler( async (req, res)=>{
    //  step to create register user 
    //  get user info
    // validation = not empty
    // check id user already exsit 
    // check for image, avatar
    // upload them to cloudinary, avatar
    // create user object = entry in db 
    // remove pass and refresh token field from response
    //  check for user creation 
    //  return res 

    // get info  - we get info using postman
    const {fullname, username, email, password} = req.body
    console.log("email: " , email);
    
//  validation 

if(
    [fullname,username,email,password].some((field) => field?.trim() === "")
){
    throw new ApiError(400, "All field are required")
}

// check user exist or not 

const existedUser = User.findOne({
// in the use of or we can check many field 
    $or: [{username}, {email}]
})

if(existedUser){
    throw new ApiError(409, "User already exists with email and usernme")
}

// check image and avatar 

const avatarLocalPath = req.files?.avatar[0]?.path
const coverImageLocalPath = req.files?.coverImage[0]?.path
if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required")
}

//  upload 
 const avatar = await uploadOncloudinary(avatarLocalPath)
 const coverImage = await uploadOncloudinary(coverImageLocalPath)

 if(!avatar){
    throw new ApiError(400, "Avatar files is required")
 }

 const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
 })

 const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
 )

 if(!createdUser){
    throw new ApiError(500, "Something went wrong while registerning the user")
 }

 return res.status(201).json(
    new ApiRes(200, createdUser, "Use register sucessfully")
 )

})

export {registerUser}
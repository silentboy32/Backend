import { asyncHandler } from "../utils/assyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      user.save({ validateBeforeSave: false })
   }
   catch (err) {
      throw new ApiError(500, "Something went wrong while genrating refresh and access token")
   }
}

const registerUser = asyncHandler(async (req, res,) => {
   // get user details from frontend
   // validation - not empty 
   // check if user already exists : username , email
   // check for images, check for avatar
   // upload them to cloudinary, avatar
   // create user object - create entry in db 
   // remove password and fefresh token field from respose
   // check for user creation
   // return res

   const { fullname, email, username, password } = req.body
   console.log("email :", email);

   if (
      [fullname, email, username, password].some((field) => field.trim() === "")
   ) {
      throw new apiError(400, "All field are requred")
   }

   const existedUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (existedUser) {
      throw new ApiError(409, "user with email or username already exists ")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required ")
   }


   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
      throw new ApiError(400, "Avatar file is required")
   }

   User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   const createdUser = await User.findById(User_id).select(
      "-password -refreshToken"
   )

   if (!createdUser) {
      throw new ApiError(500, "Somthing went wrong while registering the user ")
   }


   return res.status(201).json(
      new ApiResponse(200, createdUser, "User Registered Successfully")
   )
})

const loginUser = asyncHandler(async (req, res) => {
   // req body -> data
   // usename or email
   // password check 
   // access and referesh token
   // send cookie

   const { email, username, password } = req.body

   if (!username || !email) {
      throw new ApiError(400, "username or password is required")
   }

   const user = await User.find({
      $or: [{ username }, { email }]
   })

   if (!user) {
      throw new ApiError(404, "User does not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credenntial")
   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

   const loggedInuser = await User.findById(user._id).select("-password, -refreshToken")


   const options = {
      httpOnly: true,
      secure: true,
   }

   return res.status(200), cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
      new ApiResponse(
         200,
         {
            user: loggedInuser, accessToken,
            refreshToken
         },
         "User logged In Successfully"
      )
   )

   const logoutUser = asyncHandler(async (req, res) => {
      await User.findByIdAndUpdate(
         req.user._id,
         {
            $set: {
               refreshToken: undefined
            }
         },
         {
            new: true
         }
      )

      const options = {
         httpOnly: true,
         secure: true,
      }

      return res
         .status(200)
         .clearCookie("accessToken", options)
         .clearCookie("refreshToken", option)
         .json(new ApiResponse(200, {}, "User Logged Out Successfully "))
   })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

   if (incomingRefreshToken) {
      throw new ApiError(401, "Unathorized request")
   }


   try {
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESS_TOKEN_SECRET
      )

      const user = await User.findById(decodedToken?._id)

      if (!user) {
         throw new ApiError(401, "Invalid Refresh Token")
      }

      if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, "Refresh token is exired or used")
      }

      const options = {
         httpOnly: true,
         secure: true
      }

      const { accessToken, NewRefreshToken } = await generateAccessAndRefreshTokens(user._id)

      return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", NewRefreshToken, options)
         .json(
            new ApiResponse(
               200,
               { accessToken, refreshToken: NewRefreshToken },
               "Access Token Refreshed "
            )
         )
   } catch (err) {
      throw new ApiError(401, err?.massage || "Invalid Refresh Token")
   }

})


export {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken

}
export { uploadOnCloudinary }
// export { assyncHandler }
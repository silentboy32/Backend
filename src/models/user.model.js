import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        fullname : {

            type : String,
            required : true,
            trim : true
        },
        avatar : {
            type : String, // cloudinary url
            required : true
        },
        coverImage : {
            type : String, // cloudinary url
        },
        watchHistory : [{
            type : Schema.Types.ObjectId,
            ref : "Video"
        }],
        password : {
            type : String,
            required : [true , "password is required"]
        },
        refressToken : {
            type : true
        }
    },
    {
        timestamps : true
    }

)




export const User = mongoose.model("User", userSchema)
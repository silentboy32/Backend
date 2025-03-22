import mangoose, {Schema} from "mangoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFile : {
            type : String, // cloudinary url
            required : true
        },
        thumbnail : {
            type : String, // cloudinary url
            required : true
        },
        title : {
            type : String, 
            required : true
        },
        discription : {
            type : String, 
            required : true
        },
        duration : {
            type : Number, 
            required : true
        },
        views : {
            type : Number,
            default : 0
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {
        Timestamps : true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mangoose.model("Video", videoSchema)
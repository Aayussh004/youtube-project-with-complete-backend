import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String,//cloudnary se aayega
        required:true,
    },
    thumbnail:{
        type:String,//cloudnary se aayega
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,//cloudnary se aayega kyuki wo file ka desc deta hai
        required:true,
    },
    views:{
        type:Number,
        default:0,
        required:true,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
}
,{timestamps:true})


//now install "npm i mongoose-aggregate-paginate-v2" to aggregate your data
//now create your own plugin Plugins are functions that can extend the functionality of Mongoose schemas.
videoSchema.plugin(mongooseAggregatePaginate)

// aggregatePaginate() to the schema - This method can be used to paginate the results of aggregate queries performed on collections using Mongoose models.

// Pagination is a technique used to divide a large set of results into smaller, manageable subsets (pages) for easier navigation and improved performance.

export const Video = mongoose.model("Video",videoSchema);
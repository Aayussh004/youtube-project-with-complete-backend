import mongoose,{Schema} from "mongoose";

//subscriber and channel both are users basically
const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//the one who are subsribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,//the one who owns the channel
        ref:"User"
    }
},{timestamps:true})

//ab user 

export const Subscription = mongoose.model("Subscription",subscriptionSchema);
import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary,deleteOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

})

//------------>
const publishAVideo = asyncHandler(async (req, res) => {
    // const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    const {title,description,isPublished=true} = req.body//ye frontend se aayega

    if(!title || title.trim()===""){
        new ApiError(400,"Title is required!!");
    }

    if(!description || description.trim()===""){
       throw new ApiError(400,"Description is required!!");
    }

   //now ab videoFile and thumbnail ko apne local server me upload kra do
   const videoFileLocalPath = req.files.videoFile?.[0]?.path;
   const thumbnailLocalPath = req.files.thumbnail?.[0]?.path;

   if(!videoFileLocalPath){
    new ApiError(400,"Video File is required!!");
   }

   //ab local file present hai to unko upload krwa ke unke reference lelo
   const videoFile = await uploadOnCloudinary(videoFileLocalPath)
   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

   if(!videoFile){
    throw new ApiError(500,"videoFIle not uploaded in cloudinary !!");
   }
   
   //now store cloudinary url in db
   const video = await Video.create({
    videoFile:{
        public_id:videoFile?.public_id,
        url:videoFile?.url
    },
    thumbnail:{
        public_id:thumbnail?.public_id,
        url:thumbnail?.url
    },
    title,
    description,
    isPublished,
    duration:videoFile?.duration,
    owner:req.user._id
   })

   if(!video){
    throw new ApiError(500,"something went wrong while storing the video in database")
   }

return res.status(200).json(new ApiResponse(200,video,"video uploaded successfully!!"));

})

//---------->
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

if(!isValidObjectId(videoId)){throw new ApiError(400, "This video id is not valid")}
   
     const video = await Video.findById({_id:videoId})

     if(!video){throw new ApiError(400,"cannot find the video in db")};

     return res.status(200).json(new ApiError(200,video,"Video fetched successfully!!"));
   
})

//---------->
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailFile = req.file?.path

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "This video id is not valid")
    } 
    // if any field not provide
    if(
        !(thumbnailFile || !(!title || title?.trim() === "") || !(!description || description?.trim() === ""))
    ){
        throw new ApiError(400, "update fields are required")
    }

    // find video 
    const previousVideo = await Video.findOne(
        {
            _id: videoId
        }
    )
    if(!previousVideo){
        throw new ApiError(404, "video not found")
    }

    let updateFields = {
        $set:{
            title,
            description,
        }
    }

    // if thumbnail provided delete the previous one and upload new on 
    let thumbnailUploadOnCloudinary;
    if(thumbnailFile){
        await deleteOnCloudinary(previousVideo.thumbnail?.public_id)

        // upload new one 
         thumbnailUploadOnCloudinary = await uploadOnCloudinary(thumbnailFile);

        if(!thumbnailUploadOnCloudinary){
            throw new ApiError(500, "something went wrong while updating thumbnail on cloudinary !!")
        }

        updateFields.$set = {
            public_id: thumbnailUploadOnCloudinary.public_id,
            url: thumbnailUploadOnCloudinary.url
        }
    }

    const updatedVideoDetails = await Video.findByIdAndUpdate(
        videoId,
        updateFields,
        {
            new: true
        }
    )

    if(!updatedVideoDetails){
        throw new ApiError(500, "something went wrong while updating video details");
    }

    //return responce
    return res.status(200).json(new ApiResponse(
        200,
        { updatedVideoDetails },
        "Video details updated successfully!"
    ));

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video


    //check if videoid exist or not
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "This video id is not valid")
    }

    //find video in the db
    const video = Video.findById({
        _id:videoId
    })

    if(!video){throw new ApiError(404, "video not found")}

   //now delete the video from cloudinary 
   if(video.videoFile)
    await deleteOnCloudinary(video.videoFile.public_id,"video")

    //now delete thumbnail of the video also
    if(video.thumbnail){
        await deleteOnCloudinary(video.thumbnail?.public_id)
    }

    //delete video from db also
    const deleteResponse = await Video.findByIdAndDelete(videoId)

    if(!deleteResponse){
        throw new ApiError(500, "something went wrong while deleting video !!")
    }

    return res.status(200).json(new ApiResponse(200,deleteResponse,"Successfully deleted videoFIle!!"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //now to find the status of any given video, goto db and find it, then find its status, then toggle or change its status
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "This video id is not valid")
    }

    //find video in db
    const video = Video.findById({_id:videoId});

    if(!video){
        throw new ApiError(400, "This video id is not valid")
    }
    video.isPublished  = !video.isPublished;

    await video.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponse(200,video,"Video Status successfully Toggled!!"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
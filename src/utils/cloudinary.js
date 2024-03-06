//ab dekho agr developer ko file ya img upload krni hai to server me upload krna pdega
//ab ye kaam krne ke liye hum 2 steps follow krenge

//step-1: multer ki help se user se file leke local server me le lenge 
//step-2: ab cloudinary ki help se local ki file main server me daal denge

//ye kaam directly multer->cloudinary->server bhi ho skta hai but hum ye isiliye follow kr rhe hai ki agr mujhe img reupload krni pd gyi to hum local se kaam krenge

// ab nodejs ka file system use krna hoga
//now goto cloudinary and signup and get api key and copy that code here and do config .env file


import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localpath) =>{
    try {
        if(!localpath) return "Could Not find the local path!";

       const response =  await cloudinary.uploader.upload(localpath,{resource_type: "auto"});//yha pe audio video bhi le skte the auto ki jagah bt ye khud detect krlega

        //file is uploaded successfully
        console.log("file is uploaded successfully!!", response.url)
        fs.unlinkSync(localpath);//ab file upload hone ke baad remove ho jaegi
        return response;//user ko dene ke liye

    } catch (error) {
        //agr file server pe hai but upload nhi hua hai to phir uss file ko hum apne server se unlink means delete kr denge kyuki wo koi kaam ka nhi ab user phir se upload krne ki koshish krega newfile

        fs.unlinkSync(localpath)//unlinking in synchronous way and it will remove the locally saved temporary file as its failed to upload on cloud
        return null;
    }
}

const destroyOnCloudinary = async (remotePath) => {
    // Call code ---  await destroyOnCloudinary(req.user.avatar)
    try {
        if (!remotePath) return null;
        const regex = /[\w\.\$]+(?=.png|.jpg|.gif)/;
        let matches;
        // Alternative syntax using RegExp constructor
        // const regex = new RegExp('[\\w\\.\\$]+(?=.png|.jpg|.gif)', '')

        if ((matches = regex.exec(remotePath)) !== null) {
            // The result can be accessed through the `m`-variable.
            // destroy the file on Cloudinary
            await cloudinary.uploader.destroy(matches[0])
            .then(result => console.log(result));
        }
    } catch (error) {
        throw error
    }
}

export {uploadOnCloudinary,destroyOnCloudinary};

//now you have created a utility to upload any type of file from local server to cloudinary
//now create a middleware multer se user se file lekr local me store krne ke liye
//go to "./middleware/multer"
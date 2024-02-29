// goto multer/github to get the code

const storage = multer.diskStorage({
    destination: function (req, file, cb) {//cb is callback   
      cb(null, "./public/temp")//cb ke parameter, ye whi temp hai jo sbse phle banaye the gitkeep krke 
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)//file ka name unique rkhne ke liye
    // uniqueSuffix="abcd"
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
   cb(null, file.originalname);
    }
  })
  
  export const upload = multer(
    { 
        storage,
        // storage: storage
     })
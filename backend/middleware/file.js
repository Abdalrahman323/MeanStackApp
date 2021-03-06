const multer =require('multer')


const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
  }
  
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{          // where you want to save it
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if(isValid){
        error = null;
      }
      "saved at images"
      cb(error,"images");
    },
    filename:(req,file,cb)=>{             // what name of the saved file
      const name = file.originalname.toLowerCase().split(' ').join('-')
      const extension = MIME_TYPE_MAP[file.mimetype]
      console.log("arrived here ");
      cb(null,name+'-'+Date.now()+'.'+extension);
    }
  })
  
  
module.exports = multer({ storage: storage }).single("image");
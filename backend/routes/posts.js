const exprss = require('express');
const multer =require('multer')

const checkAuth = require('../middleware/check-auth');

const PostsController = require('../controller/posts')

const router = exprss.Router();

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
    cb(error,"backend/images");
  },
  filename:(req,file,cb)=>{             // what name of the saved file
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const extension = MIME_TYPE_MAP[file.mimetype]
    cb(null,name+'-'+Date.now()+'.'+extension);
  }
})



router.post("",checkAuth,multer({ storage: storage }).single("image"), PostsController.createPost);

router.put("/:id",checkAuth,multer({ storage: storage }).single("image") ,PostsController.updatePost);

router.get('',PostsController.getPosts);

router.get('/:id',PostsController.getPost);

router.delete("/:id",checkAuth, PostsController.deletePost);

module.exports =router;

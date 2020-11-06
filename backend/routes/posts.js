const exprss = require('express');
const multer =require('multer')
const Post = require('../models/post')
const checkAuth = require('../middleware/check-auth')

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



router.post("",checkAuth,multer({ storage: storage }).single("image"),
    (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost._doc,
          id: createdPost._id
        }
      });
    });
  }
);

router.put("/:id",checkAuth,multer({ storage: storage }).single("image") ,
    (req, res, next) => {

  // imagePath is either the path we already has or the path of the newly uploaded image
  let imagePath = req.body.imagePath;  // the default
  if( req.file){  // detect a new file was uploaded
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath:imagePath,
    creator: req.userData.userId
  });

  // to check Authorization nModified will be 0 if the user is unAuthorized
  Post.updateOne({ _id: req.params.id ,creator:req.userData.userId }, post)
    .then((result) => {
      if(result.nModified >0){
        res.status(200).json({
          message: 'update successful'
        });
      } else {
        res.status(401).json({
          message: 'Not Authorized!'
        });

      }
    });
});

router.get('', (req, res, next) => {  // middleware

  const pageSize= +req.query.pagesize;
  const currentPage= +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage){
    // adjust query to select slice piece of posts
    // ##important this will still execute a query on all elements on database, this how it works
    // so,for very large dataset this could be
    // console.log("Page size is = " + pageSize+" CurrentPage is = "+currentPage);
    postQuery
    .skip(pageSize *(currentPage-1))
    .limit(pageSize)
  }
  postQuery.then(documents => {
      fetchedPosts =documents;
      return Post.countDocuments();
    }).then(count =>{
      /// here i create my response
      res.status(200).json({
        message: 'Posts fetched successfully',
        fetchedPosts: fetchedPosts,
        maxPosts:count
      });
    })


});

router.get('/:id', (req, res, next) => {

  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    });
});

router.delete("/:id",checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id , creator:req.userData.userId})
    .then(result => {

      if(result.deletednCount >0){
        res.status(200).json({
          message: 'Deletion succeful successful'
        });
      } else {
        res.status(401).json({
          message: 'Not Authorized!'
        });

      }
    })
});

module.exports =router;

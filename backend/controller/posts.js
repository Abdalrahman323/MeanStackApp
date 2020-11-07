const Post = require('../models/post')

exports.createPost = (req, res, next) => {
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
    })
    .catch(error =>{
      res.status(500).json({
        message:"Creating a post failed!"
      })
    });
  }
exports.updatePost =(req, res, next) => {

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
      })
      .catch(error =>{  // if something goes wrong techically in the above code 
        res.status(500).json({
          message: "Coudn't update post!"
        })
      });
  }

exports.getPosts= (req, res, next) => {  // middleware

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
      .catch(error =>{
        res.status(500).json({
          message:"Fetching posts failed!"
        })
      });
  
  
  }

exports.getPost = (req, res, next) => {

    Post.findById(req.params.id)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ message: 'Post not found' });
        }
      })
      .catch(error =>{
        res.status(500).json({
          message:"Fetching post failed!"
        })
      });
  }

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id , creator:req.userData.userId})
      .then(result => {
  
        if(result.deletednCount >0){
          res.status(200).json({
            message: 'Deletion successful'
          });
        } else {
          res.status(401).json({
            message: 'Not Authorized!'
          });
  
        }
      })
      .catch(error =>{
        res.status(500).json({
          message:"Deleting post failed!"
        })
      });
  }
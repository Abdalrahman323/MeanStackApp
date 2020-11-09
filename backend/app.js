const path = require ('path')
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts')
const userRoutes  = require('./routes/user')



const app = express();
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.uxiaq.mongodb.net/node-angular?retryWrites=true&w=majority`,
{ useUnifiedTopology: true ,useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed -- !!!');

  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //
app.use("/images",express.static(path.join("images"))) // // means any request target / images will be allowed to continue and fetch their files from there

// this middleware for all incoming requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept ,Authorization "
  );
  res.setHeader("Access-Control-Allow-Methods",
    "GET,PUT,POST,PATCH,DELETE,OPTIONS")

  next();
});

app.use("/api/posts",postsRoutes);

app.use("/api/user",userRoutes)

module.exports = app;

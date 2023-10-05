const express = require("express");
const app = express();
app.use(express.json())
const { getTopics, getArticleById, getAllApis, getArticles, postComment } = require("./controllers/app.controllers.js");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles",getArticles)

app.get("/api", getAllApis)

app.post("/api/articles/:article_id/comments",postComment)

app.use((err, req, res, next)=>{
  if (err.status){
    res.status(err.status).send({message: err.message})
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({message : "Bad Request!"})
    }
    if (err.code === "23503"){
        res.status(404).send({message : "User Not Found"})
    } else if (err.status){
        res.status(err.status).send({message: err.message})
    } else {
        console.log(err);
        res.status(500).send({message: "Internal Server Error"})
    }

  })



app.all("/*",(req,res)=>{
  res.status(404).send({msg: 'Not Found'})
})

module.exports = app;
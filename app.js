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
        res.status(500).send({ msg: "internal server error!" })
  })



app.all("/*",(req,res)=>{
  res.status(404).send({msg: 'Not Found'})
})

module.exports = app;
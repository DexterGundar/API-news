const express = require("express");
const app = express();

app.use(express.json())

const { getTopics, getArticleById, getAllApis, getArticles, postComment, getCommentsByArtId, patchArticleVotes, getUsers, getCommentToDelete } = require("./controllers/app.controllers.js");


app.get("/api/users",getUsers)
app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles",getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArtId);

app.get("/api", getAllApis)


app.post("/api/articles/:article_id/comments",postComment)

app.patch("/api/articles/:article_id", patchArticleVotes)
app.delete("/api/comments/:comment_id", getCommentToDelete)

app.use((err, req, res, next)=>{
  if (err.status){
    res.status(err.status).send({message: err.message})
  } else {
    next(err)
  }
})


app.use((err, req, res, next) => {

    if (err.code === "22P02"){
        res.status(400).send({message : "Bad Request"})
    }
    if (err.status){
        res.status(err.status).send({message: err.message})
    } else {
        res.status(500).send({message: "Internal Server Error"})
    }

  })
  app.all("/*",(req,res)=>{
    res.status(404).send({message: 'Not Found'})
  })
  
module.exports = app;
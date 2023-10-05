const express = require("express");
const app = express();

const { getTopics, getArticleById, getAllApis, getArticles, getCommentsByArtId } = require("./controllers/app.controllers.js");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles",getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArtId);

app.get("/api", getAllApis)


app.use((err, req, res, next)=>{
  if (err.status){
    res.status(err.status).send({message: err.message})
  } else {
    next(err)
  }
})
app.all("/*",(req,res)=>{
  res.status(404).send({message: 'Not Found'})
})

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ message: 'Bad Request' });
  } else res.status(500).send({ message: 'Internal Server Error' });
});


module.exports = app;
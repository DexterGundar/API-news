const express = require("express");
const app = express();

const { getTopics, getArticleById } = require("./db/controllers/app.controllers.js");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);


app.all("/*",(req,res)=>{
  res.status(404).send({msg: 'Not Found'})
})

app.use((err, req, res, next) => {
        res.status(500).send({ msg: "internal server error!" })
  })

module.exports = app;
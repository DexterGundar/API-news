const express = require("express");
const app = express();

const { getTopics } = require("./db/controllers/app.controllers.js");

app.get("/api/topics", getTopics);

app.all("/*",(req,res)=>{
  res.status(404).send({msg: 'Not Found'})
})



app.use((err, req, res, next) => {
        res.status(500).send({ msg: "internal server error!" })
  })

module.exports = app;
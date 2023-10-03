const { fetchTopics, fetchApi } = require("../models/app.models.js")
const endPoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {

    fetchTopics()
    .then((topics)=>{
        res.status(200).send({ topics })
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getAllApis = (req, res) =>{
        res.status(200).send({ 'endpoints': endPoints})
}
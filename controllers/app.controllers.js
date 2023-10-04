const { fetchTopics, fetchArticleById, fetchArticles } = require("../models/app.models.js")
const endPoints = require("../endpoints.json");

exports.getAllApis = (req, res) =>{
        res.status(200).send({ 'endpoints': endPoints})
}
exports.getTopics = (req, res, next) => {

    fetchTopics()
    .then((topics)=>{
        res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    if (isNaN(article_id)) return next({ status: 400, message: 'Not a number, please enter valid id'});

    fetchArticleById(article_id)
    .then((article)=>{
        res.status(200).send({ article })
    })
    .catch((err)=>{
        next(err);
    })
}
exports.getArticles = (req, res, next) =>{
    fetchArticles()
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch((err) =>{
        next(err)
    })
}

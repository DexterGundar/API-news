const { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArtId } = require("../models/app.models.js")
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

exports.getCommentsByArtId = (req, res, next) =>{
    const {article_id} = req.params

    fetchArticleById(article_id)
    .then(()=>{
    })
    .catch((err)=>{
        next(err);
    });
    fetchCommentsByArtId(article_id)
    .then((comments)=>{
    res.status(200).send({ comments })
    })
    .catch((err) =>{
        next(err)
    })
}
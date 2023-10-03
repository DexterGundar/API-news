const { fetchTopics, fetchArticleById } = require("../models/app.models.js")


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
        console.log(article)
        res.status(200).send({ article })
    })
    .catch((err)=>{
        next(err);
    })
}
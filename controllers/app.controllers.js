const { fetchTopics, fetchArticleById, fetchArticles, insertComment, updateArticleVotes } = require("../models/app.models.js")
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

exports.getArticles = (req, res, next) =>{
    fetchArticles()
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch((err) =>{
        next(err)
    })
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

exports.postComment = (req, res, next) =>{
    const {article_id} = req.params
    const newComment = req.body

    if (Object.keys(newComment).length < 2 ||
    !newComment.username ||
    !newComment.body ||
    article_id < 1) {
    return res.status(400).send({ message: "Invalid data sent" });
  }

    if (isNaN(article_id)) return next({ status: 400, message: 'Not a number, please enter valid id'});
    fetchArticleById(article_id).then(()=>{
        insertComment(article_id, newComment).then((comment)=>{
        res.status(201).send({ comment });
        })
        .catch((err)=>{
        next(err)
    })
})    
.catch((err)=>{
    next(err)
})
}

exports.patchArticleVotes = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body

    if (isNaN(inc_votes)) return next({ status: 400, message: 'Voting must contain only numbers'});
    fetchArticleById(article_id).then(()=>{
        updateArticleVotes(article_id, inc_votes).then((article) =>{
            res.status(201).send({article})
        })
    })
    .catch((err) =>{
        next(err)
    })
}

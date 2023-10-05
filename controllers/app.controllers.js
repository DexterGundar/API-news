
const { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArtId, insertComment, updateArticleVotes, deleteComment } = require("../models/app.models.js")

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
    const {topic} = req.query;
    fetchArticles(topic)
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

exports.postComment = (req, res, next) =>{
    const {article_id} = req.params
    const newComment = req.body

     
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

    
    fetchArticleById(article_id).then(()=>{
    })
    .catch((err) =>{
        next(err)
    })
    updateArticleVotes(article_id, inc_votes).then((article) =>{
        res.status(201).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getCommentToDelete = (req, res, next) => {
    const {comment_id} = req.params
    deleteComment(comment_id).then(() =>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}
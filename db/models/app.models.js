
const db = require("../connection.js");

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(({ rows }) => {
        return rows;
    })
}

exports.fetchArticleById = (id) =>{
    console.log(id)
    return db.query(`
    SELECT * FROM articles

    WHERE article_id=$1;  
    `,[id])
    .then(({ rows })=>{
        // console.log(rows[0])
        return rows
    })
}
// JOIN comments
// ON comments.article_id = articles.article_id
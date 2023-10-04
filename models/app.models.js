const db = require("../db/connection.js");

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(({ rows }) => {
        return rows;
    })
}

exports.fetchArticleById = (id) =>{
    return db.query(`
    SELECT * FROM articles

    WHERE article_id=$1;  
    `,[id])
    .then(({ rows })=>{
        if (rows.length === 0){
            return Promise.reject({ status: 404, message: 'Not Found'})
        } else {
        return rows
        }
    })
}

exports.fetchArticles = () =>{

    return db.query(`
    SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, 
    articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `)
    .then(({rows})=>{
        return rows
    })
}

exports.fetchCommentsByArtId = (article_id)=>{
    const articleString = `
    SELECT * FROM articles
    WHERE article_id = $1;
`;
return db
.query(articleString, [article_id])
.then(({ rows }) => {
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "This article does not exist",
    });
  } else {
    return rows[0];
  }
})
.then((article) => {
  const commentsFromDb = `
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
    `;
  return db
    .query(commentsFromDb, [article.article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return [
          {
            message: "There are no comments associated with this article"
          },
        ];
      } else {
        return rows;
      }
    });
});
}
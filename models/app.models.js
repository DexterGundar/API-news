const db = require("../db/connection.js");
const comments = require("../db/data/test-data/comments.js");

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(({ rows }) => {
        return rows;
    })
}

exports.fetchArticleById = (article_id) =>{

  if (isNaN(article_id)) return Promise.reject({ status: 400, message: "Bad Request"});

    return db.query(`
    SELECT * FROM articles

    WHERE article_id=$1;  
    `,[article_id])
    .then(({ rows })=>{
        if (rows.length === 0){
          return Promise.reject({ status: 404, message: 'Not Found'})
        } else {
        return rows
        }
    })
}

exports.fetchArticles = (topic) =>{

const topicObj = {
  mitch: "mitch",
  cats: "cats",
  paper: "paper"
}
    let query = `
    SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, 
    articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    `
    const values = [];
    if (topic in topicObj){
      query += `WHERE topic = $1`
      values.push(topic)
    } else if (topic !== undefined && !(topic in topicObj)){
      return Promise.reject({ status: 404, message: "Not Found" })
    }
    query += `
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `;

    return db.query(query,values)
    .then(({rows})=>{
        return rows
    })
}


exports.insertComment = (article_id, newComment) =>{
  
    const { username, body, votes = 0 } = newComment

    if (Object.keys(newComment).length < 2 ||
    !newComment.username ||
    !newComment.body ||
    article_id < 1) {
    return Promise.reject({status: 400, message: "Invalid data sent" });
  }
    
   const userStr = `
        SELECT * FROM users
        WHERE username = $1;
    `;
  return db
    .query(userStr, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "This user does not exist",});
      } else {
        return rows[0];
      }
    })
    .then((user) => {
      const created_at = new Date();
      const commentStr = `
            INSERT INTO comments
                (article_id, author, body, votes, created_at)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
      return db
        .query(commentStr, [
          article_id,
          user.username,
          body,
          votes,
          created_at,
        ])
        .then(({ rows: [comment] }) => {
          comment.created_at = Date.parse(comment.created_at);
          return comment;
        });
    });
}

exports.updateArticleVotes = (article_id, inc_votes) => {
  if (isNaN(inc_votes)) return Promise.reject({ status: 400, message: 'Voting must contain only numbers'});

  return db.query(`
  UPDATE articles
  SET votes = votes +$1
  WHERE article_id =$2
  RETURNING *
  `, [inc_votes, article_id]).then(({rows}) =>{
    return rows[0]
  })
}
exports.fetchCommentsByArtId = (article_id)=>{

  const commentsFromDb = `
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
    `;
  return db
    .query(commentsFromDb, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return [];
      } else {
        return rows;
      }
    });

}

exports.deleteComment = (comment_id) =>{
  
  return db.query(`
  DELETE FROM comments
  WHERE comments.comment_id = $1
  RETURNING *;
  `, [comment_id]).then(({rows})=> {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: 'Not Found'})
    }
  })
}
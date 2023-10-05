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

exports.insertComment = (article_id, newComment) =>{
     
    const { username, body, votes = 0 } = newComment
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
  return db.query(`
  UPDATE articles
  SET votes = votes +$1
  WHERE article_id =$2
  RETURNING *
  `, [inc_votes, article_id]).then(({rows}) =>{
    return rows[0]
  })
}
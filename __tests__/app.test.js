const app = require("../app.js");
const request = require("supertest");

const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const endPoints = require("../endpoints.json");


beforeEach(() => {
  return seed(testData);
});

afterAll(() => db.end());

describe("GET /api/topics", () => {
    test("respond with a topic properties to be 'slug' and 'description' and types to be String", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)          
          .then(({ body }) => {
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic) => {
              expect(topic).toHaveProperty("slug", expect.any(String));
              expect(topic).toHaveProperty("description", expect.any(String));
            });
          });
      });
})
describe('Non existant end-points',()=>{
  test("return 404, if non-existant address has been entered", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then((response)=>{
        expect(response.body.msg).toBe('Not Found')
      })
  });
})


describe("GET /api/articles/:article_id", () => {
  test("respond with 200 and an article by it's id", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)          
        .then(({ body }) => {
          expect(body.article[0].author).toBe("rogersop"),
          expect(body.article[0].title).toBe("UNCOVERED: catspiracy to bring down democracy"),
          expect(body.article[0].article_id).toBe(5),
            expect(body.article[0].body).toBe("Bastet walks amongst us, and the cats are taking arms!"),
            expect(body.article[0].topic).toBe("cats"),
            expect(body.article[0].created_at).toBe('2020-08-03T13:14:00.000Z'),
            expect(body.article[0].votes).toBe(0),
            expect(body.article[0].article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        });
    });
    test("respond with 404 and a helpful message if there is no such id", () => {
      return request(app)
        .get("/api/articles/5555")
        .expect(404)          
        .then(({ body }) => {
        expect(body.message).toBe('Not Found')
        })
    });
    test("respond with 400 and a helpful message if the id is incorrectly entered", () => {
      return request(app)
        .get("/api/articles/55abc")
        .expect(400)          
        .then(({ body }) => {
        expect(body.message).toBe('Not a number, please enter valid id')
        })
    });

})

describe('get /api',()=>{
  test("return 200 and api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body})=>{
        expect(body).toEqual({'endpoints': endPoints})
      })
  });
})

describe('get articles',()=>{
  test("return 200 and api articles with body property removed", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body})=>{
        expect(body.articles).toHaveLength(13);
            body.articles.forEach((article) => {
              expect(article).toHaveProperty("author", expect.any(String)),
              expect(article).toHaveProperty("title", expect.any(String)),
              expect(article).toHaveProperty("article_id", expect.any(Number)),
              expect(article).toHaveProperty("topic", expect.any(String)),
              expect(article).toHaveProperty("created_at", expect.any(String)),
              expect(article).toHaveProperty("votes", expect.any(Number)),
              expect(article).toHaveProperty("article_img_url", expect.any(String)),
              expect(article).toHaveProperty("comment_count", expect.any(String)),
              expect(article).not.toHaveProperty('body')
            })
      })
  });
  test("articles are sorted in descending order by created date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body })=>{
               expect(body.articles).toBeSortedBy('created_at',{
                descending: true})
      })
  });

})

describe('POST /api/articles/:article_id/comments',()=>{
  test("return 201 and newly posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: 'this is my sensible and nice comment'
    }
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then(({body})=>{
        expect(body.comment.comment_id).toBe(19),
        expect(body.comment.body).toBe('this is my sensible and nice comment'),
        expect(body.comment.article_id).toBe(6),
        expect(body.comment.author).toBe('icellusedkars'),
        expect(body.comment.votes).toBe(0),
        expect(typeof body.comment.created_at).toEqual('number')
      })
  });
  test("return 404 and useful message if username is wrongly entered", () => {
    const newComment = {
      username: "icellusedkar",
      body: 'this is my sensible and nice comment'
    }
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(404)
      .then(({body})=>{
        expect(body.message).toBe("This user does not exist")
      })
  });
  test("return 400 and useful message if article ID is invalid", () => {
    const newComment = {
      username: "icellusedkars",
      body: 'this is my sensible and nice comment'
    }
    return request(app)
      .post("/api/articles/55asd/comments")
      .send(newComment)
      .expect(400)
      .then(({body})=>{
        expect(body.message).toBe('Not a number, please enter valid id')
      })
  });
  test("return 400 and invalid data send message if no username has been sent", () => {
    const newComment = {
      body: 'this is my sensible and nice comment'
    }
    const newCommentTwo = {
      username: "icellusedkars",
    }
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({body})=>{
        expect(body.message).toBe('Invalid data sent')
      })
  });
  test("return 400 and invalid data send message if no body has been sent", () => {
    const newComment = {
      username: "icellusedkars",
    }
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({body})=>{
        expect(body.message).toBe('Invalid data sent')
      })
  });
  test("return 404 and useful message if there is no such article", () => {
    const newComment = {
      username: "icellusedkars",
      body: 'this is my sensible and nice comment'
    }
    return request(app)
      .post("/api/articles/5555/comments")
      .send(newComment)
      .expect(404)
      .then(({body})=>{
        expect(body.message).toBe('Not Found')
      })
  });
})

describe('PATCH /api/articles/:article_id',()=>{
  test("return 201 and updated article", () => {
    const newVotes = {
      inc_votes: 7
    }
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(201)
      .then(({body})=>{
        expect(body.article).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 7,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
      })
  });
  
  test("return 404 status code and message if article id doesn't exist", () => {
    const newVotes = {
        inc_votes: 7
    }
    return request(app).patch("/api/articles/5555")
    .send(newVotes)
    .expect(404)
    .then(({body})=>{
      expect(body.message).toBe('Not Found')
    })
});
test('return 400 and message if article ID is invalid', () => {
  const newVotes = {
      inc_votes: 7
  }
  return request(app)
  .patch("/api/articles/55asdsa")
  .send(newVotes).expect(400)
  .then(({body}) => {
      expect(body.message).toBe('Bad Request');
  })
  });

  test('return 400 and message if votes are not a number', () => {
    const newVotes = {
        inc_votes: '7asd'
    }
    return request(app).patch("/api/articles/3")
    .send(newVotes)
    .expect(400)
    .then(({body}) => {
        expect(body.message).toBe('Voting must contain only numbers');
    })
    });
    test('return 400 and message if wrong field is accessed', () => {
      const newVotes = {
          author: "icellusedkars"
      }
      return request(app).patch("/api/articles/3")
      .send(newVotes)
      .expect(400)
      .then(({body}) => {
          expect(body.message).toBe('Voting must contain only numbers');
      })
      });
})

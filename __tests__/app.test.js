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
        expect(response.body.message).toBe('Not Found')
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
        expect(body.message).toBe('Bad Request')
        })
    });

})
describe('get api',()=>{
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

describe('GET /api/articles/:article_id/comments',()=>{
  test("return 200 and comments by article's id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({body})=>{
        expect(body.comments).toHaveLength(2);
            body.comments.forEach((comment) => {
              expect(comment).toHaveProperty("comment_id", expect.any(Number)),
              expect(comment).toHaveProperty("body", expect.any(String)),
              expect(comment).toHaveProperty("votes", expect.any(Number)),
              expect(comment).toHaveProperty("author", expect.any(String)),
              expect(comment).toHaveProperty("created_at", expect.any(String)),
              expect(comment.article_id).toBe(5)
            })
      })
  });
  test('return 200 and array of objects which is by default sorted by "created_at" in a DESC order', () => {
    return request(app)
    .get("/api/articles/5/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments).toBeSortedBy("created_at", { descending: true });
    });
  });
  test("return 200 and message that there are no comments associated with this article", () => {
    return request(app)
    .get("/api/articles/4/comments")
    .expect(200)          
    .then(({ body }) => {
      expect(body.comments).toEqual([])
    })
  })
  test("return 400 and message of incorrectly entered ID", () => {
    return request(app)
        .get("/api/articles/55abc/comments")
        .expect(400)          
        .then(({ body }) => {
        expect(body.message).toBe('Bad Request')
        })
  });
  test("return 404 and message that an article does not exist if article ID is not in db", () => {
    return request(app)
        .get("/api/articles/5555/comments")
        .expect(404)          
        .then(({ body }) => {
        expect(body.message).toBe('Not Found')
        })
  });
})

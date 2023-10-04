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
// describe('GET /api/articles/:article_id/comments',()=>{
//   test("return 200 and comments by article's id", () => {
//     return request(app)
//       .get("/api/articles/5/comments")
//       .expect(200)
      // .then(({body})=>{
      //   expect(body.article[0].comment_id).toBe(5),
      //   expect(body.article[0].votes).toBe(5),
      //   expect(body.article[0].created_at).toBe(5),
      //   expect(body.article[0].author).toBe(5),
      //   expect(body.article[0].body).toBe(5),
      //   expect(body.article[0].article_id).toBe(5)
      // })
//   });
// })

// {
//   body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
//   votes: 16,
//   author: "icellusedkars",
//   article_id: 5,
//   created_at: 1591682400000,
// },
// {
//   body: "I am 100% sure that we're not completely sure.",
//   votes: 1,
//   author: "butter_bridge",
//   article_id: 5,
//   created_at: 1606176480000,
// },
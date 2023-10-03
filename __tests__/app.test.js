const app = require("../app.js");
const request = require("supertest");

const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

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
          console.log(body)
          expect(body.article[0].author).toBe("rogersop"),
          expect(body.article[0].title).toBe("UNCOVERED: catspiracy to bring down democracy"),
          expect(body.article[0].article_id).toBe(5),
            expect(body.article[0].body).toBe("Bastet walks amongst us, and the cats are taking arms!"),
            expect(body.article[0].topic).toBe("cats"),
            // expect(body.article[0].created_at).toBe(Date(1596464040000)),
            expect(body.article[0].votes).toBe(0),
            expect(body.article[0].article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        });
    });
})


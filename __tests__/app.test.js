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
    test("returns 200 status code", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("respond with a topic properties to be 'slug' and 'description' and types to be String", () => {
        return request(app)
          .get("/api/topics")
          .then(({ body }) => {
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic) => {
              expect(topic).toHaveProperty("slug", expect.any(String));
              expect(topic).toHaveProperty("description", expect.any(String));
            });
          });
      });
      test("respond with an array of topic objects each with the following properties: slug, description", () => {
        return request(app)
          .get("/api/topics")
          .then(({ body }) => {
            expect(body.topics).toEqual( [
                { slug: 'mitch', description: 'The man, the Mitch, the legend' },
                { slug: 'cats', description: 'Not dogs' },
                { slug: 'paper', description: 'what books are made of' }
              ]);
            });
          });
      test("return 404, if non-existant address has been entered", () => {
        return request(app)
          .get("/api/topic")
          .expect(404)
      });
})
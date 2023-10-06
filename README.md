Hello!

This is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

Installation:
Please start with cloning this repository: https://github.com/DexterGundar/API-news.git
Afterwards navigate to project directory and run: npm install

To use this REPO please create your own files called .env.test with: PGDATABASE=nc_news_test
and .env.development with: PGDATABASE=nc_news.
These files should be created in the main project folder.
The files have been added to .gitignore already, however please double check that they are still there.

Now generate the database by running script: npm run setup-dbs
Create the tables script: npm run seed

And you are good to go.

To run tests use: npm t

Here is the end product with all API's hosted on Render through elephantSQL: https://news-service-alcf.onrender.com/api

You will need to install jest sorted separately and add "jest-sorted" to "jest" at the bottom of package.json:
npm i jest-sorted
and
"jest": {
    "setupFilesAfterEnv": [
      "jest-extended/all",
      "jest-sorted"

    ]
  }

Here are all the dependancies (just in case):
"devDependencies": {
    "husky": "^8.0.2",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "pg-format": "^1.0.4"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "supertest": "^6.3.3"
  },

Minimum requirements:
postgres (PostgreSQL) 14.9
node v20.8.0

Thank you.
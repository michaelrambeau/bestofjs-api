# About testing

## Unit testing approach

First approach: consider the database as an external dependency and run tests by mocking the Mongoose models.

Pros:

- No database connection required
- Tests are fast

Cons:

- We have to mock every call made by the Mongoose models:
  - The methods called to fetch data: `find`, `findOne()`
  - But also any other method that can be chained, `populate()` for example
- We have to keep the mock objects returned by the find() methods "up to date": every time the database changes, these objects should be updated.

Remark: the application setup is called for every `*.test.js` file run by Jest, not only once, the usual singleton behavior we expect when we use `require()` does not apply here, we have to consider each test file in isolation, see [this issue](https://github.com/facebook/jest/issues/4413).

## Using a database for testing

Check what does SpaceX https://github.com/r-spacex/SpaceX-API/blob/master/src/app.js running tests again the main database.

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

## Using a database for testing

Check what does SpaceX https://github.com/r-spacex/SpaceX-API/blob/master/src/app.js

# BestOfJS public API (Work in Progress)

Public API used by https://bestof.js.org/ web application, made with [FeathersJS](https://feathersjs.com/)

Used to serve the user-generated content: the links and the reviews posted by the users.

Hosted on https://zeit.co/now

## End points

* `projects/:owner/:repo/links`: the list of links related to a given GitHub project
* `projects/:owner/:repo/reviews`: the list of reviews related to a given GitHub project

## Development

### Set up

Add MongoDB credentials in `.env` file, at the root level

```
MONGO_URI_DEV=mongodb://***:***@d***:*****/*****
```

### Start the development server

```
npm start
```

To see debug messages:

```
DEBUG=api npm start
```

To see all debug messages, including those from FeathersJS

```
DEBUG=* npm start
```

Check the result for Redux project, for example: `http://localhost:3030/projects/reactjs/redux/links`

## Deploy

Register database credentials as Now "secrets".

To deploy on `now.sh` run:

```
npm run deploy
```

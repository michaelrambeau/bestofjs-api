# BestOfJS public API (Work in Progress)

Public API used by https://bestof.js.org/ web application, made with [FeathersJS](https://feathersjs.com/)

Used to serve the user-generated content: the links and the reviews posted by the users.

Hosted on https://zeit.co/now

## End points

* `projects/:owner/:repo/links`: the list of links related to a given GitHub project
* `projects/:owner/:repo/reviews`: the list of reviews related to a given GitHub project
* `projects/:owner/:repo`: retrieve information about a given repository

### Sample

```json
{
  "name": "Lozad",
  "github": {
    "name": "lozad.js",
    "full_name": "ApoorvSaxena/lozad.js",
    "description": "🔥  Highly performant, light ~0.5kb and configurable lazy loader in pure JS with no dependencies for images, iframes and more",
    "homepage": "https://apoorv.pro/lozad.js/demo/",
    "stargazers_count": 1876,
    "pushed_at": "2017-09-15T18:58:18.000Z",
    "owner_id": 307583,
    "branch": "master",
    "topics": ["performance", "javascript", "lazy-loading", "lazyload", "lozad"]
  },
  "tags": ["load"],
  "npm": { "name": "lozad", "version": "1.0.2", "dependencies": [] },
  "icon": "",
  "daily-trends": [68, 125, 202, 230, 361, 331, 85, 22, 66]
}
```

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

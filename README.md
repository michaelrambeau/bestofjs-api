# Best of JavaScript public API

Public API consumed by https://bestofjs.org/ web application.

Stack:

- Node.js server made with [FeathersJS](https://feathersjs.com/)
- Hosted on https://zeit.co/now

## End points

- `projects/:owner/:repo`: retrieve details about a given repository: daily trends, packages size, bundle size...
- `projects/:owner/:repo/user-link`: the list of reviews and links, related to a given GitHub project

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

Check the result for Redux project, for example: `http://localhost:3030/projects/reactjs/redux`

## Deploy

Register database credentials as Now "secrets".

To deploy on `now.sh` run:

```
npm run deploy
```

## Testing

```
npm test
```

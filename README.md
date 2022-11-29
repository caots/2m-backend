## Installation

```bash
$ npm install
```

## Folders
+-- dist // Source build
+-- src
|   +-- config // Environment Configuration
|   +-- commons // Global Nest Module
|   |   +-- constants // Constant value and Enum
|   |   +-- auth // config jwt
|   +-- modules //
|   |   +-- auth  //Authentication
|   |   |   +-- dto // Validate and define data
|   |   |   +-- auth.controller.ts // handle incoming requests and return responses to the client
|   |   |   +-- auth.module.ts   // import module use
|   |   |   +-- auth.service.ts  //handle logic
|   +-- databases
|   |   +-- migrations
+--  tsconfig.json
+--  package.json 
+--  docker-compose.yml

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# run docker database

$ docker-compose build 

$ docker-compose up -d

# run pm2 app
$ npm run pm2

```
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


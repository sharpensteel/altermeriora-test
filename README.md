## Setup instructions

#### 1. Install packages

```bash
npm install
```

#### 2. Setup database

This line will point sequelize to `sqlite` with storage in ./tmp folder:  
```bash
cp src/config/sequelize-config.example.ts src/config/sequelize-config.ts
```

#### 3. Build and run NestJs app
```bash
npm run client:build & npm run server:build & npm run server:start:prod
```
Server will be available at http://localhost:3000/

## Tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

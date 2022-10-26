# Nestjs REST API boilerplate with TypeORM

- TypeORM
- PostgreSQL
- Authentication using JWTs
- Full E2E testing of business routes

### App configuration:

- Application configuration (including loading of proper .env files) is located in:
  ```
  src/app/configuration/configuration.module.ts
  ```
- Database configuration is located in:
  ```
  src/app/database/database.module.ts
  ```

### How to run the dev server:

1. Rename `example.env.dev` to `.env.dev`, which has pre-filled database connection information matching the docker-compose.yml file.
2. Ensure that docker is installed and running. This project requires docker-compose.
3. To run the dev server with the database: `npm run server:dev`
   Optional: To run just the server, without the database: `npm run start:dev` (may throw errors related to database not found).

### To access the routes:

1. Install the [REST CLIENT](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VSCode extension.
2. Make requests using the pre-filled `.http` files located inside `src/modules/<RESOURCE_NAME>/requests/` folder.
   Optional: Requests can also be using Postman or any other similar application.

### Testing suite:

Only E2E tests are supported.

1. Rename `example.env.test` to `.env.test`, which has pre-filled database connection information.
2. To run the e2e tests: `npm run test:e2e`
   Note: E2E testing is performed using a sqlite3 database, which is deleted after each run. This is handled using jest global hooks (before, after) located in `test/setup.test`. The name of the sqlite3 database to create is defined inside the `.env.test` file, which is loaded using the `configuration.module.ts` file.

# Restaurant Search Server

## Manual Installation

If you would prefer to do the installation manually, follow these steps:

Install the dependencies:

```bash
yarn install
```


## Environment Variables

The environment variables can be found and modified in the `.env` file:
Put .env file provided in root directory

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```



```bash
# Port number
PORT=3000

# URL of the Supabase DB
SUPABASE_URL=https://zycfjdfjnslklfujqmsz.supabase.co

## Project Structure

```
src\
 |--config\         # Config variables and configuration related things

 |--controllers\    # Route controllers (controller layer)

 |--docs\           # Swagger files

 |--middlewares\    # Custom express middlewares

 |--models\         # Data models (data layer)

 |--routes\         # Routes

 |--services\       # Business logic (service layer)

 |--utils\          # Utility classes and functions

 |--validations\    # Request data validation schemas

 |--app.js          # Express app

 |--index.js        # App entry point


### API Endpoints

List of available routes:

**Restaurant routes**:
`POST /v1/r/create` -> Create restaurant

`GET /v1/r/:restaurant_id` -> Fetch by Id

`PATCH /v1/r/:restaurant_id` -> Patch by Id

`DEL /v1/r/:restaurant_id` -> Delete by Id

`POST /v1/r/search` -> Search restaurants





## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware. For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

## Validation

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.


## Authorization

The `auth` middleware can also be used to require certain headers e.g. jwt or passkey header


## DataAccessControl

The `DAC` middleware can also be used to require certain rights/permissions to access a route.

## Logging

## Linting

## License

[MIT](LICENSE)

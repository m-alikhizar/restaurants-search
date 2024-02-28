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






-- SELECT * FROM search_restaurants('{"name": "R1"}', '{"limit": 2, "page": 1, "sortBy": "asc"}');

-- SELECT * FROM search_restaurants('{"name": "R1", "cuisine": ["5ed7c79f-560b-4541-b35f-ddb723e28f3e", "746e2621-1d93-4c8c-8b60-a99752b5687f"], "preference": ["5523a43c-3505-4ae0-b607-bedaca35874f", "40f12ea8-ce7a-47e5-b3af-3dcf3023c0e6"], "nearby": {"lat": 40.807313, "long": -73.946713}}', '{"limit": 2, "page": 1, "sortBy": "asc"}');

-- SELECT * FROM search_restaurants('{"cuisine": ["a99bd799-5553-4971-9174-d1d2d0fd1a03", "be6715c4-f782-46b5-9ea4-a8093aa5491c", "be6715c4-f782-46b5-9ea4-a8093aa5491c"], "preference": ["654f9f11-ee94-4269-8b60-18d38f538bf7", "5523a43c-3505-4ae0-b607-bedaca35874f"], "nearby": {"lat": 44.968046, "long": -94.420307}}', '{"limit": 100, "page": 1}');

SELECT * FROM search_restaurants('{"cuisine": ["a99bd799-5553-4971-9174-d1d2d0fd1a03", "be6715c4-f782-46b5-9ea4-a8093aa5491c", "be6715c4-f782-46b5-9ea4-a8093aa5491c"], "preference": ["654f9f11-ee94-4269-8b60-18d38f538bf7", "5523a43c-3505-4ae0-b607-bedaca35874f"], "in_view": {"min_lat": -90.968046, "min_long": -94.420307, "max_lat": 44.968046, "max_long": -94.432008}}', '{"limit": 100, "page": 1}');

-- SELECT * FROM search_restaurants('{"in_view": {"min_lat": -90.968046, "min_long": -94.420307, "max_lat": 44.968046, "max_long": -94.432008}}', '{"limit": 100, "page": 1}');











insert into public."Restaurant"
  (name, location)
values
  ('R5', st_point(-94.420307, 44.968046)), 
  ('R6', st_point(-94.432008, 44.968046));
  













insert into public."CuisineType"
  (name)
values
  ('American Cuisine'), 
  ('Italian Cuisine'), 
  ('French Cuisine'), 
  ('Chinese Cuisine'), 
  ('Indian Cuisine'), 
  ('Japanese Cuisine'), 
  ('Mexican Cuisine'), 
  ('Thai Cuisine'), 
  ('Mediterranean'), 
  ('Middle Eastern Cuisine');
  























CREATE OR REPLACE FUNCTION Search_Restaurants(
    filter JSONB,
    options JSONB
) RETURNS TABLE (restaurant_id UUID, name VARCHAR, location geometry) AS
$$
DECLARE
    query TEXT;
    cuisine_filter JSONB := filter->'cuisine';
    preference_filter JSONB := filter->'preference';
BEGIN
    -- Build the base query
    query := 'SELECT r.restaurant_id, r.name, r.location FROM "Restaurant" r';

    -- Check if name filter is provided
    IF jsonb_exists(filter, 'name') THEN
        query := query || ' WHERE r.name ILIKE ' || quote_literal('%' || (filter->>'name') || '%');
    END IF;

    -- Check if cuisine IDs are provided
    IF jsonb_array_length(cuisine_filter) > 0 THEN
        IF jsonb_exists(filter, 'name') THEN
            query := query || ' AND';
        ELSE
            query := query || ' WHERE';
        END IF;

        query := query || ' r.restaurant_id IN (
            SELECT DISTINCT restaurant_id 
            FROM "RestaurantCuisineTypes" 
            WHERE cuisine_id IN (
                SELECT jsonb_array_elements_text(' || quote_literal(cuisine_filter) || ')::uuid 
            )
        )';
    END IF;

    -- Check if preference IDs are provided
    IF jsonb_array_length(preference_filter) > 0 THEN
        IF jsonb_exists(filter, 'name') OR jsonb_array_length(cuisine_filter) > 0 THEN
            query := query || ' AND';
        ELSE
            query := query || ' WHERE';
        END IF;

        query := query || ' r.restaurant_id IN (
            SELECT DISTINCT restaurant_id 
            FROM "RestaurantDietaryPreferences" 
            WHERE preference_id IN (
                SELECT jsonb_array_elements_text(' || quote_literal(preference_filter) || ')::uuid 
            )
        )';
    END IF;

    -- Check if nearby filter is provided
    IF jsonb_exists(filter, 'nearby') THEN
        -- Parse nearby filter
        DECLARE
            lat DOUBLE PRECISION := (filter->'nearby'->>'lat')::DOUBLE PRECISION;
            long DOUBLE PRECISION := (filter->'nearby'->>'long')::DOUBLE PRECISION;
        BEGIN
            -- Filter restaurants within 1000 meters if nearby filter is provided
            IF jsonb_exists(filter, 'name') OR jsonb_array_length(cuisine_filter) > 0 OR jsonb_array_length(preference_filter) > 0 THEN
                query := query || ' AND';
            ELSE
                query := query || ' WHERE';
            END IF;
            query := query || format(
                ' ST_DWithin(r.location::geography, ST_MakePoint(%s, %s)::geography, %s)',
                long, lat, 5000
            );
            -- Order by distance if nearby filter is provided
            query := query || format(
                ' ORDER BY ST_Distance(r.location::geography, ST_MakePoint(%s, %s)::geography)',
                long, lat
            );
        END;
    END IF;

    -- Check if in_view filter is provided
    IF jsonb_exists(filter, 'in_view') THEN
        -- Parse in_view filter
        DECLARE
            min_lat DOUBLE PRECISION := (filter->'in_view'->>'min_lat')::DOUBLE PRECISION;
            min_long DOUBLE PRECISION := (filter->'in_view'->>'min_long')::DOUBLE PRECISION;
            max_lat DOUBLE PRECISION := (filter->'in_view'->>'max_lat')::DOUBLE PRECISION;
            max_long DOUBLE PRECISION := (filter->'in_view'->>'max_long')::DOUBLE PRECISION;
            central_lat DOUBLE PRECISION := (max_lat + min_lat) / 2.0;
            central_long DOUBLE PRECISION := (max_long + min_long) / 2.0;
        BEGIN
            -- Filter restaurants within the specified bounding box if in_view filter is provided
            IF jsonb_exists(filter, 'name') OR jsonb_array_length(cuisine_filter) > 0 OR jsonb_array_length(preference_filter) > 0 OR jsonb_exists(filter, 'nearby') THEN
                query := query || ' AND';
            ELSE
                query := query || ' WHERE';
            END IF;
            query := query || format(
                ' ST_MakePoint(ST_X(r.location), ST_Y(r.location)) && ST_MakeEnvelope(%s, %s, %s, %s, 4326)',
                min_long, min_lat, max_long, max_lat
            );
            -- Order by distance from the center of the bounding box if in_view filter is provided
            query := query || format(
                ' ORDER BY ST_Distance(r.location::geography, ST_MakePoint(%s, %s)::geography)',
                central_long, central_lat
            );
        END;
    END IF;

    -- Default ordering by name if neither nearby nor in_view filter is provided
    IF NOT jsonb_exists(filter, 'nearby') AND NOT jsonb_exists(filter, 'in_view') THEN
        query := query || ' ORDER BY r.name';
    END IF;

    -- Group and paginate the results
    IF options->>'page' IS NOT NULL THEN
        query := query || ' LIMIT ' || (options->>'limit')::INTEGER || ' OFFSET ' || ((options->>'page')::INTEGER - 1) * (options->>'limit')::INTEGER;
    END IF;

    -- Print the final query for debugging
    RAISE NOTICE 'Final query: %', query;

    -- Execute the query and return the results
    RETURN QUERY EXECUTE query;
END;
$$ LANGUAGE plpgsql;
















insert into public."DietaryPreferences"
  (name)
values
  ('Vegetarian'), 
  ('Vegan'), 
  ('Pescatarian'), 
  ('Flexitarian'), 
  ('Gluten-Free'), 
  ('Lactose-Free'), 
  ('Nut-Free'), 
  ('Sesame-Free'), 
  ('Dairy-Free'), 
  ('Keto'), 
  ('Paleo'), 
  ('Whole30'), 
  ('Halal'), 
  ('Kosher'), 
  ('Organic');
  





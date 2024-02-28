const httpStatus = require('http-status');
const { Restaurant } = require('../models');
const { toPointStr } = require('../utils/geo');
const redis = require('../cache');
const ApiError = require('../utils/ApiError');

/**
 * Create a restaurant
 * @param {Object} restaurantBody
 * @returns {Promise<Restaurant>}
 */
const createRestaurant = async (payload) => {
  try {
    const restaurant = await Restaurant.create(payload);

    return restaurant;
  } catch (error) {
    throw new Error('Error creating restaurant');
  }
};

/**
 * Query for restaurants
 * @param {Object} filter - Supabase filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRestaurants = async (filter, options) => {
  const restaurants = await Restaurant.paginate(filter, options);
  return restaurants;
};

/**
 * Get restaurant by id
 * @param {ObjectId} id
 * @returns {Promise<Restaurant>}
 */
const getRestaurantById = async (id) => {
  const cachedData = await redis.get(`restaurant:${id}`);

  if (cachedData) {
    console.log('Cache hit!');
    return JSON.parse(cachedData); // Parse JSON data retrieved from cache
  } else {
    console.log('Cache miss!');

    // Fetch data from the database
    const dataFromDB = await Restaurant.findById(id);

    // Store the data in the cache
    await redis.set(`restaurant:${id}`, JSON.stringify(dataFromDB));

    return dataFromDB;
  }
};

/**
 * Update restaurant by id
 * @param {ObjectId} restaurantId
 * @param {Object} updateBody
 * @returns {Promise<Restaurant>}
 */
const updateRestaurantById = async (filter, payload) => {
  const restaurant = await Restaurant.findById(filter.restaurant_id);
  
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
  }

  const mergedInfo = Object.assign(restaurant, payload);
  const transformedMergedInfo = { ...mergedInfo };
  transformedMergedInfo.location = toPointStr(mergedInfo.location);

  const result = await Restaurant.updateById(filter.restaurant_id, transformedMergedInfo)

  const redisRecord = await redis.get(`restaurant:${filter.restaurant_id}`);
  if (redisRecord) {
    const updatedRedisRecord = { ...JSON.parse(redisRecord), ...payload };
    await redis.set(`restaurant:${filter.restaurant_id}`, JSON.stringify(updatedRedisRecord));
  }

  return result;
};

/**
 * Delete restaurant by id
 * @param {ObjectId} restaurantId
 * @returns {Promise<Restaurant>}
 */
const deleteRestaurantById = async (restaurantId) => {
  try {
    // Check if the restaurant exists
    const redisRecord = await redis.get(`restaurant:${restaurantId}`);
    if (redisRecord) {
      // If Redis record exists, delete it
      await redis.del(`restaurant:${restaurantId}`);
    }

    const existingRestaurant = await Restaurant.findById(restaurantId);
    if (!existingRestaurant) {
      throw new Error('Restaurant not found');
    }

    // Delete the restaurant
    const result = await Restaurant.deleteById(restaurantId);

    return result; // Return the deleted restaurant
  } catch (error) {
    throw new Error('Error deleting restaurant by ID: ' + error.message);
  }
};

module.exports = {
  createRestaurant,
  queryRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById
};

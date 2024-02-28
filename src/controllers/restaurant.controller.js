const httpStatus = require('http-status');
const pick = require('../utils/pick');
const { toPointStr } = require('../utils/geo');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { restaurantService } = require('../services');

const createRestaurant = catchAsync(async (req, res) => {
  const payload =  pick(req.body, ['name']);
  payload.location = toPointStr(req.body.location);

  const restaurant = await restaurantService.createRestaurant(payload);
  res.status(httpStatus.CREATED).send(restaurant);
});

const searchRestaurants = catchAsync(async (req, res) => {
  const filter = pick(req.body, ['name', 'nearby', 'in_view', 'cuisine', 'preference']);
  const options = pick(req.query, ['limit', 'page']);
  const results = await restaurantService.queryRestaurants(filter, options);
  res.send(results);
});

const getRestaurant = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.restaurant_id);
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
  }
  res.send(restaurant);
});

const updateRestaurant = catchAsync(async (req, res) => {
  const filter = pick(req.params, ['restaurant_id']);
  const payload  = pick(req.body, ['name', 'contact_no', 'cuisine_id', 'preference_id']);

  const restaurant = await restaurantService.updateRestaurantById(filter, payload);
  res.send(restaurant);
});

const deleteRestaurant = catchAsync(async (req, res) => {
  const filter = pick(req.params, ['restaurant_id']);
  await restaurantService.deleteRestaurantById(filter.restaurant_id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRestaurant,
  searchRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
};

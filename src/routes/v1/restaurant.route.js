const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const DAC = require('../../middlewares/DAC');
const restaurantValidation = require('../../validations/restaurant.validation');
const restaurantController = require('../../controllers/restaurant.controller');

const router = express.Router();

router.route('/create').post(auth(), validate(restaurantValidation.createRestaurant), DAC('read', 'write'), restaurantController.createRestaurant)
router.route('/search').post(auth(), validate(restaurantValidation.searchRestaurants), DAC('search-restaurants'), restaurantController.searchRestaurants);

router
  .route('/:restaurant_id')
  .get(auth(), validate(restaurantValidation.getRestaurant), DAC('search-restaurants'), restaurantController.getRestaurant)
  .patch(auth(), validate(restaurantValidation.updateRestaurant), DAC('manage-restaurants'), restaurantController.updateRestaurant)
  .delete(auth(), validate(restaurantValidation.deleteRestaurant), DAC('manage-restaurants'), restaurantController.deleteRestaurant);


module.exports = router;

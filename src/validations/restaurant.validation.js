const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRestaurant = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    location: Joi.object().keys({ lat: Joi.number(), long: Joi.number() }).required(),
    // role: Joi.string().required().valid('user', 'admin', 'creator'),
  }),
};

const searchRestaurants = {
  query: Joi.object().keys({
    limit: Joi.number().integer().optional().default(10),
    page: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    cuisine: Joi.array().items(Joi.string()).empty().default([]),
    preference: Joi.array().items(Joi.string()).empty().default([]),
    nearby: Joi.object().keys({
      lat: Joi.number(),
      long: Joi.number(),
    }).optional(),
    in_view: Joi.object().keys({
      min_lat: Joi.number(),
      min_long: Joi.number(),
      max_lat: Joi.number(),
      max_long: Joi.number(),
    }).optional()
  })
  .custom((value, helpers) => {
    const hasNearby = value.nearby !== undefined;
    const hasInView = value.in_view !== undefined;
    
    if (hasNearby && hasInView) {
      return helpers.error('any.invalid');
    }

    return value;
  })
  .messages({
    'any.invalid': 'Either nearby or in_view should be provided, not both!'
  })
};

const getRestaurant = {
  params: Joi.object().keys({
    restaurant_id: Joi.string().custom(objectId),
  }),
};

const updateRestaurant = {
  params: Joi.object().keys({
    restaurant_id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      cuisine_id: Joi.array().items(Joi.string().custom(objectId)).optional().empty(),
      preference_id: Joi.array().items(Joi.string().custom(objectId)).optional().empty(),
      contact_no: Joi.string().optional(),
      location: Joi.object().keys({
        lat: Joi.number(),
        long: Joi.number(),
      }).optional().empty(),
    })
    .min(1),
};

const deleteRestaurant = {
  params: Joi.object().keys({
    restaurant_id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRestaurant,
  searchRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
};

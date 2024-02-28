const validator = require('validator');
const { Point } = require('../utils/geo');
const { supabase } = require('../config/supabase');

class Restaurant {
  constructor({ restaurant_id, name, location, contact_no }) {
    this.restaurant_id = restaurant_id;
    this.name = name;
    this.location = new Point(location);
    this.contact_no = contact_no;
  }

  static async paginate(filter, options) {
    try {
      // Convert JavaScript objects to JSONB strings
      const filterJsonb = JSON.stringify(filter);
      const optionsJsonb = JSON.stringify(options);

      // Execute the stored procedure
      const { data, error } = await supabase
        .rpc('search_restaurants', { filter, options });

      if (error) {
        if(error.code === 'PGRST116') {
          return null;
        } else {
          throw new Error('Error searching restaurants');
        }
      }

      // Process the result and return as an array of restaurants
      const restaurants = data.map(row => new Restaurant( row ))
      
      return restaurants;
    } catch (error) {
      throw new Error('Error retrieving restaurants');
    }
  }

  static async create(payload) {
    try {
      const { data, error } = await supabase
        .from('Restaurant')
        .insert([payload])
        .select('*');

      if (error) {
        throw new Error('Error creating restaurant');
      }

      return data;
    } catch (error) {
      throw new Error('Error creating restaurant');
    }
  }

  static async findById(restaurantId) {
    try {
      const { data, error } = await supabase
        .from('Restaurant')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .single(); // Assuming restaurantId is unique

      if (error) {
        if(error.code === 'PGRST116') {
          return null;
        } else {
          throw new Error('Error retrieving restaurant by id');
        }
      }
      
      const restaurant = new Restaurant( data );
      
      return restaurant;
    } catch (error) {
      throw new Error('Error retrieving restaurant by id');
    }
  }

  static async updateById(restaurantId, payload) {
    try {
      const { data, error } = await supabase
      .from('Restaurant')
      .update(payload)
      .eq('restaurant_id', restaurantId)
      .single() // Assuming restaurantId is unique
      .select('*');

      if (error) {
        throw new Error('Error updating restaurant by id');
      }
      
      const restaurant = new Restaurant( data );
      
      return restaurant;
    } catch (error) {
      throw new Error('Error retrieving restaurant by id');
    }
  }

  static async deleteById(restaurantId) {
    try {
      // Delete associated records in RestaurantCuisineTypes table
      await supabase
        .from('RestaurantCuisineTypes')
        .delete()
        .eq('restaurant_id', restaurantId);

      // Delete associated records in RestaurantDietaryPreferences table
      await supabase
        .from('RestaurantDietaryPreferences')
        .delete()
        .eq('restaurant_id', restaurantId);

      const { data, error } = await supabase
        .from('Restaurant')
        .delete()
        .eq('restaurant_id', restaurantId)
        .single()
        .select('*');

      if (error) {
        throw new Error('Error deleting restaurant by ID: ' + error.message);
      }

      return data;
    } catch(err) {
      throw new Error('Error deleting restaurant by ID: ' + error.message);
    }
  }

  // Other model methods for CRUD operations
}


module.exports = Restaurant;

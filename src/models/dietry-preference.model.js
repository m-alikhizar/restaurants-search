class DietaryPreferences {
    constructor({ preference_id, name }) {
      this.preference_id = preference_id;
      this.name = name;
    }
  
    static async findById(preferenceId) {
      // Implement database query to find dietary preference by ID
    }
  
    // Other model methods for CRUD operations
  }

  module.exports = DietaryPreferences;
  
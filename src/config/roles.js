const allRoles = {
  user: ['search-restaurants', 'get-restaurant'],
  creator: ['create-restaurant', 'manage-restaurants'],
  admin: ['manage-restaurants'], // when we define and support users then we'll define the admin rights.
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

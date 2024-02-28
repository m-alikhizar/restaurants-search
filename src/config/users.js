const temporary_users = [
    {
        title: 'Admin',
        user_id: '123',
        role: ['read', 'write'],
        associated_account: [],
        profile: {},
        auth_attributes: {},
    },
    {
        title: 'Creator',
        user_id: '234',
        role: ['create-restaurant', 'manage-restaurants'],
        associated_account: [],
        profile: {},
        auth_attributes: {},
    },
    {
        title: 'User',
        user_id: '786',
        role: ['search-restaurants'],
        associated_account: [],
        profile: {},
        auth_attributes: {},
    }
]

  
  const users = temporary_users;
  
  module.exports = {
    users
  };

//   Note: these users are temporary just to drive the search flow.
//   Will be defined in db with their profile, associated accounts and sub users etc..
//   Can use user system defined by passport or aws cognito.

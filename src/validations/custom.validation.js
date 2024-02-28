const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F-]{36}$/)) {
    return helpers.message('"{{#label}}" must be a valid supabase id');
  }
  return value;
};

module.exports = {
  objectId
};

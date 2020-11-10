module.exports = {
  //@description: make sure user contains whitelisted role.
  //@param: cache - discord guild member roles cache map
  //@param: roles - array of whitelisted roles
  checkRole: (cache, roles) => {
    for (const role of roles) {
      if (cache.has(role)) {
        return true;
      }
    }
    return false;
  },
};

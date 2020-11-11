const path = require('path');
const configName = process.env.CONFIG || 'dev.config.json';
module.exports = () => {
  let config = {};
  if (process.env.NODE_ENV === 'production') {
    config = require('../../config.json');
    return config;
  } else {
    config = require(path.join(`../../${configName}`));
    return config;
  }
};

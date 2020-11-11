const axios = require('axios');
const config = require('./loadConfig')();

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
  getRoleByName: (guildRoles, roleToFind) => {
    return guildRoles.find((role) => role.name === roleToFind);
  },
  getNumberEmoji(number) {
    const emojis = [
      '0️⃣',
      '1️⃣',
      '2️⃣',
      '3️⃣',
      '4️⃣',
      '5️⃣',
      '6️⃣',
      '7️⃣',
      '8️⃣',
      '9️⃣',
      '🔟',
    ];
    if (number < 0 || number > 10) return;
    return emojis[number];
  },
  async getRoleboardMessageId() {
    const response = await axios({
      method: 'get',
      url: config.jsonbinurl,
      headers: { 'secret-key': process.env.JSONBINKEY },
    });
    console.log('response');
    if (!response || !response.data.success) {
      console.log('axios error: ', response.message);
      return;
    }
    return response.data.data;
  },
  async updateRoleboard(roleboard, messageID) {
    if (!config.roleboard[roleboard]) {
      console.log("roleboard doesn't exist");
      return;
    }

    const data = {};
    data[roleboard] = messageID;

    const response = await axios({
      method: 'put',
      url: config.jsonbinurl,
      headers: { 'secret-key': process.env.JSONBINKEY },
      data: data,
    });
    if (!response.data.success || !response) {
      console.log('axios error: ', response.error);
      return;
    }
    return response.data.data;
  },
};

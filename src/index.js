require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
const Tracker = require('./tracker');

const config = require('./utils/loadConfig')();
const PREFIX = process.env.BOT_PREFIX || config.prefix;
const utils = require('./utils/utils');
const mcctracker = new Tracker('my tracker');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('you 👀', {
    type: 'LISTENING',
    url: 'https://msucomputerclub.com',
  });
});

client.on('message', async (msg) => {
  if (msg.author.bot) return; //don't respond to bots
  if (!msg.content.startsWith(PREFIX)) return; //check for prefix

  const args = msg.content.slice(PREFIX.length).trim().split(/ +/g); //parse arguments
  const command = args.shift().toLowerCase(); //parse command

  if (command === 'test') {
  }

  if (command === 'ping') {
    const m = await msg.channel.send('Ping?');
    m.edit(
      `Pong! Latency is ${
        m.createdTimestamp - msg.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  }

  if (!utils.checkRole(msg.member.roles.cache, config.roleWhitelist)) return; //check user against whitelisted roles
  if (command === 'track') {
    const channel = msg.member.voice.channel;
    if (!channel) return msg.reply('you must be in a voice channel');
    if (mcctracker.isTracking)
      return msg.reply("I'm already tracking a channel");
    mcctracker.track(channel);
    console.log('tracking');
    msg.react('👀');
  }

  if (command === 'attendance') {
    let attendance = mcctracker.attendance;
    if (attendance.length === 0) return msg.reply('list is empty 🤷‍♂️');
    let usernames = attendance.map((user) => {
      return user.name;
    });
    msg.reply(
      `\`\`\`Number of users: ${usernames.length}\nUsernames: [${usernames}]\`\`\``
    );
  }

  if (command === 'stoptrack') {
    if (!mcctracker.isTracking) return msg.reply("I'm not tracking anything");
    mcctracker.setIsTracking(false);
    console.log('stopped tracking');
    msg.react('👌');
    return;
  }

  if (command === 'roleboard') {
    let category = args[0]; //get rolebaord category from command argument
    if (!config.roleboard[category])
      return msg.reply('no such board exists 🤷‍♂️');
    //parse roles from config and add role name and value for the emoji reaction
    const roles = [];
    for (let i = 0; i < config.roleboard[category].length; i++) {
      let role = await msg.guild.roles.fetch(config.roleboard[category][i]);
      if (!role) {
        console.log('incorrect role id');
        return msg.reply(
          'role IDs are do not match roles on the server. Check config file'
        );
      }
      roles.push({
        name: role.name,
        value: utils.getNumberEmoji(i),
      });
    }
    console.log('roles', roles);
    //setup embed and send it
    const richEmbed = new Discord.MessageEmbed()
      .setColor('#df5856')
      .setTitle(`Choose your ${category}`)
      .setDescription(
        'Press corresponding reaction to assign role. Press again to remove role.'
      )
      .addFields(roles);
    console.log('sending rich embed');
    const reply = await msg.channel.send(richEmbed);
    const updatedJsonBin = await utils.updateRoleboard(category, reply.id);
    console.log('new jsonbin', updatedJsonBin);
    if (!updatedJsonBin) {
      console.log('error updating JsonBin: ', response.message);
      await reply.delete();
      console.log('deleted message');
      return;
    }

    //add reactions
    for (const role of roles) {
      await reply.react(role.value);
    }
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  console.log(reaction, user);
});

client.login(process.env.TOKEN).then(console.log('prefix', PREFIX));

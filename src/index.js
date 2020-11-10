require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');
const Tracker = require('./tracker');
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
});

client.login(process.env.TOKEN).then(console.log('prefix', PREFIX));

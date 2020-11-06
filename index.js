require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const Tracker = require('./tracker');
const mcctracker = new Tracker('my tracker');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('you 👀', {
    type: 'LISTENING',
    url: 'https://msucomputerclub.com',
  });
});

client.on('message', async (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.prefix)) return;
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    const m = await msg.channel.send('Ping?');
    m.edit(
      `Pong! Latency is ${
        m.createdTimestamp - msg.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  }

  if (command === 'track') {
    const channel = msg.member.voice.channel;
    if (!channel) return msg.reply('you must be in a voice channel');
    console.log('tracking');
    mcctracker.track(channel);
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
    console.log('stopped tracking');
    mcctracker.setIsTracking(false);
    return;
  }

  if (command === 'deltrack') {
    // attendance = new Map();
  }
});

client.login(process.env.TOKEN);

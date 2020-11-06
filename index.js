require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.prefix)) return;
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const m = await msg.channel.send("Ping?");
    m.edit(
      `Pong! Latency is ${
        m.createdTimestamp - msg.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  }
});

client.login(process.env.TOKEN);

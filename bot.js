const Discord = require("discord.js");
const configJson = require('./config.json');
const fs = require("fs");
const client = new Discord.Client();
client.login("NzQ3ODc1ODE5NzgyOTMwNDYy.X0VPog.kFEWtSaN0UH6saxySI7qqCJvGU8");

var guild;
var manRole;
var womanRole;
var unregisterRole;
var manRegisterCommand;
var womanRegisterCommand;
var registerChannel;
var commandChannel;
var prefix;

function saveConfig()
{
  fs.writeFile('config.json', JSON.stringify(configJson), function(err, result)
  {
     if(err)
      console.log('error', err);
  });
}
function updateConfig()
{
  guild = client.guilds.cache.get(configJson.Guild);
  client.user.setUsername(configJson.BotName);
  manRole = guild.roles.cache.get(configJson.ManRole);
  womanRole = guild.roles.cache.get(configJson.WomanRole);
  unregisterRole = guild.roles.cache.get(configJson.UnregisterRole);
  registerChannel = guild.channels.cache.get(configJson.RegisterChannel);
  commandChannel = guild.channels.cache.get(configJson.CommandChannel);
  manRegisterCommand = configJson.ManRegisterCommand;
  womanRegisterCommand = configJson.WomanRegisterCommand;
  prefix = configJson.Prefix;
  saveConfig();
}
client.on('ready', () =>
{
  updateConfig();
  console.log(configJson.BotName + " Bot Enabled!");
});
client.on("message", message =>
{
  if(message.author.bot || (message.channel.type === "dm" || message.guild === null) ||(message.channel.id !== registerChannel.id && message.channel.id !== commandChannel.id))
    return;
  if(message.channel.id === registerChannel.id)
  {
    if(message.member.hasPermission("MANAGE_ROLES"))
    {
      var args = message.content.split(" ");
      if(args.length === 4)
      {
        if(message.mentions.users.size === 1)
        {
          if(args[0] === prefix + manRegisterCommand || args[0] == prefix + womanRegisterCommand)
          {
            const taggedUser = guild.members.cache.get(message.mentions.users.first().id);
            if(!taggedUser.roles.cache.has(manRole) && !taggedUser.roles.cache.has(womanRole))
            {
              var username = args[2] + " | " + args[3];
              taggedUser.setNickname(username);
              if(args[0] === prefix + manRegisterCommand)
              {
                taggedUser.roles.add(manRole).catch(console.error);
              }
              else
              {
                taggedUser.roles.add(womanRole).catch(console.error);
              }
              taggedUser.roles.remove(unregisterRole).catch(console.error);
              registerChannel.messages.fetch({ limit: 50 }).then(async messages => 
              {
                for (const message of messages.array().reverse())
                {
                  for(var i = 0; i < message.embeds.length; i++) 
                  {
                    if(message.embeds[i].title === taggedUser.id) 
                    {
                      message.delete({ timeout: 0 });
                    }
                  }
                }
              });
              message.delete({ timeout: 100});
            }
            else
            {
              message.reply(message.author.toString() + " Bu kullanıcı zaten kayıtlı!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
              message.delete({ timeout: 1000});
            }
          }
          else
          {
            message.reply(message.author.toString() + prefix + manRegisterCommand + "/" + womanRegisterCommand + " @kişi ism yaş").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
            message.delete({ timeout: 1000});
          }
        }
        else
        {
          message.reply(message.author.toString() + " Kayıt etmek istediğin kişiyi taglemeyi unuttun veya 1 den fazla kişiyi tagledin!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
          message.delete({ timeout: 1000});
        }
      }
      else
      {
        message.reply(message.author.toString() + prefix +manRegisterCommand + "/" + womanRegisterCommand + " @kişi ism yaş").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
        message.delete({ timeout: 1000});
      }
    }
    else
    {
      message.reply(message.author.toString() + " Bu komutu kullanmak için yetkin yok!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
      message.delete({ timeout: 1000});
    }
  }
  else if(message.channel.id === commandChannel.id)
  {
  
  }
});
client.on("guildMemberAdd", member =>
{
  const temp = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle(member.user.id)
  .setDescription("**Sunucuya Yeni Bir Üye Geldi!**")
  .setThumbnail(member.user.avatarURL())
  .addFields(
    { name: '** **', value: member.user.toString() + "** Seni Bekliyorduk.**"},
    { name: '** **', value: "Lütfen Yetkili Birini Etiketleyip  **İsim** ve **Yaşınızı** Yazınız."},
    { name: '** **', value: womanRole.toString() + " Rolünü Almak İçin **SES TEYİT** Veremeniz zorunludur."},
    { name: '** **', value: "**Kayıt Durumu; **<:x:779684693246607371>"}
  )
  .setTimestamp();
  registerChannel.send(temp);
});
client.on("guildMemberRemove", member => 
{
  registerChannel.messages.fetch({ limit: 50 }).then(async messages => 
  {
    for (const message of messages.array().reverse())
    {
      for(var i = 0; i < message.embeds.length; i++) 
      {
        if(message.embeds[i].title === member.id) 
        {
          message.delete({ timeout: 100 });
        }
      }
    }
  });
});

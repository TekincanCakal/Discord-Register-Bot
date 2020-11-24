const Discord = require("discord.js");
const mysql = require('mysql');
const client = new Discord.Client();
client.login("NzQ3ODc1ODE5NzgyOTMwNDYy.X0VPog.kFEWtSaN0UH6saxySI7qqCJvGU8");
var con = mysql.createConnection(
{
  host: "remotemysql.com",
  user: "79KguD9kSz",
  password: "sk5CzWKzD0",
  database: "79KguD9kSz"
});
var configJson;
var guild;
var manRole;
var womanRole;
var unregisterRole;
var registerChannel;
var commandChannel;

function updateConfig()
{
  connectMysql();
  var sql = "UPDATE RegisterBotConfig SET BotName = '" + configJson.BotName + "', Prefix = '" + configJson.Prefix + "', ManRole = '" + configJson.ManRole + "', WomanRole = '" + configJson.WomanRole + "', UnregisterRole = '" + configJson.UnregisterRole + "', RegisterChannel = '" + configJson.RegisterChannel + "', CommandChannel = '" + configJson.CommandChannel + "', ManRegisterCommand = '" + configJson.manRegisterCommand + "', WomanRegisterCommand = '" + configJson.WomanRegisterCommand + "' WHERE id = 0"; 
  con.query(sql, function (err, result) 
  {
    if (err) 
    {
      console.log("error: " + err.message);
    }
  });
  client.user.setUsername(configJson.BotName);
  manRole = guild.roles.cache.get(configJson.ManRole);
  womanRole = guild.roles.cache.get(configJson.WomanRole);
  unregisterRole = guild.roles.cache.get(configJson.UnregisterRole);
  registerChannel = guild.channels.cache.get(configJson.RegisterChannel);
  commandChannel = guild.channels.cache.get(configJson.CommandChannel);
}
function loadConfig()
{
  connectMysql();
  var sql = "SELECT * FROM RegisterBotConfig WHERE id = 0";
  configJson = con.query(sql, function (err, result, fields) 
  {
      if (err) console.log("error: " + err.message);
      closeMysql();
      console.log(result[0]);
      console.log(result[0].BotName);
      return result;
  });
}
function connectMysql()
{
  con.connect(function(err) 
  {
    if (err) 
    {
      console.log("error: " + err.message);
      throw err;
    }
  });
}
function closeMysql()
{
  con.end(function(err)
  {
    if (err) throw err;
  });
}
function memberCount()
{
   return guild.members.cache.filter(member => !member.user.bot).size; 
}
client.on('ready', () =>
{
  guild = client.guilds.cache.get("773638840002543618");
  loadConfig();
  console.log(configJson);
  console.log(configJson[0].BotName + " Bot Enabled!");
  client.user.setActivity(memberCount() + " Kişi Bu Sunucuda"); 
});
client.on("message", message =>
{
  if(message.author.bot || (message.channel.type === "dm" || message.guild === null) ||(message.channel.id !== registerChannel.id && message.channel.id !== commandChannel.id))
    return;
  if(message.channel.id === registerChannel.id)
  {
    var args = message.content.split(" ");
    if(args[0] === configJson.Prefix + configJson.ManRegisterCommand  || args[0] === configJson.Prefix + configJson.WomanRegisterCommand)
    {
      if(message.member.hasPermission("MANAGE_ROLES"))
      {
        if(args.length === 4)
        {
          if(message.mentions.users.size === 1)
          {
            const taggedUser = guild.members.cache.get(message.mentions.users.first().id);
            if(!taggedUser.roles.cache.has(manRole) && !taggedUser.roles.cache.has(womanRole))
              {
                var username = args[2] + " | " + args[3];
                taggedUser.setNickname(username);
                if(args[0] === configJson.Prefix + configJson.ManRegisterCommand)
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
                message.reply("Bu kullanıcı zaten kayıtlı!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
                message.delete({ timeout: 1000});
              }
          }
          else
          {
            message.reply("Kayıt etmek istediğin kişiyi taglemeyi unuttun veya 1 den fazla kişiyi tagledin!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
            message.delete({ timeout: 1000});
          }
        }
         else
          {
            message.reply(prefix + manRegisterCommand + "/" + womanRegisterCommand + "@kişi isim yaş").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
            message.delete({ timeout: 1000});
          }
      }
      else
      {
        message.reply("Bu komutu kullanmak için yetkin yok!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
        message.delete({ timeout: 1000});
      } 
    }
  }
  else if(message.channel.id === commandChannel.id)
  {
    if(message.member.hasPermission("ADMINISTRATOR"))
    {
      if(message.mentions.users.size && message.mentions.users.first().id === client.user.id)
      {
        var args = message.content.trim().split(" ");
        if(args.length === 1)
        {
          const temp = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(configJson.BotName + " Bot Ayarları");
          temp.addField("1.ManRole:", manRole.toString(), true);
          temp.addField("2.WomanRole:", womanRole.toString(), true);
          temp.addField("3.UnregisterRole:", unregisterRole.toString(), true);
          temp.addField("4.RegisterChannel:", registerChannel.toString(), true);
          temp.addField("5.CommandChannel:", commandChannel.toString(), true);
          temp.addField("6.BotName:", configJson.BotName, true);
          temp.addField("7.ManRegisterCommand:", configJson.ManRegisterCommand, true);
          temp.addField("8.WomanRegisterCommand:", configJson.WomanRegisterCommand, true);
          temp.addField("9.Prefix:", configJson.Prefix, true);
          commandChannel.send(temp);
          commandChannel.send("<@747875819782930462> <AyarSıraNo> <Tag/String>");
        }
        else if(args.length === 3)
        {
          var index = parseInt(args[1]);
          if(index >= 1 && index <= 9)
          {
            if(index >= 1 && index <= 5)
            {
              if(args[2].length === 18)
              {
                if(index === 1)
                {
                  configJson.ManRole = args[2];
                }
                else if(index === 2)
                {
                  configJson.WomanRole = args[2];
                }
                else if(index === 3)
                {
                  configJson.UnregisterRole = args[2];
                }
                else if(index === 4)
                {
                  configJson.RegisterChannel = args[2];
                }
                else if(index === 5)
                {
                  configJson.CommandChannel = args[2];
                }
              }
              else
              {
                message.reply("Yanlış kanal/rol idsi girdiniz!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
                message.delete({ timeout: 1000});
              } 
            }
            else if(index === 6)
            {
              configJson.BotName = args[2];
            }
            else
            {
              if(index == 7)
              {
                configJson.ManRegisterCommand = args[2];
              }
              else if(index == 8)
              {
                configJson.WomanRegisterCommand = args[2];
              }
              else if(index == 9)
              {
                if(args[2].length === 1)
                {
                  configJson.Prefix = args[2];
                }
                else
                {
                  message.reply("Prefix sadece tek karakterden oluşmalıdır!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
                  message.delete({ timeout: 1000});
                } 
              }
            }
          }
          else
          {
            message.reply("Yanlış index girdiniz!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
            message.delete({ timeout: 1000});
          }
          message.reply("Başarıyla Değiştirildi!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
          message.delete({ timeout: 1000});
          updateConfig();
        }
      }
    }
    else
    {
      message.reply("Bu komutu kullanmak için yetkin yok!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
      message.delete({ timeout: 1000});
    }
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
  client.user.setActivity(memberCount() + " Kişi Bu Sunucuda"); 
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
  client.user.setActivity(memberCount() + " Kişi Bu Sunucuda"); 
});

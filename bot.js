const Discord = require("discord.js");
const client = new Discord.Client();
client.login("NzQ3ODc1ODE5NzgyOTMwNDYy.X0VPog.avWW-zeaYUqEwrAnAAL5x11zCDo");
var configJson = require("./config.json");
var guild;
var manRole;
var womanRole;
var unregisterRole;
var registerRole;
var registerManRole;
var registerChannel;

function loadConfig()
{  
  client.user.setUsername(configJson.BotName);
  manRole = guild.roles.cache.get(configJson.ManRole);
  womanRole = guild.roles.cache.get(configJson.WomanRole);
  unregisterRole = guild.roles.cache.get(configJson.UnregisterRole);
  registerRole = guild.roles.cache.get(configJson.RegisterRole);
  registerManRole = guild.roles.cache.get(configJson.RegisterManRole);
  registerChannel = guild.channels.cache.get(configJson.RegisterChannel);
  commandChannel = guild.channels.cache.get(configJson.CommandChannel);
}
function memberCount()
{
   return guild.members.cache.filter(member => !member.user.bot).size; 
}
client.on("ready", () =>
{
  guild = client.guilds.cache.get("773638840002543618");
  loadConfig();
  console.log(configJson.BotName + " Bot Enabled!");
  client.user.setActivity(memberCount() + " Kişi Bu Sunucuda"); 
});
client.on("message", (message) =>
{
  try {
    if (message.author.bot || (message.channel.type === "dm" || message.guild === null))
      return;
    if (message.channel.id === registerChannel.id) {
      var args = message.content.split(" ");
      if (args[0] === configJson.Prefix + configJson.ManRegisterCommand || args[0] === configJson.Prefix + configJson.WomanRegisterCommand) {
        if (message.member.hasPermission("MANAGE_ROLES")) {
          if (args.length === 2) {
            if (message.mentions.users.size === 1) {
              const taggedUser = guild.members.cache.get(message.mentions.users.first().id);
              if (!(taggedUser.roles.cache.has(manRole.id) || taggedUser.roles.cache.has(womanRole.id))) {
                var roleString = "";
                if (args[0] === configJson.Prefix + configJson.ManRegisterCommand) {
                  taggedUser.roles.add(manRole).catch(console.error);
                  roleString = manRole.toString();
                } else {
                  taggedUser.roles.add(womanRole).catch(console.error);
                  roleString = womanRole.toString();
                }
                taggedUser.roles.remove(unregisterRole).catch(console.error);
                taggedUser.roles.add(registerRole).catch(console.error);
                const temp = new Discord.MessageEmbed()
                    .setColor('#000000')
                    .setAuthor("Nyän | Kayıt Sistemi", client.user.avatarURL(), "")
                    .setTitle("Kayıt Tamamlandı")
                    .setDescription(":sparkles:**Kayıt Edilen Kullanıcı:**" + taggedUser.user.toString() + "\n:boom: **Verilen Rol:**" + roleString + "\n:rice_ball: **Kayıt Eden Yetkili: **" + message.author.toString())
                    .setThumbnail(taggedUser.user.avatarURL())
                    .setTimestamp();
                registerChannel.send(temp);
                message.delete({timeout: 100});
              } else {
                message.reply("Bu kullanıcı zaten kayıtlı!").then(msg => {
                  msg.delete({timeout: 1000})
                }).catch(console.error);
                message.delete({timeout: 1000});
              }
            } else {
              message.reply("Kayıt etmek istediğin kişiyi taglemeyi unuttun veya 1 den fazla kişiyi tagledin!").then(msg => {
                msg.delete({timeout: 1000})
              }).catch(console.error);
              message.delete({timeout: 1000});
            }
          } else {
            message.reply(configJson.Prefix + configJson.ManRegisterCommand + "/" + configJson.WomanRegisterCommand + "@kişi").then(msg => {
              msg.delete({timeout: 1000})
            }).catch(console.error);
            message.delete({timeout: 1000});
          }
        } else {
          message.reply("Bu komutu kullanmak için yetkin yok!").then(msg => {
            msg.delete({timeout: 1000})
          }).catch(console.error);
          message.delete({timeout: 1000});
        }
      }
    }
    if (message.content.startsWith("!nyansay")) {
      if (message.author.id === "339408846705524737") {
        var temp = message.content.replace("!nyansay ", "");
        message.channel.send(temp);
        console.log(temp);
        message.delete({timeout: 100});
      }
      else
      {
        message.delete({timeout: 100});
        message.channel.send("Yetkin yok").then(msg => {msg.delete({timeout: 1000})}).catch(console.error);
      }
    }
    else if(message.content.startsWith("!onlinegirls"))
    {
      var temp = guild.members.cache.filter(member => member.user.roles.cache.has(womanRole.id)).join('\n');
      message.delete({timeout: 100});
      message.channel.send(temp);
    }
  }
  catch(err) {
  console.log(err.message);
}
});
client.on("guildMemberAdd", member =>
{
  const d = new Date( member.user.createdAt );
  date = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
  registerChannel.send(registerManRole.toString() + member.user.toString());
  const temp = new Discord.MessageEmbed()
 .setColor('#000000')
 .setAuthor("Nyän | Kayıt Sistemi", client.user.avatarURL(), "")
 .setDescription("<:kedy:794319006068113408> **Sunucumuza Hoşgeldin**" + member.user.toString() +"\n:date: **Hesap Oluşturma Tarihi:** " + date + "\n**:white_check_mark: Güvenilirlik Durumu:** Güvenilir\n:cherry_blossom: Kayıt için teyit zorunludur\n:stars: **Kayıt olmak için yetkilileri beklemen yeterlidir.**\n**Yetkililer sizinle ilgilenecektir.**")
 .setThumbnail(member.user.avatarURL());
  registerChannel.send(temp);
  client.user.setActivity(memberCount() + " Kişi Bu Sunucuda");
  guild.members.cache.filter(member => member.roles.cache.has(registerManRole.id)).forEach(x => x.user.send(member.user.toString() + " Sunucuya Katıldı, kayıt odasında kayıt olmayı bekliyor, adını ve yaşını öğrenip kaydetmelisin.(づ｡◕‿‿◕｡)づ")); 
  
});
client.on("guildMemberRemove", member => 
{
  client.user.setActivity(memberCount() + " Kişi Bu Sunucuda"); 
});

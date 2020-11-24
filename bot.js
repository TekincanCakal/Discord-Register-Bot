const Discord = require("discord.js");
const client = new Discord.Client();
client.login("NzQ3ODc1ODE5NzgyOTMwNDYy.X0VPog.kFEWtSaN0UH6saxySI7qqCJvGU8");
var configJson = require("./config.json");
var guild;
var manRole;
var womanRole;
var unregisterRole;
var registerChannel;

function loadConfig()
{  
  client.user.setUsername(configJson.BotName);
  manRole = guild.roles.cache.get(configJson.ManRole);
  womanRole = guild.roles.cache.get(configJson.WomanRole);
  unregisterRole = guild.roles.cache.get(configJson.UnregisterRole);
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
            if(!(taggedUser.roles.cache.has(manRole.id) || taggedUser.roles.cache.has(womanRole.id)))
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
            message.reply(configJson.Prefix + configJson.ManRegisterCommand + "/" + configJson.WomanRegisterCommand + "@kişi isim yaş").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
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

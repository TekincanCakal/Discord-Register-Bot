const Discord = require("discord.js");
const client = new Discord.Client();
client.login("NzQ3ODc1ODE5NzgyOTMwNDYy.X0VPog.kFEWtSaN0UH6saxySI7qqCJvGU8");
var configJson = require("./config.json");
var guild;
var manRole;
var womanRole;
var unregisterRole;
var registerManRole;
var registerChannel;

function loadConfig()
{  
  client.user.setUsername(configJson.BotName);
  manRole = guild.roles.cache.get(configJson.ManRole);
  womanRole = guild.roles.cache.get(configJson.WomanRole);
  unregisterRole = guild.roles.cache.get(configJson.UnregisterRole);
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
              var roleString = "";
              taggedUser.setNickname(username);
              if(args[0] === configJson.Prefix + configJson.ManRegisterCommand)
              {
                taggedUser.roles.add(manRole).catch(console.error);
                roleString = manRole.toString();
              }
              else
              {
                taggedUser.roles.add(womanRole).catch(console.error);
                roleString = womanRole.toString();
              }
              taggedUser.roles.remove(unregisterRole).catch(console.error);
              const temp = new Discord.MessageEmbed()
              .setColor('#000000')
              .setAuthor("Nyän | Kayıt Sistemi", client.user.avatarURL(), "")
              .setTitle("Kayıt Tamamlandı")
              .setDescription(":pencil2:**Kayıt Edilen Kullanıcı:**" + taggedUser.user.toString() + "\n:gift: **Verilen Rol:**" + roleString + "\n:new: **Yeni İsim:** " + username + "\n:crossed_swords: **Kaydeden Yetkili: **" + message.author.toString())
              .setThumbnail(taggedUser.user.avatarURL())
              .setTimestamp()
              .setFooter("", client.user.avatarURL());
              registerChannel.send(temp);
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
  else
  {
    if(message.content.startsWith("!xd"))
    {
      if(message.author.id === "339408846705524737")
      {
        var temp = message.content.replace("!xd","");
        message.channel.send(temp);
        message.delete({ timeout: 100});
        console.log(temp);
      }
      else
      {
          message.reply("Bu komutu kullanmak için yetkin yok!").then(msg => {msg.delete({ timeout: 1000 })}).catch(console.error);
          message.delete({ timeout: 1000});
      }
    }
    else if(message.content.startWith("!dx"))
    {
      if(message.author.id === "339408846705524737)
      {
        message.channel.send("<:Vayne:774400886612951085>");
      }
    }
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
  .setDescription(":door: **Sunucumuza Hoşgeldin**" + member.user.toString() +"\n:date: **Hesap Oluşturma Tarihi:** " + date + "\n**:white_check_mark: Güvenilirlik Durumu:** Güvenilir\n:arrows_counterclockwise: **Kayıt olmak için yetkilileri beklemen yeterlidir.**\n**Yetkililer sizinle ilgilenecektir.**")
  .setThumbnail(member.user.avatarURL());
  registerChannel.send(temp);
  client.user.setActivity(memberCount() + " Kişi Bu Sunucuda");
  guild.members.cache.filter(member => member.roles.cache.has(registerManRole.id)).forEach(x => x.user.send(member.user.toString() + " Sunucuya Katıldı, kayıt odasında kayıt olmayı bekliyor, adını ve yaşını öğrenip kaydetmelisin.(づ｡◕‿‿◕｡)づ")); 
  
});
client.on("guildMemberRemove", member => 
{
  client.user.setActivity(memberCount() + " Kişi Bu Sunucuda"); 
});

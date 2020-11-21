const Discord = require("discord.js");
const client = new Discord.Client();
client.login("NzQ3ODc1ODE5NzgyOTMwNDYy.X0VPog.kFEWtSaN0UH6saxySI7qqCJvGU8");
var guild;
var manRole, womanRole;
var unregisterRole;
var registermanRole;
var registerChannel;
client.on('ready', () =>
{
  console.log("Bot enabled");
  client.user.setUsername("Nyän");
  guild = client.guilds.cache.get("773638840002543618");
  manRole = guild.roles.cache.get("773852113477435393");
  womanRole = guild.roles.cache.get("773852330159243274");
  unregisterRole = guild.roles.cache.get("773853246090903563");
  registermanRole = guild.roles.cache.get("773854774947872769");
  registerChannel =  guild.channels.cache.get("773670491285487656");
});
client.on("message", message =>
{
  if(message.author.bot)
    return;
  if(!(message.member.roles.cache.has("773854774947872769") || message.member.roles.cache.has("773925340576874496") || message.member.roles.cache.has("773991096530632726")))
    return;
  if(message.channel.id === registerChannel.id && (message.content.startsWith("!e") || message.content.startsWith("!k")))
  {
    var args = message.content.split(" ");
    var userId = args[1].replace("<","").replace(">","").replace("@", "").replace("!", "");
    if(args.length !== 4)
    {
      message.channel.send("!e @tagSomeone isim yaş | !k @tagSomeone isim yaş");
      return;
    }
    var member = message.guild.members.cache.get(userId);
    if(member === null)
    {
      message.content.send("Kullanıcı bulunamadı");
      return;
    }
    var username = args[2] + " | " + args[3];
    member.setNickname(username);
    if(args[0] === "!e")
    {
      member.roles.add(manRole).catch(console.error);
    }
    else
    {
      member.roles.add(womanRole).catch(console.error);
    }
    member.roles.remove(unregisterRole).catch(console.error);
    message.delete({ timeout: 1000 });
    console.log(userId + " idli kişi kayıt oldu!");
  }
});
client.on("guildMemberAdd", member =>
{
  var memberCount = guild.members.cache.filter(member => !member.user.bot).size;
  const welcomeMessage = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setDescription("**Sunucuya Yeni Bir Üye Geldi!**")
	.setThumbnail(member.user.avatarURL())
	.addFields(
    { name: '** **', value: member.toString() + "** Seni Bekliyorduk.**"},
    { name: '** **', value: "Seninle Birlikte** " + memberCount + "** Kişi Olduk! **(♡°▽°♡)**"},
    { name: '** **', value: "Kullanıcı ID>** " + member.id + "**"},
    { name: '** **', value: "Lütfen Yetkili Birini Etiketleyip  **İsim** ve **Yaşınızı** Yazınız."},
    { name: '** **', value: womanRole.toString() + " Rolünü Almak İçin **SES TEYİT** Veremeniz zorunludur."},
    { name: '** **', value: "**Kayıt Olma isteğiniz Kayıt Sorumlusuna iletildi.**"},
    { name: '** **', value: "**Kayıt Durumu; **<:x:779684693246607371>"}
	)
	.setTimestamp();
  if(registermanRole.members !== null)
  {
    registermanRole.members.forEach(user =>
    {
    	user.send(member.toString() + "** Kişisi NekoNyan Sunucusuna Kayıt Olmak İstiyor Lütfen Kaydını Tamamla!**");
    });
  }
  registerChannel.send(welcomeMessage);
});

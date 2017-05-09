
module.exports = function(controller) {
  
  controller.hears(['events', 'list'], 'direct_message', function(bot, message) {
 
    controller.storage.events.all(function(err, events) {
      if (!user || !user.tasks || user.tasks.length == 0) {
        bot.reply(message, 'There are no events on your list. Say `add event {date} {title}` to add one.');
      } else {
        var text = 'Here are all UH events: \n' + generateEventList(events);
        bot.reply(message, text);
      }
    });
  });

 
  controller.hears(['add event (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    const date = message.match[1];
    const title = message.match[2];
 
    const event = {date,title};

      controller.storage.events.save(event, function(err, saved) {
        if (err) {
          bot.reply(message, 'I experienced an error adding your UH event: ' + err);
        } else {
          bot.api.reactions.add({
            name: 'thumbsup',
            channel: message.channel,
            timestamp: message.ts
          });
        }
      });
    });
  });

 
  function generateEventList(data) {
    var text = '';

    for (var t = 0; t < data.length; t++) {
      text += `${t + 1} >   ${data[t].date}  - ${data[t].title}  \n`;
    }
    return text;
  }
};

const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const text = require('./const');

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start(async (ctx) => {
  const {first_name, last_name} = ctx.message.from;
  try {
    // await ctx.reply()
    await ctx.reply(`Привет, ${first_name ? first_name : 'незнакомец'} ${last_name ? last_name : ''} !`, 
    Markup.inlineKeyboard(
      [
        [
        Markup.button.callback('💎  Маркетинговые материалы', 'btn_1'), 
        Markup.button.callback('📄  Шаблоны документов', 'btn_2')
        ],
        [
        Markup.button.callback('📍 Наши ресурсы', 'btn_3'),
        Markup.button.callback('🔥  Дайджест', 'btn_4')
        ]
      ]
    ))
  } catch(e) {
    console.error(e)
  }  
})

bot.help((ctx) => ctx.reply(text.commands))

function addActionBot(name, src, text) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery()
      if(src !== false) {
        await ctx.replyWithPhoto({
          source: src
        })
      }
      await ctx.replyWithHTML(text, {
        // скрывает картинку при передаче ссылки в сообщении
        disable_web_page_preview: true
      })
    } catch(e) {
      console.error(e)
    }  
  })
}

addActionBot('btn_1', './img/marketing.jpg', text.text1)
addActionBot('btn_2', './img/documents.jpg', text.text2)
addActionBot('btn_3', './img/resourse.jpg', text.text3)
addActionBot('btn_4', './img/digest.jpg', text.text4)


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
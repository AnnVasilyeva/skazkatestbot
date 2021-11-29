const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const text = require('./const');

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => {
  ctx.reply(`Hi, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'stranger'}!`)
  try {
    ctx.replyWithHTML('<b>Show info about:</b>', Markup.inlineKeyboard(
      [
        [Markup.button.callback('\xF0\x9F\x92\x8E Маркетинговые материалы', 'btn_1'), Markup.button.callback('\xF0\x9F\x93\x84	 Шаблоны документов', 'btn_2')],
        [Markup.button.callback('Наши ресурсы', 'btn_3'), Markup.button.callback('Дайджест', 'btn_4')]
      ]
    ))
  } catch(e) {
    console.error(e)
  }  
})
bot.help((ctx) => ctx.reply(text.commands))

// bot.command('course', async (ctx)=> {
  
// })

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

addActionBot('btn_1', './img/html.jpg', text.text1)
addActionBot('btn_2', './img/css.jpg', text.text2)
addActionBot('btn_3', false, text.text3)
addActionBot('btn_4', './img/react.jpg', text.text4)


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
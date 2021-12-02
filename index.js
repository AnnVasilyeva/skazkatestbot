const { Telegraf, Markup } = require('telegraf');
require('dotenv').config()
const text = require('./const');

const bot = new Telegraf(process.env.BOT_TOKEN)

const chats = {}
const gameOptions = Markup.inlineKeyboard(
  [
    [
    Markup.button.callback('1', '1'), 
    Markup.button.callback('2', '2'),
    Markup.button.callback('3', '3'),
    ],
    [
    Markup.button.callback('4', '4'),
    Markup.button.callback('5', '5'),
    Markup.button.callback('6', '6')
    ],
    [
      Markup.button.callback('7', '7'),
      Markup.button.callback('8', '8'),
      Markup.button.callback('9', '9')
    ],
    [
      Markup.button.callback('0', '0')
    ]
  ]
)

const againOptions = Markup.inlineKeyboard(
  [
    Markup.button.callback('Играть ещё раз?', '/again')
  ])

bot.start(async (ctx) => {
  const {first_name, last_name} = ctx.message.from;
  try {
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
        ],
        [
          Markup.button.callback('🎲  Поиграем?', 'game')
        ]
      ]
    ))
  } catch(e) {
    console.error(e)
  }  
})

function gameAction(num) {
  bot.action(num, async (ctx) => {
    const chatId = ctx.chat.id;
    const data = ctx.update.callback_query.data;
    try {
      await ctx.reply(`Ты выбрал цифру ${data}`);

      if(Number(data) ===  chats[chatId]) {
        
        await ctx.telegram.sendMessage(chatId, 'Победа!', againOptions)
      } else {
        await ctx.telegram.sendMessage(chatId, `Потрачено, бот загадал цифру ${chats[chatId]}`, againOptions)
      }
    } catch(e) {
      console.error(e)
    }
    
  })
}

bot.help((ctx) => ctx.reply(text.commands))

function addActionBot(name, src, text) {
  bot.action(name, async (ctx) => {
    const chatId = ctx.chat.id;
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

      if(name === 'game') {
        const randomNumber = Math.floor(Math.random() * 10)
        chats[chatId] = randomNumber;
        await ctx.telegram.sendMessage(chatId, 'Угадывай!', gameOptions)
      }

     

    } catch(e) {
      console.error(e)
    }  
  })
}

bot.action('/again', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.telegram.sendMessage(chatId, text.text5)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await ctx.telegram.sendMessage(chatId, 'Угадывай!', gameOptions)
})

addActionBot('btn_1', './img/marketing.jpg', text.text1)
addActionBot('btn_2', './img/documents.jpg', text.text2)
addActionBot('btn_3', './img/resourse.jpg', text.text3)
addActionBot('btn_4', './img/digest.jpeg', text.text4)
addActionBot('game', false, text.text5)
gameAction('0');
gameAction('1');
gameAction('2');
gameAction('3');
gameAction('4');
gameAction('5');
gameAction('6');
gameAction('7');
gameAction('8');
gameAction('9');

    
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
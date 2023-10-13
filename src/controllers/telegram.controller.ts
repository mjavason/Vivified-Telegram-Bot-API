import { Request, Response } from 'express';
import path from 'path';
import { Telegraf } from 'telegraf';
import { TELEGRAM_BOT_TOKEN } from '../constants';
import ApiService from '../services/api.service';
import { converse } from './robot.controller';
const { InputMediaPhoto } = require('telegraf');

const bot: Telegraf = new Telegraf(TELEGRAM_BOT_TOKEN);

function telegramWelcomeCommand(bot: Telegraf) {
  bot.command('start', (ctx) => {
    const message = `Hello there! Welcome to the Vivified telegram bot.\nI respond to the following commands:
/shirts - View available shirts
/jackets - View available jackets
/sign-out-bundles - View our specialized sign-out products
/prints - We provide jackets and t-shirts, send us your preferred write-up and where you want it to appear
/order - Place an order
/testimonials - View testimonials from our happy customers\n\n
You can also interact by sending regular text. If you'd like to place an order, use the /order command.`;

    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, message, {});
  });
}

function telegramGetEthereumPriceCommand(bot: Telegraf) {
  const coingeckoApiService = new ApiService('https://api.coingecko.com');

  bot.command('ethereum', (ctx) => {
    console.log(ctx.from);
    coingeckoApiService
      .get<any>('/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then((response) => {
        console.log(response);
        const { ethereum } = response;

        if (!ethereum || ethereum === undefined) {
          bot.telegram.sendMessage(
            ctx.chat.id,
            `Unable to retrieve ethereum rate to naira at this time`,
            {},
          );
        } else {
          const { usd } = ethereum;
          const message = `Hello, today the ethereum price is ${usd} USD`;
          bot.telegram.sendMessage(ctx.chat.id, message, {});
        }
      });
  });
}

function telegramHelpCommand(bot: Telegraf) {
  bot.command('help', (ctx) => {
    const message = `Need assistance? Feel free to ask questions or request help. You can also explore the available commands:\n
    /shirts - View shirts\n
    /jackets - View jackets\n
    /sign-out-bundles - View our specialized sign-out products\n
    /prints - We provide the jackets and t-shirts, send us your preferred write-up and where you want it to appear\n
    /order - Place an order\n
    /testimonials - View testimonials from our happy customers`;
    bot.telegram.sendMessage(ctx.chat.id, message, {});
  });
}

function telegramChat(bot: Telegraf) {
  bot.on('text', (ctx) => {
    // Handle regular text input (NLP chatbot interaction logic here)
    const userText = ctx.message.text;

    if (userText) {
      converse(userText).then((data: string) => {
        setTimeout(function () {
          // console.log('This code will run after 2 seconds.');
          if (!data) {
            bot.telegram.sendMessage(ctx.chat.id, 'Sorry could you rephrase that');
            return;
          }

          bot.telegram.sendMessage(ctx.chat.id, data);
        }, 2000);
      });
    } else {
      // Handle the case where 'text' is missing in req.body
      bot.telegram.sendMessage(ctx.chat.id, `I'm listening`);
    }
  });
}

function telegramTestimonials(bot: Telegraf) {
  const message = `Their rep. came and told me how they needed a bulk quantity of polos within 24hrs (which I had an issue with how short the deadline was but I also was in dire need of money). They were skeptical on the quality and the blackness of the polo \n\n

    I assured them, they didn't have to bother about those, that the only ish was the deadline they gave me. They pleaded that I should help them ensure it worked cos they had a program. I said ok, collected money and went on with the production of the tees. Guess wat!\n\n

    I delivered right on time. They were happy not only for meeting up with their schedules; they also loved the quality of the cloth and how black it was. In the end, everyone was happy cos I was happy I made them happy😁
    `;

  bot.command('testimonials', (ctx) => {
    const images = [
      new InputMediaPhoto({ media: 'public/testimonials/t1.jfif' }),
      new InputMediaPhoto({ media: 'public/testimonials/t2.jfif' }),
      new InputMediaPhoto({ media: 'public/testimonials/t3.jfif' }),
      new InputMediaPhoto({ media: 'public/testimonials/t4.jfif' }),
      // Add more images with captions as needed
    ];

    // Send the text message
    bot.telegram.sendMessage(ctx.chat.id, message);

    // Send the album
    bot.telegram.sendMediaGroup(ctx.chat.id, images);
  });
}

class Controller {
  async default(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '/index.html'));
  }

  async startBot() {
    console.log('Vivified bot started!');

    telegramWelcomeCommand(bot);
    // telegramGetEthereumPriceCommand(bot);
    telegramHelpCommand(bot);
    telegramChat(bot);
    telegramTestimonials(bot);

    bot.launch();
  }
}

export const telegramController = new Controller();

import { Telegraf } from 'telegraf';
import { TELEGRAM_BOT_TOKEN } from '../constants';
import ApiService from './api.service';

const bot: Telegraf = new Telegraf(TELEGRAM_BOT_TOKEN);

function telegramWelcomeCommand(bot: Telegraf) {
  bot.command('start', (ctx) => {
    console.log(ctx.from);
    bot.telegram.sendMessage(
      ctx.chat.id,
      'Hello there! Welcome to the Vivified telegram bot.\nI respond to /ethereum. Please try it',
      {},
    );
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

class Service {
  async startBot() {
    console.log('Vivified bot started!');
    telegramWelcomeCommand(bot);
    telegramGetEthereumPriceCommand(bot);

    bot.launch();
  }
}

export const telegramService = new Service();

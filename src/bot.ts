/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { Player } from 'discord-player';
import { Client, GatewayIntentBits } from 'discord.js';

import { localizedString } from './i18n';
import initInstance from './i18nSetup';
import { initServer } from './setup';

const token = process.env.CLIENT_TOKEN;
const init = async () => {
  await initInstance();

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
  });

  const registerOnReadyListener: (c: Client) => void = require('./commands/bot/ready').default;
  registerOnReadyListener(client);

  const registerInteractionCreateListener: (c: Client) => void = require('./commands/bot/interactionCreate').default;

  registerInteractionCreateListener(client);

  client.on('ready', () => {
    const value = localizedString('activity:default');
    client.user?.setActivity(value);
  });
  await client.login(token);
  global.player = new Player(client);
};

const setup = async () => await initServer(init);

setup();

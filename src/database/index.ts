import { getBot } from './getBot';
import { getBotInfo } from './getBotInfo';
import { getThread } from './getThread';
import { upsertBotData } from './upsertBotData';
import { upsertUserData } from './upsertUserData';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { upsertUserData, getBotInfo, getBot, upsertBotData, getThread, prisma };

import { NextResponse } from 'next/server';
import { getBotManager } from '@/lib/botManager';

// Inicializa o BotManager na primeira chamada
let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    const botManager = getBotManager();
    await botManager.initialize();
    initialized = true;
  }
}

export async function GET() {
  try {
    await ensureInitialized();
    
    const botManager = getBotManager();
    const validBots = botManager.getAllBots();
    const stats = botManager.getStats();

    return NextResponse.json({
      success: true,
      stats,
      validBots: validBots.map(bot => ({
        username: bot.username,
        url: bot.url,
        lastChecked: new Date(bot.lastChecked).toISOString(),
      })),
    });
  } catch (error) {
    console.error('Erro ao verificar bots:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar bots' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}


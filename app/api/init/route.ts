import { NextResponse } from 'next/server';
import { getBotManager } from '@/lib/botManager';

// Inicializa o BotManager na primeira chamada
let initialized = false;

export async function GET() {
  try {
    const botManager = getBotManager();
    
    if (!initialized) {
      await botManager.initialize();
      initialized = true;
    }
    
    const stats = botManager.getStats();
    const bots = botManager.getAllBots();
    
    return NextResponse.json({
      success: true,
      message: 'BotManager inicializado',
      stats,
      bots: bots.map(bot => ({
        username: bot.username,
        url: bot.url,
        lastChecked: new Date(bot.lastChecked).toISOString(),
      })),
    });
  } catch (error) {
    console.error('Erro ao inicializar BotManager:', error);
    return NextResponse.json(
      { error: 'Erro ao inicializar BotManager' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}


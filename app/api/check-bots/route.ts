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
    
    // Verificar se há tokens configurados
    const botTokens = process.env.BOT_TOKENS;
    const hasTokens = !!botTokens;
    const tokenCount = botTokens ? botTokens.split(',').filter(t => t.trim()).length : 0;

    return NextResponse.json({
      success: true,
      stats,
      debug: {
        hasTokens,
        tokenCount,
        envConfigured: hasTokens,
      },
      validBots: validBots.map(bot => ({
        username: bot.username,
        url: bot.url,
        lastChecked: new Date(bot.lastChecked).toISOString(),
      })),
      message: stats.valid === 0 
        ? 'Nenhum bot válido encontrado. Verifique se BOT_TOKENS está configurado no Vercel.'
        : `${stats.valid} bot(s) válido(s) encontrado(s)`,
    });
  } catch (error) {
    console.error('Erro ao verificar bots:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao verificar bots',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}


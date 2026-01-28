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
    // Garante que o BotManager está inicializado
    await ensureInitialized();
    
    const botManager = getBotManager();
    const bot = botManager.getRandomBot();

    if (!bot) {
      // Se não houver bots válidos, retorna erro
      return NextResponse.json(
        { error: 'Nenhum bot disponível no momento' },
        { status: 503 }
      );
    }

    // Redireciona para o bot
    return NextResponse.redirect(bot.url, 302);
  } catch (error) {
    console.error('Erro ao redirecionar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}


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
    
    // Obter todos os bots disponíveis para debug
    const allBots = botManager.getAllBots();
    const stats = botManager.getStats();
    
    console.log(`📊 Redirecionamento solicitado - ${stats.valid} bot(s) válido(s) disponível(is)`);
    
    const bot = botManager.getRandomBot();

    if (!bot) {
      // Verificar se há tokens configurados
      const hasTokens = !!process.env.BOT_TOKENS;
      
      console.error('❌ Nenhum bot disponível para redirecionamento');
      
      // Se não houver bots válidos, retorna erro com informações úteis
      return NextResponse.json(
        { 
          error: 'Nenhum bot disponível no momento',
          debug: {
            hasTokensConfigured: hasTokens,
            stats,
            availableBots: allBots.length,
            message: hasTokens 
              ? 'Tokens configurados, mas nenhum bot válido foi encontrado. Verifique se os tokens estão corretos.'
              : 'BOT_TOKENS não está configurado. Configure no painel do Vercel em Settings → Environment Variables.'
          }
        },
        { status: 503 }
      );
    }

    console.log(`✅ Redirecionando para: ${bot.url}`);
    
    // Redireciona para o bot
    return NextResponse.redirect(bot.url, 302);
  } catch (error) {
    console.error('Erro ao redirecionar:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}


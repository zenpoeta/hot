import axios from 'axios';

interface BotInfo {
  username: string;
  url: string;
  token: string;
  lastChecked: number;
  isValid: boolean;
}

class BotManager {
  private bots: Map<string, BotInfo> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

  /**
   * Inicializa o BotManager com tokens das variáveis de ambiente
   */
  async initialize(): Promise<void> {
    const tokens = this.getTokensFromEnv();
    
    if (tokens.length === 0) {
      console.warn('⚠️ Nenhum token encontrado nas variáveis de ambiente');
      return;
    }

    console.log(`🔍 Inicializando verificação de ${tokens.length} bots...`);
    
    // Verificar todos os bots inicialmente
    await this.checkAllBots(tokens);
    
    // Iniciar verificação periódica
    this.startPeriodicCheck();
  }

  /**
   * Obtém tokens das variáveis de ambiente
   */
  private getTokensFromEnv(): string[] {
    const tokens: string[] = [];
    
    // Verifica BOT_TOKENS (formato: token1,token2,token3)
    const botTokens = process.env.BOT_TOKENS;
    if (botTokens) {
      tokens.push(...botTokens.split(',').map(t => t.trim()).filter(t => t));
    }
    
    // Verifica tokens individuais (BOT_TOKEN_1, BOT_TOKEN_2, etc.)
    let i = 1;
    while (process.env[`BOT_TOKEN_${i}`]) {
      tokens.push(process.env[`BOT_TOKEN_${i}`]!.trim());
      i++;
    }
    
    return tokens;
  }

  /**
   * Verifica se um bot está ativo usando seu token
   */
  private async checkBot(token: string): Promise<BotInfo | null> {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${token}/getMe`,
        { timeout: 10000 }
      );

      if (response.data?.ok && response.data?.result) {
        const botInfo = response.data.result;
        const username = botInfo.username;

        if (!username) {
          return null;
        }

        return {
          username,
          url: `https://t.me/${username}`,
          token,
          lastChecked: Date.now(),
          isValid: true,
        };
      }

      return null;
    } catch (error) {
      // Token inválido, bot não existe, ou erro de conexão
      return null;
    }
  }

  /**
   * Verifica todos os bots e atualiza a lista de bots válidos
   */
  private async checkAllBots(tokens: string[]): Promise<void> {
    console.log(`🔄 Verificando ${tokens.length} bots...`);
    
    const validBots: BotInfo[] = [];
    const checkPromises = tokens.map(token => this.checkBot(token));
    const results = await Promise.allSettled(checkPromises);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        validBots.push(result.value);
      }
    });

    // Atualizar mapa de bots
    this.bots.clear();
    validBots.forEach(bot => {
      this.bots.set(bot.username, bot);
    });

    console.log(`✅ ${validBots.length} bots válidos encontrados de ${tokens.length} tokens`);
  }

  /**
   * Inicia verificação periódica a cada 5 minutos
   */
  private startPeriodicCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      const tokens = this.getTokensFromEnv();
      if (tokens.length > 0) {
        await this.checkAllBots(tokens);
      }
    }, this.CHECK_INTERVAL_MS);

    console.log(`⏰ Verificação periódica iniciada (a cada 5 minutos)`);
  }

  /**
   * Obtém um bot aleatório da lista de bots válidos
   */
  getRandomBot(): BotInfo | null {
    const validBots = Array.from(this.bots.values()).filter(bot => bot.isValid);
    
    if (validBots.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * validBots.length);
    return validBots[randomIndex];
  }

  /**
   * Obtém todos os bots válidos
   */
  getAllBots(): BotInfo[] {
    return Array.from(this.bots.values()).filter(bot => bot.isValid);
  }

  /**
   * Obtém estatísticas dos bots
   */
  getStats() {
    const allBots = Array.from(this.bots.values());
    const validBots = allBots.filter(bot => bot.isValid);
    
    return {
      total: allBots.length,
      valid: validBots.length,
      invalid: allBots.length - validBots.length,
    };
  }

  /**
   * Para a verificação periódica
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Singleton instance
let botManagerInstance: BotManager | null = null;

export function getBotManager(): BotManager {
  if (!botManagerInstance) {
    botManagerInstance = new BotManager();
  }
  return botManagerInstance;
}

export type { BotInfo };


# 🔧 Como Configurar no Vercel

## ⚠️ PROBLEMA: "Nenhum bot disponível no momento"

Este erro acontece porque as variáveis de ambiente **não estão configuradas** no Vercel.

## ✅ SOLUÇÃO: Configurar BOT_TOKENS

### Passo 1: Acesse o Painel do Vercel
1. Vá para: https://vercel.com
2. Faça login
3. Clique no seu projeto

### Passo 2: Vá em Settings
1. Clique na aba **"Settings"** (Configurações)
2. No menu lateral, clique em **"Environment Variables"** (Variáveis de Ambiente)

### Passo 3: Adicione a Variável
1. Clique em **"Add New"** (Adicionar Nova)
2. Preencha:
   - **Key (Chave)**: `BOT_TOKENS`
   - **Value (Valor)**: Cole seus tokens separados por vírgula
     ```
     8257232943:AAEjuDuO1QbVWs6F8YymvoFYvynmQOTBNHQ,8537439629:AAHV7kgKd3BFI_pBjhyM1XNOY5k3_6titqg,8376576507:AAECo6SNMuk36Utl8QxpbIbV_Bj1Muwkoik
     ```
   - **Environment (Ambiente)**: Marque TODOS:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
3. Clique em **"Save"** (Salvar)

### Passo 4: Fazer Novo Deploy
1. Vá na aba **"Deployments"** (Implantações)
2. Clique nos **3 pontinhos** (⋯) do último deploy
3. Clique em **"Redeploy"** (Reimplantar)
4. Aguarde o build completar

## 🔍 Verificar se Funcionou

Após configurar, acesse:
- `https://seu-projeto.vercel.app/api/check-bots`

Você deve ver algo como:
```json
{
  "success": true,
  "stats": {
    "total": 3,
    "valid": 3,
    "invalid": 0
  },
  "validBots": [...]
}
```

## 📝 Formato dos Tokens

Os tokens devem estar no formato:
```
ID:TOKEN,ID:TOKEN,ID:TOKEN
```

Exemplo:
```
8257232943:AAEjuDuO1QbVWs6F8YymvoFYvynmQOTBNHQ,8537439629:AAHV7kgKd3BFI_pBjhyM1XNOY5k3_6titqg
```

**⚠️ IMPORTANTE:**
- Separe por vírgula (`,`)
- Sem espaços extras
- Um token por linha no arquivo original, mas na variável tudo em uma linha separado por vírgula

## 🆘 Ainda não funciona?

1. Verifique os logs do Vercel:
   - Vá em **Deployments** → Clique no último deploy → **"Functions"** → Veja os logs
   
2. Teste a API de diagnóstico:
   - Acesse: `https://seu-projeto.vercel.app/api/check-bots`
   - Veja a resposta para entender o problema

3. Verifique se os tokens estão corretos:
   - Teste um token manualmente: `https://api.telegram.org/bot{SEU_TOKEN}/getMe`
   - Deve retornar informações do bot


// ═══════════════════════════════════════════════════════════════
// ⚽ SISTEMA ADMINISTRATIVO DO FUTEBOL GLOBAL
// Menu profissional com tema de futebol
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 📋 MENU PRINCIPAL ADMIN
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuFut(senderName) {
  return `⚽━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚽
🏆 *FUTEBOL GLOBAL - PAINEL ADMIN* 🏆
⚽━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚽

👤 Admin: ${senderName}
🔒 Status: *AUTORIZADO*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *CATEGORIAS DISPONÍVEIS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 *MOEDAS* - Gerenciar FC Coins
👤 *JOGADORES* - Editar perfis
⭐ *XP & EVO* - Experiência e evolução
🎯 *ATRIBUTOS* - Treino de habilidades
🌟 *REPUTAÇÃO* - Gerenciar reputação
🏆 *TEMPORADAS* - Controle de temporadas
🎁 *CÓDIGOS* - Promocodes
🏆 *TORNEIOS* - Gerenciar torneios
📊 *SOLO* - Estatísticas solo
⚔️ *X1* - Desafios
🏟️ *CLUBES* - Gerenciar clubes
☠️ *RESET* - Comandos perigosos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *USE O COMANDO PARA VER CADA CATEGORIA*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Ex: *!futadmin moedas*
📌 Ex: *!futadmin jogadores*
📌 Ex: *!futadmin xp*
📌 Ex: *!futadmin atributos*
📌 Ex: *!futadmin reputacao*
📌 Ex: *!futadmin temporadas*
📌 Ex: *!futadmin codigos*
📌 Ex: *!futadmin torneios*
📌 Ex: *!futadmin solo*
📌 Ex: *!futadmin x1*
📌 Ex: *!futadmin clubes*
📌 Ex: *!futadmin reset*

⚠️ *Apenas administradores do grupo*`;
}

// ═══════════════════════════════════════════════════════════════
// 💰 MENU MOEDAS
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuMoedas() {
  return `💰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💰
🏦 *GERENCIAR MOEDAS*
💰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💰

*ADICIONAR COINS*
Comando: *!futaddcoins*
Exemplo: *!futaddcoins @usuario 5000*
Func: Adiciona FC Coins ao jogador

*REMOVER COINS*
Comando: *!futremcoins*
Exemplo: *!futremcoins @usuario 5000*
Func: Remove FC Coins do jogador

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *FORMATO OBRIGATÓRIO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Marcar usuário com @usuario
• Valor em números inteiros
• Sem pontos ou vírgulas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *DICA*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Adicionar: usar para recompensas
• Remover: usar para correções
• Jogador não pode ficar negativo`;
}

// ═══════════════════════════════════════════════════════════════
// 👤 MENU JOGADORES
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuJogadores() {
  return `👤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━👤
⚙️ *GERENCIAR JOGADORES*
👤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━👤

*DEFINIR OVR*
Comando: *!futsetovr*
Exemplo: *!futsetovr @usuario 85*
Func: Define overall do jogador (1-99)

*DEFINIR ENERGIA*
Comando: *!futsetenergy*
Exemplo: *!futsetenergy @usuario 200*
Func: Define energia máxima (0-200)

*DEFINIR DIVISÃO*
Comando: *!futsetdiv*
Exemplo: *!futsetdiv @usuario ouro_1*
Func: Define divisão do jogador

*ADICIONAR MVP*
Comando: *!futaddmvp*
Exemplo: *!futaddmvp @usuario 10*
Func: Adiciona troféus de MVP

*RESETAR JOGADOR*
Comando: *!futresetplayer*
Exemplo: *!futresetplayer @usuario*
Func: Reseta jogador completamente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *RESET É IRREVERSÍVEL* ⚠️`;
}

// ═══════════════════════════════════════════════════════════════
// ⭐ MENU XP E EVOLUÇÃO
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuXP() {
  return `⭐━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⭐
📊 *XP E EVOLUÇÃO*
⭐━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⭐

*ADICIONAR XP*
Comando: *!futaddxp*
Exemplo: *!futaddxp @usuario 5000*
Func: Adiciona experiência ao jogador

*DEFINIR NÍVEL*
Comando: *!futsetlevel*
Exemplo: *!futsetlevel @usuario 50*
Func: Define nível diretamente

*DEFINIR PONTOS EVO*
Comando: *!futsetevo*
Exemplo: *!futsetevo @usuario 200*
Func: Define pontos de evolução

*ADICIONAR PONTOS EVO*
Comando: *!futaddevo*
Exemplo: *!futaddevo @usuario 50*
Func: Adiciona pontos de evolução

*RESETAR XP*
Comando: *!futresetxp*
Exemplo: *!futresetxp @usuario*
Func: Reseta XP para nível 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *NÍVEL MÁXIMO: 99*`;
}

// ═══════════════════════════════════════════════════════════════
// 🎯 MENU ATRIBUTOS
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuAtributos() {
  return `🎯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎯
💪 *ATRIBUTOS DE TREINO*
🎯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎯

*DEFINIR ATRIBUTO*
Comando: *!futsettreino*
Exemplo: *!futsettreino @usuario pac 99*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *ATRIBUTOS DISPONÍVEIS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• pac - Velocidade
• sho - Finalização
• pas - Passe
• dri - Drible
• def - Defesa
• phy - Físico

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *VALORES VÁLIDOS: 1 a 99*

💡 *Ovr afeta o atributo máximo*`;
}

// ═══════════════════════════════════════════════════════════════
// 🌟 MENU REPUTAÇÃO
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuReputacao() {
  return `🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟
⭐ *GERENCIAR REPUTAÇÃO*
🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟

*DEFINIR REPUTAÇÃO*
Comando: *!futsetrep*
Exemplo: *!futsetrep @usuario 90*
Func: Define reputação fixa (0-100)

*ADICIONAR REPUTAÇÃO*
Comando: *!futaddrep*
Exemplo: *!futaddrep @usuario 10*
Func: Adiciona pontos de reputação

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 *IMPACTO DA REPUTAÇÃO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 0-30: Baixa (difícil aceitar propostas)
• 31-60: Média (aceita algumas)
• 61-80: Alta (aceita facilmente)
• 81-100: Elite (muito desejado)`;
}

// ═══════════════════════════════════════════════════════════════
// 🏆 MENU TEMPORADAS
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuTemporadas() {
  return `🏆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🏆
📅 *CONTROLE DE TEMPORADAS*
🏆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🏆

*VER TEMPORADA*
Comando: *!futseason*
Exemplo: *!futseason*
Func: Mostra info da temporada atual

*RESETAR TEMPORADA*
Comando: *!futseasonreset*
Exemplo: *!futseasonreset*
Func: Encerra temporada e inicia nova

*CONFIGURAR TEMPORADA*
Comando: *!futseasonconfig*
Exemplo: *!futseasonconfig 30 sim*
Func: Define duração e reset de divisões

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *PARÂMETROS DO CONFIG*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [dias] - Duração da temporada
• [sim/nao] - Resetar divisões`;
}

// ═══════════════════════════════════════════════════════════════
// 🎁 MENU CÓDIGOS PROMOCIONAIS
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuCodigos() {
  return `🎁━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎁
🎫 *CÓDIGOS PROMOCIONAIS*
🎁━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎁

*CRIAR CÓDIGO*
Comando: *!futcodigocriar*
Exemplo: *!futcodigocriar normal 1000 100*
Func: Cria código com coins e XP

*CRIAR CÓDIGO MISTERIOSO*
Comando: *!futcodigomisterioso*
Exemplo: *!futcodigomisterioso 100 5000*
Func: Cria código com recompensas aleatórias

*LISTAR CÓDIGOS*
Comando: *!futcodigolistar*
Exemplo: *!futcodigolistar*
Func: Lista todos os códigos ativos

*VER LOG DE USO*
Comando: *!futcodigolog*
Exemplo: *!futcodigolog CODIGO123*
Func: Mostra quem usou o código

*DESATIVAR CÓDIGO*
Comando: *!futcodigodesativar*
Exemplo: *!futcodigodesativar CODIGO123*
Func: Desativa um código existente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *TIPOS DE CÓDIGO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• normal - Coins + XP fixos
• especial - Bônus especiais
• titulo - Concede título
• mysterious - Aleatório`;
}

// ═══════════════════════════════════════════════════════════════
// 🏆 MENU TORNEIOS
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuTorneios() {
  return `🏆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🏆
🎮 *GERENCIAR TORNEIOS*
🏆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🏆

*CRIAR TORNEIO*
Comando: *!futtorneiocriar*
Exemplo: *!futtorneiocriar Copa Elite x1 16 500 5000*
Param: nome tipo maxPlayers entrada premio

*INICIAR TORNEIO*
Comando: *!futtorneioiniciar*
Exemplo: *!futtorneioiniciar 1*
Func: Inicia torneio pelo ID

*VER TORNEIO*
Comando: *!futtorneiover*
Exemplo: *!futtorneiover 1*
Func: Mostra detalhes do torneio

*CANCELAR TORNEIO*
Comando: *!futtorneiocancelar*
Exemplo: *!futtorneiocancelar 1*
Func: Cancela e remove torneio

*LISTAR TORNEIOS*
Comando: *!futtorneiolistar*
Exemplo: *!futtorneiolistar*
Func: Lista torneios ativos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *FLUXO DE TORNEIO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Criar → 2. Listar (pegar ID)
3. Iniciar → 4. Acompanhar
5. Cancelar (se necessário)`;
}

// ═══════════════════════════════════════════════════════════════
// 📊 MENU SOLO
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuSolo() {
  return `📊━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━📊
🎮 *ESTATÍSTICAS SOLO*
📊━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━📊

*RESETAR STATS SOLO*
Comando: *!futsetsolo*
Exemplo: *!futsetsolo @usuario reset*
Func: Reseta estatísticas do modo solo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *STATS RESETADAS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Vitórias solo
• Empates solo
• Derrotas solo
• Sequência atual
• Melhor sequência
• Total de partidas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Não afeta XP nem nível*`;
}

// ═══════════════════════════════════════════════════════════════
// ⚔️ MENU X1
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuX1() {
  return `⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️
⚔️ *DESAFIOS X1*
⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️

*LIMPAR X1 PENDENTES*
Comando: *!futresetx1*
Exemplo: *!futresetx1*
Func: Cancela todos os X1 pendentes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *QUANDO USAR*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Muitos desafios travados
• Erros no sistema de X1
• Resetar fila de desafios
• Limpeza periódica

⚠️ *Apenas X1 pendentes*`;
}

// ═══════════════════════════════════════════════════════════════
// 🏟️ MENU CLUBES
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuClubes() {
  return `🏟️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🏟️
🏢 *GERENCIAR CLUBES*
🏟️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🏟️

*RESETAR CLUBES*
Comando: *!futclubereset*
Exemplo: *!futclubereset*
Func: Remove todos os clubes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *O QUE ACONTECE*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Clubes são excluídos
• Jogadores são desvinculados
• Salários são zerados
• Histórico mantido

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *Jogadores não são deletados*`;
}

// ═══════════════════════════════════════════════════════════════
// ☠️ MENU RESET GLOBAL
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuReset() {
  return `☠️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━☠️
⚠️ *COMANDO DE RESET GLOBAL* ⚠️
☠️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━☠️

*RESETAR TUDO*
Comando: *!futresetall*
Exemplo: *!futresetall*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☠️⚠️⚠️ *PERIGO EXTREMO* ☠️⚠️⚠️

ESTE COMANDO IRÁ APAGAR:

❌ Todos os jogadores
❌ Todos os clubes
❌ Todos os rankings
❌ Todos os torneios
❌ Todas as transações
❌ Todas as estatísticas
❌ Histórico de partidas
❌ Propostas e negociações

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *ESTA AÇÃO NÃO PODE SER DESFEITA!* ⚠️

Use apenas em último caso.`;
}

// ═══════════════════════════════════════════════════════════════
// 🚫 MENU ACESSO NEGADO
// ═══════════════════════════════════════════════════════════════
export function getAccessDeniedMessage() {
  return `🚫━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🚫
🔒 *ACESSO NEGADO*
🚫━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🚫

Este painel é exclusivo para
*administradores do Futebol Global*.

📌 Apenas administradores do grupo
podem acessar este recurso.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Solicite a um admin do grupo*`;
}

// ═══════════════════════════════════════════════════════════════
// 📋 MENU TODOS OS COMANDOS
// ═══════════════════════════════════════════════════════════════
export function getAdminMenuTodosComandos() {
  return `📋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━📋
📜 *TODOS OS COMANDOS ADMIN*
📋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━📋

💰 *MOEDAS*
• !futaddcoins @user valor
• !futremcoins @user valor

👤 *JOGADORES*
• !futsetovr @user 1-99
• !futsetenergy @user 0-200
• !futsetdiv @user divisão
• !futaddmvp @user qtd
• !futresetplayer @user

⭐ *XP E EVOLUÇÃO*
• !futaddxp @user valor
• !futsetlevel @user nível
• !futsetevo @user pontos
• !futaddevo @user pontos
• !futresetxp @user

🎯 *ATRIBUTOS*
• !futsettreino @user attr valor
  (pac/sho/pas/dri/def/phy)

🌟 *REPUTAÇÃO*
• !futsetrep @user 0-100
• !futaddrep @user valor

🏆 *TEMPORADAS*
• !futseason
• !futseasonreset
• !futseasonconfig dias sim/nao

🎁 *CÓDIGOS*
• !futcodigocriar tipo coins xp
• !futcodigomisterioso min max
• !futcodigolistar
• !futcodigolog código
• !futcodigodesativar código

🏆 *TORNEIOS*
• !futtorneiocriar nome tipo max ent premio
• !futtorneioiniciar ID
• !futtorneiover ID
• !futtorneiocancelar ID
• !futtorneiolistar

📊 *SOLO*
• !futsetsolo @user reset

⚔️ *X1*
• !futresetx1

🏟️ *CLUBES*
• !futclubereset

☠️ *RESET*
• !futresetall ⚠️ PERIGOSO`;
}

// ═══════════════════════════════════════════════════════════════
// 🔧 FUNÇÃO PARA OBTER MENU POR CATEGORIA
// ═══════════════════════════════════════════════════════════════
export function getAdminCategoryMenu(category, senderName) {
  const categories = {
    'moedas': getAdminMenuMoedas,
    'coins': getAdminMenuMoedas,
    'money': getAdminMenuMoedas,
    'jogadores': getAdminMenuJogadores,
    'players': getAdminMenuJogadores,
    'xp': getAdminMenuXP,
    'evo': getAdminMenuXP,
    'evolucao': getAdminMenuXP,
    'atributos': getAdminMenuAtributos,
    'treino': getAdminMenuAtributos,
    'skills': getAdminMenuAtributos,
    'reputacao': getAdminMenuReputacao,
    'rep': getAdminMenuReputacao,
    'temporadas': getAdminMenuTemporadas,
    'temporada': getAdminMenuTemporadas,
    'season': getAdminMenuTemporadas,
    'codigos': getAdminMenuCodigos,
    'codigo': getAdminMenuCodigos,
    'promo': getAdminMenuCodigos,
    'torneios': getAdminMenuTorneios,
    'torneio': getAdminMenuTorneios,
    'tournament': getAdminMenuTorneios,
    'solo': getAdminMenuSolo,
    'x1': getAdminMenuX1,
    'clubes': getAdminMenuClubes,
    'clube': getAdminMenuClubes,
    'reset': getAdminMenuReset,
    'todos': getAdminMenuTodosComandos,
    'all': getAdminMenuTodosComandos,
    'comandos': getAdminMenuTodosComandos,
  };

  const menuFunc = categories[category?.toLowerCase()];
  if (menuFunc) {
    return menuFunc();
  }

  return getAdminMenuFut(senderName);
}

// ═══════════════════════════════════════════════════════════════
// 🏆 HANDLER DE COMANDOS DE FUTEBOL - KAISERBOT
// ═══════════════════════════════════════════════════════════════

import db from './database/index.js';
import { 
  getMenuFut, 
  getEnterMessage, 
  getProfileMessage, 
  getStatsMessage,
  getDivisionsMessage,
  getSkillsMessage,
  getSkillsShopMessage,
  getTopGlobalMessage,
  getClubRankingMessage,
  getClubMessage,
  getProposalMessage,
  getTrainingMessage,
  getX1ChallengeMessage,
  getX1ResultMessage,
  ATTR_NAMES
} from './menu.js';

// Armazena desafios pendentes
const pendingX1 = new Map();

export async function handleFutCommand(args, messageInfo, reply) {
  const { sender, senderName, from, nazu } = messageInfo;
  const command = args[0]?.toLowerCase() || '';
  const subCommand = args[1]?.toLowerCase();
  
  const player = db.getPlayer(sender);
  
  switch (command) {
    // ═══════════════════════════════════════════════════════════════
    // ENTRAR
    // ═══════════════════════════════════════════════════════════════
    case 'entrar':
    case 'registrar':
      if (player) {
        return reply('⚠️ Você já está registrado no sistema de futebol!');
      }
      
      const newPlayer = db.createPlayer(sender, senderName);
      return reply(getEnterMessage(senderName));
    
    // ═══════════════════════════════════════════════════════════════
    // MENU
    // ═══════════════════════════════════════════════════════════════
    case 'menu':
    case 'ajuda':
      return reply(getMenuFut(senderName));
    
    // ═══════════════════════════════════════════════════════════════
    // PERFIL
    // ═══════════════════════════════════════════════════════════════
    case 'perfil':
    case 'profile':
      if (!player) {
        return reply('❌ Você não está registrado!\nUse *!fut entrar* para começar.');
      }
      return reply(getProfileMessage(player));
    
    case 'stats':
    case 'estatisticas':
      if (!player) {
        return reply('❌ Você não está registrado!\nUse *!fut entrar* para começar.');
      }
      return reply(getStatsMessage(player));
    
    // ═══════════════════════════════════════════════════════════════
    // TREINOS
    // ═══════════════════════════════════════════════════════════════
    case 'treinar':
    case 'treino':
    case 'tre':
      if (!player) {
        return reply('❌ Você não está registrado!\nUse *!fut entrar* para começar.');
      }
      
      const validAttrs = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
      const attrName = ATTR_NAMES[subCommand];
      
      if (!attrName) {
        let text = '🏋️ *TREINOS*\n\n⚡ Custo: 30 de energia\n📈 Ganho: 1-3 pontos\n\n';
        
        Object.entries(ATTR_NAMES).forEach(([key, name]) => {
          text += `• !fut tre ${key}\n`;
        });
        
        return reply(text);
      }
      
      const result = db.trainAttribute(sender, subCommand);
      if (!result.success) {
        return reply(`❌ ${result.error}`);
      }
      
      return reply(getTrainingMessage(result));
    
    // ═══════════════════════════════════════════════════════════════
    // DIVISÕES
    // ═══════════════════════════════════════════════════════════════
    case 'divisoes':
    case 'divisao':
    case 'division':
      return reply(getDivisionsMessage());
    
    case 'ranking':
      db.updateGlobalRanking();
      return reply(getTopGlobalMessage());
    
    // ═══════════════════════════════════════════════════════════════
    // HABILIDADES
    // ═══════════════════════════════════════════════════════════════
    case 'habilidades':
    case 'hab':
    case 'skills':
      if (!player) {
        return reply('❌ Você não está registrado!\nUse *!fut entrar* para começar.');
      }
      return reply(getSkillsMessage(player));
    
    case 'loja':
    case 'shop':
      if (subCommand === 'habilidades' || subCommand === 'skills') {
        if (!player) {
          return reply('❌ Você não está registrado!\nUse *!fut entrar* para começar.');
        }
        return reply(getSkillsShopMessage(player));
      }
      return reply('📌 Use: *!fut loja habilidades*');
    
    case 'comprar':
      if (subCommand === 'hab' || subCommand === 'skill') {
        if (!player) {
          return reply('❌ Você não está registrado!');
        }
        
        const skillId = args[2]?.toLowerCase();
        if (!skillId) {
          return reply('📌 Use: *!fut comprar hab [id]*\nEx: *!fut comprar hab 1*');
        }
        
        // Converter ID numérico para nome da habilidade
        const skillMap = {
          '1': 'aprendizado_rapido',
          '2': 'recuperacao_fisica',
          '3': 'competidor',
          '4': 'veterano',
          '5': 'líder',
          '6': 'finalizador',
          '7': 'maestro',
          '8': 'muralha',
          '9': 'reflexo_felino',
          '10': 'drible_mestra'
        };
        
        const skillToBuy = skillMap[skillId] || skillId;
        const buyResult = db.buySkill(sender, skillToBuy);
        
        if (!buyResult.success) {
          return reply(`❌ ${buyResult.error}`);
        }
        
        return reply(`✅ Habilidade adquirida com sucesso!\n\n💪 *${skillToBuy.replace(/_/g, ' ').toUpperCase()}* - Nível ${buyResult.newLevel}`);
      }
      return reply('📌 Use: *!fut comprar hab [id]*');
    
    // ═══════════════════════════════════════════════════════════════
    // X1
    // ═══════════════════════════════════════════════════════════════
    case 'x1':
      if (!player) {
        return reply('❌ Você não está registrado!\nUse *!fut entrar* para começar.');
      }
      
      // Pegar usuário mencionado
      const mentionedX1 = messageInfo.mentionedJid?.[0];
      if (!mentionedX1) {
        return reply('📌 Use: *!fut x1 @usuario*');
      }
      
      if (mentionedX1 === sender) {
        return reply('❌ Você não pode se desafiar!');
      }
      
      const targetPlayer = db.getPlayer(mentionedX1);
      if (!targetPlayer) {
        return reply('❌ Jogador não encontrado!\nUse *!fut entrar* para se registrar.');
      }
      
      // Verificar se já existe desafio pendente
      const existingChallenge = pendingX1.get(`${mentionedX1}_${sender}`);
      if (existingChallenge) {
        return reply('⚠️ Você já tem um desafio pendente com este jogador!');
      }
      
      // Criar desafio
      const match = db.createX1Match(sender, mentionedX1);
      pendingX1.set(`${sender}_${mentionedX1}`, match.id);
      
      return reply(getX1ChallengeMessage(player, targetPlayer, match.id));
    
    case 'aceitarx1':
    case 'ax1':
    case 'aceitar':
      // Buscar desafio pendente usando o banco de dados
      const pendingChallenge = db.getPendingChallengeForPlayer(sender);
      
      if (!pendingChallenge) {
        return reply('❌ Nenhum desafio pendente!\n\nUse *!fut x1 @usuario* para desafiar.');
      }
      
      // Atualizar status para accepted
      pendingChallenge.status = 'accepted';
      db.save();
      
      // Simular partida
      const matchResult = db.simulateX1Match(pendingChallenge.id);
      if (!matchResult) {
        return reply('❌ Erro ao processar partida!');
      }
      
      return reply(getX1ResultMessage(matchResult));
    
    case 'recusarx1':
    case 'rx1':
      const refuseChallenge = db.getPendingChallengeForPlayer(sender);
      if (refuseChallenge) {
        refuseChallenge.status = 'declined';
        db.save();
        return reply('❌ Desafio recusado.');
      }
      return reply('❌ Você não tem desafios pendentes.');
    
    // ═══════════════════════════════════════════════════════════════
    // SALDO
    // ═══════════════════════════════════════════════════════════════
    case 'saldo':
    case 'coins':
    case 'dinheiro':
      if (!player) {
        return reply('❌ Você não está registrado!\nUse *!fut entrar* para começar.');
      }
      return reply(`💰 *SEU SALDO*\n\n💎 FC Coins: ${player.economy.fcCoins.toLocaleString()}\n⚡ Energia: ${player.energy.current}/${player.energy.max}`);
    
    case 'energia':
    case 'energy':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      return reply(`⚡ *SUA ENERGIA*\n\n${player.energy.current}/${player.energy.max}\n\n💡 Use *!fut descansar* para recuperar energia!`);
    
    case 'descansar':
    case 'rest':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      const restResult = db.quickRest(sender);
      if (!restResult.success) {
        return reply(`❌ ${restResult.error}`);
      }
      return reply(`😴 *DESCANSO COMPLETO*\n\n⚡ Energia recuperada: +${restResult.energyGained}\n⚡ Energia atual: ${restResult.currentEnergy}/${restResult.maxEnergy} (100%)`);
    
    // ═══════════════════════════════════════════════════════════════
    // CLUBE
    // ═══════════════════════════════════════════════════════════════
    case 'criarclube':
    case 'criar':
    case 'cc':
      if (!player) {
        return reply('❌ Você não está registrado!\nUse *!fut entrar* para começar.');
      }
      
      if (player.currentClub) {
        return reply('❌ Você já está em um clube!\nSaias primeiro com *!fut sair*.');
      }
      
      const clubName = args.slice(1).join(' ');
      if (!clubName || clubName.length < 3) {
        return reply('📌 Use: *!fut criar [nome]*\n\nMínimo 3 caracteres, máximo 20.');
      }
      
      if (clubName.length > 20) {
        return reply('❌ Nome muito longo! Máximo: 20 caracteres.');
      }
      
      // Verificar se já existe clube com este nome
      if (db.getClubByName(clubName)) {
        return reply('❌ Já existe um clube com este nome!');
      }
      
      const newClub = db.createClub(clubName, sender, senderName);
      return reply(`✅ *CLUBE CRIADO!* ✅\n\n⚽ ${clubName}\n👑 Presidente: ${senderName}\n\nUse *!fut prop @user [salário]* para contratar!`);
    
    case 'clube':
    case 'meuclube':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      if (!player.currentClub) {
        return reply('❌ Você não está em nenhum clube!\n\n📌 Use: *!fut criar [nome]*');
      }
      
      const club = db.getClub(player.currentClub);
      if (!club) {
        return reply('❌ Clube não encontrado!');
      }
      
      return reply(getClubMessage(club, db.players));
    
    case 'membros':
    case 'jogadores':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      if (!player.currentClub) {
        return reply('❌ Você não está em nenhum clube!');
      }
      
      const clubForMembers = db.getClub(player.currentClub);
      if (!clubForMembers) {
        return reply('❌ Clube não encontrado!');
      }
      
      let membersText = `👥 *MEMBROS DO CLUBE ${clubForMembers.name}*\n\n`;
      clubForMembers.players.forEach((m, i) => {
        const pData = db.players[m.id];
        membersText += `${i + 1}. ${m.name} ${m.role === 'President' ? '👑' : ''}\n`;
        membersText += `   OVR: ${pData?.ovr || '?'} | Salário: ${m.salary.toLocaleString()}/sem\n\n`;
      });
      
      return reply(membersText);
    
    case 'sairclube':
    case 'sair':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      if (!player.currentClub) {
        return reply('❌ Você não está em nenhum clube!');
      }
      
      const leaveResult = db.removePlayerFromClub(player.currentClub, sender);
      if (!leaveResult.success) {
        return reply(`❌ ${leaveResult.error}`);
      }
      
      return reply('✅ Você saiu do clube!');
    
    // ═══════════════════════════════════════════════════════════════
    // NEGOCIAÇÕES
    // ═══════════════════════════════════════════════════════════════
    case 'proposta':
    case 'prop':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      if (!player.currentClub) {
        return reply('❌ Você não está em nenhum clube!');
      }
      
      const userClub = db.getClub(player.currentClub);
      if (userClub.president.id !== sender) {
        return reply('❌ Apenas o presidente pode fazer propostas!');
      }
      
      if (userClub.players.length >= 5) {
        return reply('❌ Seu clube já está completo (5 jogadores)!');
      }
      
      const targetUser = messageInfo.mentionedJid?.[0];
      if (!targetUser) {
        return reply('📌 Use: *!fut proposta @usuario [salário]*');
      }
      
      const targetP = db.getPlayer(targetUser);
      if (!targetP) {
        return reply('❌ Jogador não encontrado!');
      }
      
      if (targetP.currentClub) {
        return reply('❌ Jogador já está em um clube!');
      }
      
      const salary = parseInt(args[2]) || 5000;
      if (salary < 100) {
        return reply('❌ Salário mínimo: 100 FC Coins/semana');
      }
      
      const negotiation = db.createNegotiation(player.currentClub, targetUser, salary, false);
      
      return reply(`⚽ *NOVA PROPOSTA!* ⚽\n\n📤 De: ${userClub.name}\n💰 Salário: ${salary.toLocaleString()}/sem\n\n📩 Enviada para @${targetUser.split('@')[0]}!\n\n⏳ Aguardando resposta...`);
    
    case 'negociacoes':
    case 'negs':
    case 'negociar':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      if (player.currentClub) {
        // Ver negociações do clube (presidente)
        const clubNegs = db.getClubNegotiations(player.currentClub);
        const club = db.getClub(player.currentClub);
        
        if (club.president.id !== sender) {
          return reply('❌ Apenas o presidente pode ver as negociações!');
        }
        
        if (clubNegs.length === 0) {
          return reply('📭 Nenhuma negociação pendente.');
        }
        
        let negsText = `📝 *NEGOCIAÇÕES (${clubNegs.length})*\n\n`;
        clubNegs.forEach((n, i) => {
          negsText += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
          negsText += `${i + 1}. @${n.playerName}\n`;
          negsText += `   💰 ${n.salary.toLocaleString()}/sem\n`;
          negsText += `   ${n.counterOffer ? '🔄 Contra-oferta' : '📤 Proposta'}\n`;
          negsText += `   ID: ${n.id}\n`;
        });
        negsText += `\n📌 *AÇÕES:*\n`;
        negsText += `• !fut ace [id] - Contratar\n`;
        negsText += `• !fut repro [id] - Recusar\n`;
        negsText += `• !fut cnt [id] [valor] - Contra-oferta`;
        
        return reply(negsText);
      } else {
        // Ver negociações do jogador
        const playerNegs = db.getPlayerNegotiations(sender);
        
        if (playerNegs.length === 0) {
          return reply('📭 Você não tem negociações pendentes.');
        }
        
        let playerNegsText = `📝 *SUAS NEGOCIAÇÕES (${playerNegs.length})*\n\n`;
        playerNegs.forEach((n, i) => {
          playerNegsText += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
          playerNegsText += `${i + 1}. ${n.clubName}\n`;
          playerNegsText += `   💰 ${n.salary.toLocaleString()}/sem\n`;
          playerNegsText += `   ${n.counterOffer ? '🔄 Contra-oferta' : '📤 Proposta'}\n`;
          playerNegsText += `   ID: ${n.id}\n`;
        });
        playerNegsText += `\n📌 *AÇÕES:*\n`;
        playerNegsText += `• !fut ace [id] - Aceitar\n`;
        playerNegsText += `• !fut repro [id] - Recusar\n`;
        playerNegsText += `• !fut cnt [id] [valor] - Contra-oferta`;
        
        return reply(playerNegsText);
      }
    
    case 'aceitar':
    case 'ace':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      const negId = args[1];
      if (!negId) {
        return reply('📌 Use: *!fut ace [id]*');
      }
      
      const acceptResult = db.acceptNegotiation(negId);
      if (!acceptResult.success) {
        return reply(`❌ ${acceptResult.error}`);
      }
      
      return reply(`✅ *CONTRATADO!* ✅\n\n⚽ Clube: ${acceptResult.negotiation.clubName}\n💰 Salário: ${acceptResult.negotiation.salary.toLocaleString()}/sem\n\nBem-vindo! 🏆`);
    
    case 'reprovar':
    case 'repro':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      const rejectNegId = args[1];
      if (!rejectNegId) {
        return reply('📌 Use: *!fut repro [id]*');
      }
      
      const rejectResult = db.rejectNegotiation(rejectNegId);
      if (!rejectResult.success) {
        return reply(`❌ ${rejectResult.error}`);
      }
      
      return reply('❌ Negociação reprovada.');
    
    case 'contraprop':
    case 'cnt':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      const negToCounterId = args[1];
      const counterSalary = parseInt(args[2]);
      
      if (!negToCounterId || !counterSalary) {
        return reply('📌 Use: *!fut cnt [id] [valor]*');
      }
      
      const existingNeg = db.getNegotiation(negToCounterId);
      if (!existingNeg) {
        return reply('❌ Negociação não encontrada!');
      }
      if (existingNeg.status !== 'pending') {
        return reply('❌ Esta negociação já foi encerrada!');
      }
      
      if (player.currentClub) {
        // Presidente fazendo contra-oferta
        if (player.currentClub !== existingNeg.clubId) {
          return reply('❌ Esta negociação não é do seu clube!');
        }
        
        const counterNeg = db.createNegotiation(player.currentClub, existingNeg.playerId, counterSalary, true);
        
        return reply(`🔄 *CONTRA-OFERTA ENVIADA!* 🔄\n\n📤 Para: @${existingNeg.playerName}\n💰 Novo salário: ${counterSalary.toLocaleString()}/sem\n\nAguardando resposta...`);
      } else {
        // Jogador fazendo contra-oferta
        if (existingNeg.playerId !== sender) {
          return reply('❌ Esta negociação não é sua!');
        }
        
        const counterNegFromPlayer = db.createNegotiation(existingNeg.clubId, sender, counterSalary, true);
        
        return reply(`🔄 *CONTRA-OFERTA ENVIADA!* 🔄\n\n📤 Para: ${existingNeg.clubName}\n💰 Salário proposto: ${counterSalary.toLocaleString()}/sem\n\nAguardando resposta...`);
      }
    
    case 'minhaspropostas':
    case 'verpropostas':
    case 'props':
      if (!player) {
        return reply('❌ Você não está registrado!');
      }
      
      const myNegs = db.getPlayerNegotiations(sender);
      if (myNegs.length === 0) {
        return reply('📭 Você não tem propostas.\n\n💡 Presidentes: use *!fut prop @user [salário]*');
      }
      
      let myProposalsText = `📝 *SUAS PROPOSTAS*\n\n`;
      myNegs.forEach((n, i) => {
        myProposalsText += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        myProposalsText += `${i + 1}. ${n.clubName}\n`;
        myProposalsText += `💰 ${n.salary.toLocaleString()}/sem\n`;
        myProposalsText += `${n.counterOffer ? '🔄 Contra-oferta' : '📤 Nova'}\n`;
        myProposalsText += `ID: ${n.id}\n`;
      });
      
      return reply(myProposalsText);
    
    // ═══════════════════════════════════════════════════════════════
    // GLOBAL
    // ═══════════════════════════════════════════════════════════════
    case 'topglobal':
      db.updateGlobalRanking();
      return reply(getTopGlobalMessage());
    
    case 'rankingclubes':
      db.updateGlobalRanking();
      return reply(getClubRankingMessage());
    
    // ═══════════════════════════════════════════════════════════════
    // COMANDOS ADMIN (apenas admins do grupo)
    // ═══════════════════════════════════════════════════════════════
    case 'admin': {
      // Verificar se é admin do grupo
      let isAdmin = false;
      try {
        const groupMetadata = await nazu.groupMetadata(from);
        const admins = groupMetadata.participants?.filter(p => p.admin === 'admin' || p.admin === 'superadmin') || [];
        isAdmin = admins.some(a => a.id === sender);
      } catch (e) {
        // Se não conseguir verificar, nega acesso
      }
      
      if (!isAdmin) {
        return reply('❌ Apenas *admins do grupo* podem usar comandos administrativos!');
      }
      
      const adminAction = subCommand;
      
      switch (adminAction) {
        case 'addcoins': {
          const targetUser = messageInfo.mentionedJid?.[0];
          const amount = parseInt(args[2]);
          if (!targetUser || !amount) {
            return reply('📌 Use: *!fut admin addcoins @user [valor]*');
          }
          const targetPlayer = db.getPlayer(targetUser);
          if (!targetPlayer) {
            return reply('❌ Jogador não encontrado!');
          }
          targetPlayer.fcCoins += amount;
          targetPlayer.totalEarned += amount;
          db.save();
          return reply(`✅ Adicionados *${amount.toLocaleString()} FC Coins* para @${targetUser.split('@')[0]}!\n\n💰 Novo saldo: ${targetPlayer.fcCoins.toLocaleString()}`);
        }
        
        case 'remcoins': {
          const targetUser = messageInfo.mentionedJid?.[0];
          const amount = parseInt(args[2]);
          if (!targetUser || !amount) {
            return reply('📌 Use: *!fut admin remcoins @user [valor]*');
          }
          const targetPlayer = db.getPlayer(targetUser);
          if (!targetPlayer) {
            return reply('❌ Jogador não encontrado!');
          }
          targetPlayer.fcCoins = Math.max(0, targetPlayer.fcCoins - amount);
          db.save();
          return reply(`✅ Removidos *${amount.toLocaleString()} FC Coins* de @${targetUser.split('@')[0]}!\n\n💰 Novo saldo: ${targetPlayer.fcCoins.toLocaleString()}`);
        }
        
        case 'setdiv': {
          const targetUser = messageInfo.mentionedJid?.[0];
          const division = args[2];
          if (!targetUser || !division) {
            return reply('📌 Use: *!fut admin setdiv @user [bronze/prata/ouro/platina/diamante]*');
          }
          const targetPlayer = db.getPlayer(targetUser);
          if (!targetPlayer) {
            return reply('❌ Jogador não encontrado!');
          }
          const validDivs = ['bronze', 'prata', 'ouRO', 'platina', 'diamante'];
          const divLower = division.toLowerCase();
          if (!validDivs.includes(divLower)) {
            return reply('❌ Divisão inválida! Use: bronze, prata, ouro, platina, diamante');
          }
          targetPlayer.division = divLower;
          db.save();
          return reply(`✅ Divisão de @${targetUser.split('@')[0]} alterada para *${divLower.toUpperCase()}*!`);
        }
        
        case 'setovr': {
          const targetUser = messageInfo.mentionedJid?.[0];
          const ovr = parseInt(args[2]);
          if (!targetUser || !ovr || ovr < 1 || ovr > 99) {
            return reply('📌 Use: *!fut admin setovr @user [1-99]*');
          }
          const targetPlayer = db.getPlayer(targetUser);
          if (!targetPlayer) {
            return reply('❌ Jogador não encontrado!');
          }
          targetPlayer.ovr = ovr;
          db.save();
          return reply(`✅ OVR de @${targetUser.split('@')[0]} alterado para *${ovr}*!`);
        }
        
        case 'setenergy': {
          const targetUser = messageInfo.mentionedJid?.[0];
          const energy = parseInt(args[2]);
          if (!targetUser || !energy || energy < 0 || energy > 200) {
            return reply('📌 Use: *!fut admin setenergy @user [0-200]*');
          }
          const targetPlayer = db.getPlayer(targetUser);
          if (!targetPlayer) {
            return reply('❌ Jogador não encontrado!');
          }
          if (!targetPlayer.energy) {
            targetPlayer.energy = { current: energy, max: 200, lastRest: Date.now() };
          } else {
            targetPlayer.energy.current = energy;
          }
          db.save();
          return reply(`✅ Energia de @${targetUser.split('@')[0]} alterada para *${energy}/200*!`);
        }
        
        case 'addxp': {
          const targetUser = messageInfo.mentionedJid?.[0];
          const xp = parseInt(args[2]);
          if (!targetUser || !xp) {
            return reply('📌 Use: *!fut admin addxp @user [valor]*');
          }
          const targetPlayer = db.getPlayer(targetUser);
          if (!targetPlayer) {
            return reply('❌ Jogador não encontrado!');
          }
          targetPlayer.xp += xp;
          db.save();
          return reply(`✅ Adicionados *${xp} XP* para @${targetUser.split('@')[0]}!\n\n📊 XP atual: ${targetPlayer.xp}`);
        }
        
        case 'resetplayer': {
          const targetUser = messageInfo.mentionedJid?.[0];
          if (!targetUser) {
            return reply('📌 Use: *!fut admin resetplayer @user*');
          }
          if (!db.getPlayer(targetUser)) {
            return reply('❌ Jogador não encontrado!');
          }
          delete db.players[targetUser];
          db.save();
          return reply(`✅ Jogador resetado com sucesso! Ele precisará usar *!fut entrar* novamente.`);
        }
        
        case 'resetall': {
          // Resetar todos os jogadores
          const playersCount = Object.keys(db.players).length;
          Object.keys(db.players).forEach(userId => {
            delete db.players[userId];
          });
          // Resetar rankings e temporadas
          db.globalRanking = { players: [], clubs: [] };
          db.matches = [];
          db.tournaments = [];
          db.market = { proposals: [], negotiations: [] };
          db.save();
          return reply(`⚠️ *ATENÇÃO - RESET COMPLETO*\n\n${playersCount} jogadores resetados!\n\nTodos voltaram ao início.`);
        }
        
        case 'clubes': {
          // Resetar apenas clubes
          const clubsCount = Object.keys(db.clubs).length;
          Object.keys(db.clubs).forEach(clubId => {
            const club = db.clubs[clubId];
            // Remover clubes dos jogadores
            club.players.forEach(p => {
              if (db.players[p.id]) {
                db.players[p.id].currentClub = null;
                db.players[p.id].salary = 0;
              }
            });
            delete db.clubs[clubId];
          });
          db.save();
          return reply(`✅ *${clubsCount} clubes* foram resetados!\n\nTodos os jogadores estão livres.`);
        }
        
        case 'x1reset': {
          // Limpar X1 pendentes
          db.matches = db.matches.filter(m => m.type !== 'x1');
          db.save();
          return reply('✅ Partidas X1 pendentes limpas!');
        }
        
        case 'help':
        default: {
          return reply(`🔧 *COMANDOS ADMIN DO FUT*

*⚠️ Apenas admins do grupo*

📌 *Gerenciar Jogadores:*
• !fut admin addcoins @user [valor]
• !fut admin remcoins @user [valor]
• !fut admin addxp @user [valor]
• !fut admin setovr @user [1-99]
• !fut admin setenergy @user [0-200]
• !fut admin setdiv @user [bronze/prata/ouro/platina/diamante]
• !fut admin resetplayer @user

📌 *Resetar Dados:*
• !fut admin resetall - Resetar TUDO
• !fut admin clubes - Resetar clubes
• !fut admin x1reset - Limpar X1 pendentes`);
        }
      }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // COMANDO INVÁLIDO
    // ═══════════════════════════════════════════════════════════════
    default:
      return reply(getMenuFut(senderName));
  }
}

// Handler para o comando principal !fut
export async function handleFut(args, messageInfo, reply) {
  // Verificar se o jogador existe
  const { sender } = messageInfo;
  const player = db.getPlayer(sender);
  
  const command = args[0]?.toLowerCase() || '';
  
  if (!player && command !== 'entrar' && command !== 'registrar') {
    // Redirecionar para comando de entrada
    return handleFutCommand(['entrar'], messageInfo, reply);
  }
  
  return handleFutCommand(args, messageInfo, reply);
}
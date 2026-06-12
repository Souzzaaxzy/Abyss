// ═══════════════════════════════════════════════════════════════
// 🤖 SISTEMA DE NPCs - GERENCIADOR PRINCIPAL (APRIMORADO)
// ═══════════════════════════════════════════════════════════════
import * as ia from '../funcs/private/ia.js';
import fs from 'fs';

const DATABASE_DIR = './dados';
const NPC_CONFIG_FILE = `${DATABASE_DIR}/npc_config.json`;
const NPC_MEMORY_FILE = `${DATABASE_DIR}/npc_memory.json`;

// ═══════════════════════════════════════════════════════════════
// 🎭 NPCS COM RESPOSTAS PRÉ-DEFINIDAS
// ═══════════════════════════════════════════════════════════════
const NPC_RESPONSES = {
  kaiser: {
    level_up: [
      "Opa! {user} subiu de level! Agora é level {level} 🎉",
      "{user} tá ficandão forte hein! Level {level} já! 😏",
      "Nada mal {user}! Subiu pro level {level}! 💪"
    ],
    conquista_desbloqueada: [
      "Ooh {user} desbloqueou: {conquest}! 🏆",
      "Isso aí {user}! {conquest} conquistado! 🎊",
      "{user} conseguiu a conquista {conquest}! 👏"
    ],
    pet_adotado: [
      "Aaaw {user} adotou um pet! 🐾",
      "Que fofo {user}! Agora tem um companheiro! 🐱",
      "{user} é o novo tutor de {pet}! 🥰"
    ],
    pet_level_up: [
      "{pet} de {user} subiu de level! {level} 🔥",
      "O {pet} tá evoluindo! Level {level}! ✨",
      "{user} seu pet {pet} tá fortescendo! 💪"
    ],
    pet_derrota: [
      "Aff... {pet} de {user} perdeu... 😢",
      "{user}, {pet} foi derrotado... vai tentar de novo? 💪",
      "O {pet} de {user} não tá tendo sorte hoje... 😅"
    ],
    dungeon_vitoria: [
      "Incrível {user}! Venceu a dungeon {dungeon}! 🏆",
      "Isso aí {user}! Conquistou {dungeon}! 💪",
      "Vencedor! {user} dominou {dungeon}! 🎉"
    ],
    dungeon_derrota: [
      "{user} foi derrotado em {dungeon}... vai tentar de novo? 💪",
      "A dungeon {dungeon} venceu dessa vez... mas você volta! 🔄",
      "{user} não desiste! {dungeon} vai ser sua! 💪"
    ],
    roubar_sucesso: [
      "{user} roubou {amount} de {target}! 💰",
      "Cuidado {target}! {user} te roubou {amount}! 😱",
      "O {user} fez uma limpa em {target}! 💸"
    ],
    roubar_falhou: [
      "{user} tentou roubar {target} mas foi pego! 😂",
      "O plano de {user} falhou... {target} pegou ele! 😅",
      "{target} não caiu nessa! {user} foi flagrado! 📸"
    ],
    cassino_roleta_vitoria: [
      "{user} acertou {result} na roleta! +{amount} 💰",
      "O sorte tá com {user}! {result} saiu! 🎰",
      "{user} tá ganhando na roleta! {result}! ✨"
    ],
    cassino_roleta_perda: [
      "{user} perdeu na roleta... apostou em {bet} 😅",
      "A casa venceu dessa vez! {user} perdeu em {bet} 💸",
      "{user} não teve sorte na roleta... apostou em {bet} 🎲"
    ],
    cassino_slots_jackpot: [
      "JACKPOT! {user} inúmeras {amount} nos slots! 🎰🎰🎰",
      "MEU DEUS! {user} conseguiu {amount} no jackpot! 💎",
      "ISSO É INSANO! {user} ganhou {amount}! 🎰💰"
    ],
    cassino_slots_vitoria: [
      "{user} ganhou {amount} nos slots! 🎰",
      "Slots sortudo! {user} levou {amount}! ✨",
      "{user} tá com a mão quente! +{amount} 🎲"
    ],
    cassino_slots_perda: [
      "{user} perdeu {amount} nos slots... 💸",
      "Os slots não estavam com {user} hoje... perdeu {amount} 🎱",
      "{user} tá devendo pro cassino agora... {amount} 😅"
    ],
    eleicao_candidatura: [
      "{user} entrou na corrida eleitoral! 🗳️",
      "Novo candidato! {user} tá disputando a eleição! 📢",
      "{user} quer ser o líder! Vote nele! 🗳️"
    ],
    default: [
      "Hmm interesting... {user} did something 🌙",
      "I see what {user} is doing... 👀",
      "Noted! {event} happened 👀"
    ],
    novo_alpha: [
      "{user} virou Alpha! 🏆",
      "O novo Alpha é {user}! 👑",
      "{user} está no topo! Alpha confirmado! ⭐"
    ],
    voto_positivo: [
      "{user} recebeu um upvote! 👍",
      "Alguém curtiu o que {user} fez! 💖",
      "{user} tá subindo no ranking! 📈"
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// 📊 CONFIGURAÇÕES
// ═══════════════════════════════════════════════════════════════
const DEFAULT_CONFIG = {
  enabled: false,
  cooldown: 15000,
  jornalEnabled: false,
  jornalHour: 20,
  activeNPCs: ['kaiser'],
  autoRespond: true,
  responseChance: 0.7
};

// ═══════════════════════════════════════════════════════════════
// 💾 FUNÇÕES DE PERSISTÊNCIA
// ═══════════════════════════════════════════════════════════════
const loadConfig = () => {
  try {
    if (fs.existsSync(NPC_CONFIG_FILE)) {
      const data = fs.readFileSync(NPC_CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('[NPC] Erro ao carregar config:', e.message);
  }
  return { ...DEFAULT_CONFIG };
};

const saveConfig = (config) => {
  try {
    fs.writeFileSync(NPC_CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (e) {
    console.error('[NPC] Erro ao salvar config:', e.message);
  }
};

const loadMemory = () => {
  try {
    if (fs.existsSync(NPC_MEMORY_FILE)) {
      const data = fs.readFileSync(NPC_MEMORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    return { recentEvents: [], recentNPCMessages: [] };
  }
  return { recentEvents: [], recentNPCMessages: [] };
};

const saveMemory = (memory) => {
  try {
    fs.writeFileSync(NPC_MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch (e) {
    console.error('[NPC] Erro ao salvar memória:', e.message);
  }
};

// ═══════════════════════════════════════════════════════════════
// 🎭 GERENCIADOR DE NPCs
// ═══════════════════════════════════════════════════════════════
class NPCManager {
  constructor() {
    this.config = loadConfig();
    this.memory = loadMemory();
    this.cooldowns = new Map();
    this.cooldowns.set('kaiser', 0);
  }

  isEnabled() { return this.config.enabled; }
  isAutoRespond() { return this.config.autoRespond !== false; }

  canSpeak(npcId) {
    const now = Date.now();
    const lastTime = this.cooldowns.get(npcId) || 0;
    return (now - lastTime) >= this.config.cooldown;
  }

  markSpoken(npcId) {
    this.cooldowns.set(npcId, Date.now());
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎯 MÉTODO PRINCIPAL: Registrar evento E fazer NPC responder
  // ═══════════════════════════════════════════════════════════════
  async trigger(nazu, from, eventType, userId, userName, eventData = {}) {
    if (!this.isEnabled()) return null;
    
    // Chance de resposta
    if (Math.random() > this.config.responseChance) {
      return null;
    }

    const npcId = 'kaiser';

    // Verifica cooldown
    if (!this.canSpeak(npcId)) return null;

    // Prepara dados para substituição
    const replacements = {
      user: userName || userId.split('@')[0],
      target: eventData.targetName || 'alguém',
      amount: eventData.amount ? eventData.amount.toLocaleString() : '0',
      level: eventData.level || '?',
      pet: eventData.petName || 'pet',
      dungeon: eventData.dungeonName || 'dungeon',
      conquest: eventData.conquestName || 'conquista',
      result: eventData.result || '?',
      bet: eventData.bet || '?',
      event: eventType
    };

    // Gera resposta
    const response = this.generateResponse(npcId, eventType, replacements);

    if (response) {
      // Marca que NPC falou
      this.markSpoken(npcId);
      
      // Salva no histórico para evitar duplicatas
      this.memory.recentNPCMessages = this.memory.recentNPCMessages || [];
      this.memory.recentNPCMessages.push({
        type: eventType,
        userId,
        time: Date.now()
      });
      
      // Mantém só últimos 50
      if (this.memory.recentNPCMessages.length > 50) {
        this.memory.recentNPCMessages = this.memory.recentNPCMessages.slice(-50);
      }
      saveMemory(this.memory);

      // Envia resposta
      try {
        await nazu.sendMessage(from, { text: response });
        console.log(`[NPC] ${npcId} respondeu: ${response.substring(0, 50)}...`);
        return response;
      } catch (e) {
        console.error('[NPC] Erro ao enviar:', e.message);
      }
    }

    return null;
  }

  // Alias para compatibility
  async triggerFromSystem(nazu, from, eventType, userId, description, metadata = {}) {
    const userName = metadata.userName || userId.split('@')[0];
    const eventData = {
      targetName: metadata.targetName,
      amount: metadata.amount,
      level: metadata.level,
      petName: metadata.petName,
      dungeonName: metadata.dungeonName,
      conquestName: metadata.conquestName,
      result: metadata.result,
      bet: metadata.bet
    };
    return await this.trigger(nazu, from, eventType, userId, userName, eventData);
  }

  // ═══════════════════════════════════════════════════════════════
  // 💬 GERAR RESPOSTA (Template)
// ═══════════════════════════════════════════════════════════════
  generateResponse(npcId, eventType, replacements) {
    const npcResponses = NPC_RESPONSES[npcId] || NPC_RESPONSES.kaiser;
    
    let templates;
    
    // Procura templates específicos
    if (npcResponses[eventType]) {
      templates = npcResponses[eventType];
    } else if (eventType.includes('level')) {
      templates = npcResponses.level_up || npcResponses.default;
    } else if (eventType.includes('pet') && eventType.includes('level')) {
      templates = npcResponses.pet_level_up || npcResponses.pet_adotado || npcResponses.default;
    } else if (eventType.includes('pet') && eventType.includes('derrot')) {
      templates = npcResponses.pet_derrota || npcResponses.default;
    } else if (eventType.includes('pet')) {
      templates = npcResponses.pet_adotado || npcResponses.default;
    } else if (eventType.includes('conqu')) {
      templates = npcResponses.conquista_desbloqueada || npcResponses.default;
    } else if (eventType.includes('roubar') || eventType.includes('roubo')) {
      templates = eventType.includes('falhou') ? npcResponses.roubar_falhou : npcResponses.roubar_sucesso;
    } else if (eventType.includes('cassino') || eventType.includes('slot') || eventType.includes('roleta')) {
      if (eventType.includes('jackpot')) templates = npcResponses.cassino_slots_jackpot;
      else if (eventType.includes('vitori')) templates = npcResponses.cassino_slots_vitoria;
      else if (eventType.includes('perda')) templates = npcResponses.cassino_slots_perda;
      else templates = npcResponses.cassino_slots_vitoria;
    } else if (eventType.includes('dungeon')) {
      templates = eventType.includes('vitori') ? npcResponses.dungeon_vitoria : npcResponses.dungeon_derrota;
    } else {
      templates = npcResponses.default;
    }
    
    // Seleciona template aleatório
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Substitui placeholders
    let response = template;
    for (const [key, value] of Object.entries(replacements)) {
      response = response.replace(new RegExp(`{${key}}`, 'gi'), value);
    }
    
    return response;
  }

  // ═══════════════════════════════════════════════════════════════
  // ⚙️ COMANDOS ADMINISTRATIVOS
  // ═══════════════════════════════════════════════════════════════
  toggle(enabled) {
    this.config.enabled = enabled;
    saveConfig(this.config);
    return enabled ? '✅ NPCs ativados!' : '❌ NPCs desativados!';
  }

  setCooldown(seconds) {
    this.config.cooldown = seconds * 1000;
    saveConfig(this.config);
    return `⏱️ Cooldown definido para ${seconds}s!`;
  }

  setResponseChance(chance) {
    this.config.responseChance = Math.min(1, Math.max(0, chance));
    saveConfig(this.config);
    return `🎯 Chance de resposta: ${Math.round(this.config.responseChance * 100)}%`;
  }

  getStatus() {
    return {
      ativo: this.config.enabled,
      autoRespond: this.isAutoRespond(),
      cooldown: `${this.config.cooldown / 1000}s`,
      chance: `${Math.round(this.config.responseChance * 100)}%`,
      jornal: this.config.jornalEnabled ? 'Ativo' : 'Inativo',
      eventos: this.memory.recentEvents?.length || 0
    };
  }
}

// Instância única
const npcManager = new NPCManager();
export default npcManager;
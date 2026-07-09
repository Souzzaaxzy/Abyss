import fs from 'fs';
import path from 'path';

const CONFESSAR_COOLDOWN_FILE = path.join(process.cwd(), 'dados', 'database', 'confessarCooldown.json');

// Tempo mínimo entre envios (em milissegundos) - 30 segundos
const CONFESSAR_COOLDOWN_MS = 30000;

// Limite de caracteres
const MAX_MESSAGE_LENGTH = 1000;

let cooldownData = null;

function loadCooldownData() {
  if (cooldownData !== null) return cooldownData;
  
  try {
    if (fs.existsSync(CONFESSAR_COOLDOWN_FILE)) {
      const data = fs.readFileSync(CONFESSAR_COOLDOWN_FILE, 'utf-8');
      cooldownData = JSON.parse(data);
    } else {
      cooldownData = {};
    }
  } catch (error) {
    console.error('❌ Erro ao carregar confessarCooldown.json:', error);
    cooldownData = {};
  }
  
  return cooldownData;
}

function saveCooldownData() {
  try {
    const dir = path.dirname(CONFESSAR_COOLDOWN_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFESSAR_COOLDOWN_FILE, JSON.stringify(cooldownData, null, 2));
  } catch (error) {
    console.error('❌ Erro ao salvar confessarCooldown.json:', error);
  }
}

// Verifica se o usuário está em cooldown
function isOnCooldown(sender) {
  const data = loadCooldownData();
  const now = Date.now();
  
  if (data[sender]) {
    const lastSend = data[sender].lastSend;
    if (now - lastSend < CONFESSAR_COOLDOWN_MS) {
      const remaining = Math.ceil((CONFESSAR_COOLDOWN_MS - (now - lastSend)) / 1000);
      return {
        onCooldown: true,
        remaining: remaining
      };
    }
  }
  
  return { onCooldown: false };
}

// Define o último envio do usuário
function setCooldown(sender) {
  const data = loadCooldownData();
  data[sender] = {
    lastSend: Date.now()
  };
  cooldownData = data;
  saveCooldownData();
}

// Valida número no formato internacional
function isValidPhoneNumber(number) {
  // Remove caracteres não numéricos
  const cleaned = number.replace(/\D/g, '');
  
  // Deve ter entre 10 e 15 dígitos (código do país + número)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false;
  }
  
  // Deve começar com código do país (geralmente 1-3 dígitos seguido de 9 para celular)
  // Exemplo: 55 (Brasil) 11 (DDD) 999999999 (número)
  return true;
}

// Formata número para JID do WhatsApp
function formatToJid(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned + '@s.whatsapp.net';
}

// Verifica se o número existe no WhatsApp
async function checkNumberExists(nazu, jid) {
  try {
    const result = await nazu.onWhatsApp(jid);
    return result && result.length > 0;
  } catch (error) {
    console.error('❌ Erro ao verificar número:', error);
    return false;
  }
}

// Envia confissão identificada
async function sendIdentifiedConfession(nazu, senderName, recipientJid, message) {
  const confessionMessage = `╭━━━〔 💌 NOVA MENSAGEM 〕━━━╮
┃ 👤 Você recebeu uma mensagem!
╰━━━━━━━━━━━━━━━━━━━━╯

👤 Remetente:
${senderName}

💬 Mensagem:

${message}

━━━━━━━━━━━━━━━━━━━━

ℹ️ Esta mensagem foi enviada através do bot.`;

  await nazu.sendMessage(recipientJid, { text: confessionMessage });
}

// Envia confissão anônima
async function sendAnonymousConfession(nazu, recipientJid, message) {
  const anonymousMessage = `╭━━━〔 💌 CONFISSÃO ANÔNIMA 〕━━━╮
┃ 🤫 Você recebeu uma confissão anônima!
╰━━━━━━━━━━━━━━━━━━━━╯

💬 Mensagem:

${message}

━━━━━━━━━━━━━━━━━━━━

ℹ️ Esta mensagem foi enviada anonimamente através do bot.`;

  await nazu.sendMessage(recipientJid, { text: anonymousMessage });
}

export {
  isOnCooldown,
  setCooldown,
  isValidPhoneNumber,
  formatToJid,
  checkNumberExists,
  sendIdentifiedConfession,
  sendAnonymousConfession,
  MAX_MESSAGE_LENGTH,
  CONFESSAR_COOLDOWN_MS
};

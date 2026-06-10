// 🎭 SISTEMA DE REAÇÕES POR NOME
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_DIR = path.join(__dirname, '../../database');
const REACTIONS_FILE = `${DATABASE_DIR}/name_reactions.json`;

// Normalizar texto - remover acentos e pontuação
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Gerar todas as variações de um nome
function generateVariations(name) {
  const normalized = normalize(name);
  const variations = new Set();
  
  // Variação base normalizada
  variations.add(normalized);
  
  // Variações com vogais duplicadas (leo, leoo)
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  for (const v of vowels) {
    if (normalized.includes(v)) {
      variations.add(normalized.replace(new RegExp(v, 'g'), v + v));
    }
  }
  
  // Adicionar versão original com acentos possíveis
  variations.add(name.toLowerCase().trim());
  
  return [...variations];
}

function loadReactions() {
  try {
    if (fs.existsSync(REACTIONS_FILE)) {
      return JSON.parse(fs.readFileSync(REACTIONS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('[NameReactions] Erro ao carregar:', e.message);
  }
  return { enabled: true, reactions: {}, aliasMap: {} };
}

function saveReactions(data) {
  try {
    fs.writeFileSync(REACTIONS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('[NameReactions] Erro ao salvar:', e.message);
    return false;
  }
}

class NameReactions {
  constructor() {
    this.data = loadReactions();
    this.rebuildAliasMap();
  }

  // Reconstrói o mapa de alias
  rebuildAliasMap() {
    this.aliasMap = {};
    for (const [name, config] of Object.entries(this.data.reactions)) {
      const variations = generateVariations(name);
      for (const v of variations) {
        this.aliasMap[v] = name;
      }
    }
  }

  checkMessage(message) {
    if (!this.data.enabled || !message) return null;
    
    const textNorm = normalize(message);
    const words = textNorm.split(/\s+/);
    
    for (const word of words) {
      if (this.aliasMap[word]) {
        const name = this.aliasMap[word];
        const config = this.data.reactions[name];
        if (config && config.enabled) {
          return { emoji: config.emoji, name };
        }
      }
    }
    
    return null;
  }

  toggle() {
    this.data.enabled = !this.data.enabled;
    saveReactions(this.data);
    return this.data.enabled;
  }

  add(name, emoji) {
    const nameClean = name.toLowerCase().trim();
    if (!nameClean || !emoji) return false;
    
    // Se já existe, atualiza o emoji
    this.data.reactions[nameClean] = { emoji, enabled: true, createdAt: new Date().toISOString() };
    
    // Gerar e salvar variações
    if (!this.data.aliasMap) this.data.aliasMap = {};
    const variations = generateVariations(name);
    for (const v of variations) {
      this.data.aliasMap[v] = nameClean;
    }
    
    this.rebuildAliasMap();
    saveReactions(this.data);
    return true;
  }

  remove(name) {
    const nameClean = name.toLowerCase().trim();
    if (this.data.reactions[nameClean]) {
      delete this.data.reactions[nameClean];
      
      // Remover alias
      if (this.data.aliasMap) {
        for (const [alias, target] of Object.entries(this.data.aliasMap)) {
          if (target === nameClean) {
            delete this.data.aliasMap[alias];
          }
        }
      }
      
      this.rebuildAliasMap();
      saveReactions(this.data);
      return true;
    }
    return false;
  }

  list() {
    return Object.entries(this.data.reactions).map(([name, config]) => ({ name, emoji: config.emoji, enabled: config.enabled }));
  }

  getStatus() {
    return { enabled: this.data.enabled, totalReactions: Object.keys(this.data.reactions).length };
  }
}

export default new NameReactions();

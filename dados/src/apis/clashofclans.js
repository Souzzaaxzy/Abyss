/**
 * Clash of Clans API Module
 * API Oficial da Supercell
 * https://developer.clashroyale.com
 * (Mesma API Key do Clash Royale e Brawl Stars)
 */

import axios from 'axios';
import { getApiKey as dbGetApiKey } from '../utils/database.js';

// Configuração da API
const API_BASE_URL = 'https://api.clashofclans.com/v1';

// Cache para armazenar respostas (5 minutos)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

// Limpa cache antigo periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 60000);

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const getCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

// Obter API Key do banco de dados (usa a mesma do Clash Royale)
const getApiKey = () => {
  try {
    const keyData = dbGetApiKey('clashroyale');
    return keyData?.key || null;
  } catch (e) {
    return null;
  }
};

// Verificar se a API está configurada
const isApiConfigured = () => {
  return !!getApiKey();
};

// Criar cliente axios com headers
const createClient = () => {
  const apiKey = getApiKey();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    timeout: 15000
  });
};

// Normalizar tag do jogador (adicionar # se necessário)
const normalizeTag = (tag) => {
  if (!tag) return '';
  const cleanTag = tag.trim().replace(/^#/, '').toUpperCase();
  return cleanTag;
};

// Obter informações do jogador
const getPlayer = async (playerTag) => {
  const tag = normalizeTag(playerTag);
  const cacheKey = `player_${tag}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada. Use !keyclash <api_key>' };
  }

  try {
    const client = createClient();
    const response = await client.get(`/players/%23${tag}`);
    const player = response.data;

    const data = {
      tag: player.tag,
      name: player.name,
      townHallLevel: player.townHallLevel,
      townHallWeaponLevel: player.townHallWeaponLevel || 0,
      expLevel: player.expLevel,
      trophies: player.trophies,
      bestTrophies: player.bestTrophies,
      warStars: player.warStars,
      attackWins: player.attackWins,
      defenseWins: player.defenseWins,
      builderHallLevel: player.builderHallLevel || 0,
      builderBaseTrophies: player.builderBaseTrophies || 0,
      bestBuilderBaseTrophies: player.bestBuilderBaseTrophies || 0,
      versusBattleWins: player.versusBattleWins || 0,
      role: player.role,
      warPreference: player.warPreference,
      donations: player.donations,
      donationsReceived: player.donationsReceived,
      clan: player.clan ? {
        tag: player.clan.tag,
        name: player.clan.name,
        level: player.clan.clanLevel
      } : null,
      achievements: player.achievements?.slice(0, 5).map(a => ({
        name: a.name,
        stars: a.stars,
        value: a.value
      })) || [],
      troops: player.troops?.filter(t => t.level > 0).slice(0, 8).map(t => ({
        name: t.name,
        level: t.level,
        maxLevel: t.maxLevel
      })) || [],
      heroes: player.heroes?.filter(h => h.level > 0).map(h => ({
        name: h.name,
        level: h.level,
        maxLevel: h.maxLevel
      })) || [],
      raw: player
    };

    setCache(cacheKey, data);
    return { ok: true, data };

  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return { ok: false, msg: '❌ Jogador não encontrado. Verifique a tag.' };
      }
      if (error.response.status === 403) {
        return { ok: false, msg: '❌ API Key inválida ou sem permissão.' };
      }
      if (error.response.status === 429) {
        return { ok: false, msg: '❌ Limite de requisições excedido. Tente novamente em alguns minutos.' };
      }
    }
    console.error('Erro ao buscar jogador Clash of Clans:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar dados do jogador.' };
  }
};

// Obter informações do clã
const getClan = async (clanTag) => {
  const tag = normalizeTag(clanTag);
  const cacheKey = `clan_${tag}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada.' };
  }

  try {
    const client = createClient();
    const response = await client.get(`/clans/%23${tag}`);
    const clan = response.data;

    const data = {
      tag: clan.tag,
      name: clan.name,
      description: clan.description || 'Sem descrição',
      type: clan.type,
      badgeId: clan.badgeId,
      clanLevel: clan.clanLevel,
      points: clan.points,
      versusPoints: clan.versusPoints,
      requiredTrophies: clan.requiredTrophies,
      warFrequency: clan.warFrequency,
      warWinStreak: clan.warWinStreak || 0,
      warWins: clan.warWins || 0,
      warTies: clan.warTies || 0,
      warLosses: clan.warLosses || 0,
      members: clan.members?.length || 0,
      memberList: clan.memberList?.slice(0, 10).map(m => ({
        tag: m.tag,
        name: m.name,
        role: m.role,
        trophies: m.trophies,
        donations: m.donations,
        donationsReceived: m.donationsReceived
      })) || [],
      warLeague: clan.warLeague?.name || 'Sem liga',
      location: clan.location?.name || 'Global',
      raw: clan
    };

    setCache(cacheKey, data);
    return { ok: true, data };

  } catch (error) {
    if (error.response?.status === 404) {
      return { ok: false, msg: '❌ Clã não encontrado.' };
    }
    if (error.response?.status === 429) {
      return { ok: false, msg: '❌ Limite de requisições excedido.' };
    }
    console.error('Erro ao buscar clã:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar dados do clã.' };
  }
};

// Obterwar do clã atual
const getClanWar = async (clanTag) => {
  const tag = normalizeTag(clanTag);
  const cacheKey = `clanwar_${tag}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada.' };
  }

  try {
    const client = createClient();
    const response = await client.get(`/clans/%23${tag}/currentwar`);
    const war = response.data;

    const data = {
      status: war.state,
      teamSize: war.teamSize,
      preparationStartTime: war.preparationStartTime,
      startTime: war.startTime,
      endTime: war.endTime,
      clan: war.clan ? {
        name: war.clan.name,
        tag: war.clan.tag,
        attacks: war.clan.attacks,
        stars: war.clan.stars,
        destructionPercentage: war.clan.destructionPercentage
      } : null,
      opponent: war.opponent ? {
        name: war.opponent.name,
        tag: war.opponent.tag,
        attacks: war.opponent.attacks,
        stars: war.opponent.stars,
        destructionPercentage: war.opponent.destructionPercentage
      } : null,
      raw: war
    };

    setCache(cacheKey, data);
    return { ok: true, data };

  } catch (error) {
    if (error.response?.status === 404) {
      return { ok: false, msg: '❌ Clã não encontrado ou sem guerra ativa.' };
    }
    if (error.response?.status === 429) {
      return { ok: false, msg: '❌ Limite de requisições excedido.' };
    }
    console.error('Erro ao buscar guerra do clã:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar guerra.' };
  }
};

// Obter ranking de jogadores
const getTopPlayers = async (limit = 10) => {
  const cacheKey = `top_players_${limit}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada.' };
  }

  try {
    const client = createClient();
    const response = await client.get(`/locations/global/players?limit=${limit}`);
    
    const players = response.data.map((p, index) => ({
      rank: index + 1,
      tag: p.tag,
      name: p.name,
      trophies: p.trophies,
      level: p.expLevel,
      clan: p.clan?.name || 'Sem clã'
    }));

    setCache(cacheKey, players);
    return { ok: true, data: players };

  } catch (error) {
    if (error.response?.status === 429) {
      return { ok: false, msg: '❌ Limite de requisições excedido.' };
    }
    console.error('Erro ao buscar ranking:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar ranking.' };
  }
};

// Obter ranking de clãs
const getTopClans = async (limit = 10) => {
  const cacheKey = `top_clans_${limit}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada.' };
  }

  try {
    const client = createClient();
    const response = await client.get(`/locations/global/clans?limit=${limit}`);
    
    const clans = response.data.map((c, index) => ({
      rank: index + 1,
      tag: c.tag,
      name: c.name,
      clanLevel: c.clanLevel,
      points: c.points,
      members: c.members?.length || 0,
      warWins: c.warWins || 0
    }));

    setCache(cacheKey, clans);
    return { ok: true, data: clans };

  } catch (error) {
    if (error.response?.status === 429) {
      return { ok: false, msg: '❌ Limite de requisições excedido.' };
    }
    console.error('Erro ao buscar ranking de clãs:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar ranking.' };
  }
};

export {
  isApiConfigured,
  getPlayer,
  getClan,
  getClanWar,
  getTopPlayers,
  getTopClans,
  normalizeTag
};

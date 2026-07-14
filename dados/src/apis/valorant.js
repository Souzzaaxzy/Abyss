/**
 * Valorant API Module
 * API da Riot Games
 * https://developer.riotgames.com
 * (Mesma API Key do League of Legends)
 */

import axios from 'axios';
import { getApiKey as dbGetApiKey } from '../utils/database.js';

// URLs das APIs
const VALORANT_API_URL = 'https://val.kyr.re';
const RAIO_API_URL = 'https://api.raio.io';

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

// Obter API Key do banco de dados
const getApiKey = () => {
  try {
    const keyData = dbGetApiKey('valorant');
    return keyData?.key || null;
  } catch (e) {
    return null;
  }
};

// Verificar se a API está configurada
const isApiConfigured = () => {
  return !!getApiKey();
};

// Normalizar nome de jogador (tag#region)
const normalizePlayerName = (name) => {
  if (!name) return { name: '', tag: '' };
  
  // Formato esperado: Nome#TAG
  const parts = name.trim().split('#');
  const playerName = parts[0] || '';
  const tag = parts[1] || 'br';
  
  return { name: playerName, tag: tag.toLowerCase() };
};

// Obter MMR/Stats do jogador
const getPlayerStats = async (playerName, playerTag) => {
  const cacheKey = `valorant_${playerName}_${playerTag}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada. Use !keyvalorant <api_key>' };
  }

  try {
    const apiKey = getApiKey();
    
    // Usar API proxy pública para evitar CORS
    const response = await axios.get(`${VALORANT_API_URL}/player/${encodeURIComponent(playerName)}/${playerTag}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 15000
    });

    const data = response.data;

    const result = {
      name: data.name || playerName,
      tag: data.tag || playerTag,
      level: data.level || 0,
      currentRank: data.currenttierpatched || 'Unranked',
      rank: data.ranking_in_tier || 0,
      elo: data.elo || 0,
      wins: data.wins || 0,
      losses: data.losses || 0,
      winRate: data.wins && data.games_played 
        ? ((data.wins / data.games_played) * 100).toFixed(1) 
        : '0',
      gamesPlayed: data.games_played || 0,
      kd: data.kd || 0,
      headshotPct: data.headshot_pct || 0,
      kills: data.kills || 0,
      deaths: data.deaths || 0,
      agent: data.agent || null,
      card: data.card || null,
      peakRank: data.peakrank || 'Unranked',
      lastUpdate: data.last_update || null,
      raw: data
    };

    setCache(cacheKey, result);
    return { ok: true, data: result };

  } catch (error) {
    if (error.response?.status === 404 || error.message?.includes('Not Found')) {
      return { ok: false, msg: '❌ Jogador não encontrado. Verifique o nome e a tag.' };
    }
    if (error.response?.status === 403) {
      return { ok: false, msg: '❌ API Key inválida ou sem permissão.' };
    }
    if (error.response?.status === 429) {
      return { ok: false, msg: '❌ Limite de requisições excedido. Tente novamente.' };
    }
    console.error('Erro ao buscar jogador Valorant:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar dados do jogador.' };
  }
};

// Obter MMR com nome completo (nome#tag)
const getPlayer = async (fullName) => {
  const { name, tag } = normalizePlayerName(fullName);
  
  if (!name) {
    return { ok: false, msg: '❌ Uso: !vaperfil Nome#TAG\n\nExemplo: !vaperfil Ronaldo#br1' };
  }
  
  return getPlayerStats(name, tag);
};

// Obter histórico de partidas recentes
const getMatchHistory = async (playerName, playerTag) => {
  const cacheKey = `valorant_matches_${playerName}_${playerTag}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada.' };
  }

  try {
    const apiKey = getApiKey();
    
    const response = await axios.get(`${VALORANT_API_URL}/matches/${encodeURIComponent(playerName)}/${playerTag}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 15000
    });

    const matches = response.data?.matches?.slice(0, 5).map(match => ({
      id: match.id,
      mode: match.mode || 'Unknown',
      map: match.map || 'Unknown',
      result: match.result || 'Unknown',
      score: match.score || '0-0',
      agent: match.agent || 'Unknown',
      kills: match.kills || 0,
      deaths: match.deaths || 0,
      assists: match.assists || 0,
      kd: match.kd || 0,
      headshotPct: match.headshot_pct || 0,
      timestamp: match.timestamp || null
    })) || [];

    setCache(cacheKey, matches);
    return { ok: true, data: matches };

  } catch (error) {
    if (error.response?.status === 404) {
      return { ok: false, msg: '❌ Jogador não encontrado ou sem partidas.' };
    }
    console.error('Erro ao buscar partidas:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar partidas.' };
  }
};

// Obter ranking de líderes
const getLeaderboard = async (limit = 10) => {
  const cacheKey = `valorant_leaderboard_${limit}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada.' };
  }

  try {
    const apiKey = getApiKey();
    
    const response = await axios.get(`${VALORANT_API_URL}/leaderboard?size=${limit}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 15000
    });

    const leaderboard = response.data?.slice(0, limit).map((player, index) => ({
      rank: index + 1,
      name: player.name || 'Unknown',
      tag: player.tag || '',
      currentRank: player.currenttierpatched || 'Unranked',
      elo: player.elo || 0,
      wins: player.wins || 0,
      gamesPlayed: player.games_played || 0
    })) || [];

    setCache(cacheKey, leaderboard);
    return { ok: true, data: leaderboard };

  } catch (error) {
    console.error('Erro ao buscar leaderboard:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar ranking.' };
  }
};

export {
  isApiConfigured,
  getPlayer,
  getPlayerStats,
  getMatchHistory,
  getLeaderboard,
  normalizePlayerName
};

/**
 * PUBG API Module
 * API Oficial da PUBG Developer Platform
 * https://developer.pubg.com
 * Requer API Key
 */

import axios from 'axios';
import { getApiKey as dbGetApiKey } from '../utils/database.js';

// URL da API Oficial da PUBG
const PUBG_API_URL = 'https://api.pubg.com';

// Shards disponíveis (plataformas)
const SHARDS = {
  steam: 'steam',
  console: 'console', 
  kakao: 'kakao',
  pc: 'steam', // alias
  xbox: 'console',
  psn: 'console'
};

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
    const keyData = dbGetApiKey('pubg');
    return keyData?.key || null;
  } catch (e) {
    return null;
  }
};

// Verificar se a API está configurada
const isApiConfigured = () => {
  return !!getApiKey();
};

// Normalizar nome do jogador
const normalizeName = (name) => {
  if (!name) return '';
  return name.trim();
};

// Obter shard padrão (steam para PC)
const getDefaultShard = () => 'steam';

// Buscar temporadas disponíveis
const getSeasons = async (shard = 'steam') => {
  try {
    const apiKey = getApiKey();
    const response = await axios.get(`${PUBG_API_URL}/shards/${shard}/seasons`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/vnd.api+json'
      },
      timeout: 15000
    });
    
    const seasons = response.data?.data || [];
    // Buscar temporada atual (normalmente a última ou que não seja 'preseason')
    const currentSeason = seasons.find(s => 
      s.id.includes('pc-2018') || s.id.includes('division')
    );
    return currentSeason?.id || seasons[0]?.id || null;
  } catch (error) {
    console.error('Erro ao buscar temporadas:', error.message);
    return null;
  }
};

// Obter estatísticas do jogador via API oficial
const getPlayerStats = async (playerName, shard = 'steam') => {
  const cacheKey = `pubg_${shard}_${playerName.toLowerCase()}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { 
      ok: false, 
      msg: '❌ API Key não configurada. Use !keypubg <api_key>\n\nObtenha sua key em: https://developer.pubg.com' 
    };
  }

  try {
    const apiKey = getApiKey();
    
    // BUSCAR JOGADOR - API OFICIAL
    const response = await axios.get(
      `${PUBG_API_URL}/shards/${shard}/players?filter[playerNames]=${encodeURIComponent(normalizeName(playerName))}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json'
        },
        timeout: 15000
      }
    );

    if (!response.data?.data || response.data.data.length === 0) {
      return { ok: false, msg: '❌ Jogador não encontrado. Verifique o nome e a plataforma (steam).' };
    }

    const playerData = response.data.data[0];
    const playerId = playerData.id;
    
    // Obter temporada atual
    const seasonId = await getSeasons(shard);
    if (!seasonId) {
      return { ok: false, msg: '❌ Não foi possível obter informações da temporada.' };
    }
    
    // BUSCAR ESTATÍSTICAS DE TEMPORADA - API OFICIAL
    let statsData = null;
    try {
      const seasonResponse = await axios.get(
        `${PUBG_API_URL}/shards/${shard}/players/${playerId}/seasons/${seasonId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/vnd.api+json'
          },
          timeout: 15000
        }
      );

      const seasonStats = seasonResponse.data?.data?.attributes?.stats;
      if (seasonStats) {
        statsData = {
          level: seasonStats.level || 0,
          kills: seasonStats.kills || 0,
          deaths: seasonStats.deaths || 0,
          kd: seasonStats.kills && seasonStats.deaths 
            ? (seasonStats.kills / seasonStats.deaths).toFixed(2) 
            : '0.00',
          wins: seasonStats.wins || 0,
          losses: seasonStats.losses || 0,
          winRate: seasonStats.wins && seasonStats.games > 0
            ? ((seasonStats.wins / seasonStats.games) * 100).toFixed(1)
            : '0',
          gamesPlayed: seasonStats.roundsPlayed || seasonStats.games || 0,
          headshots: seasonStats.headshotKills || 0,
          headshotRate: seasonStats.headshotKills && seasonStats.kills > 0
            ? ((seasonStats.headshotKills / seasonStats.kills) * 100).toFixed(1)
            : '0',
          roadKills: seasonStats.roadKills || 0,
          vehicleKills: seasonStats.vehicleKills || 0,
          longestKill: seasonStats.longestKill?.toFixed(0) || 0,
          damageDealt: seasonStats.damageDealt?.toFixed(0) || 0,
          heals: seasonStats.heals || 0,
          revives: seasonStats.revives || 0,
          walkDistance: ((seasonStats.walkDistance || 0) / 1000).toFixed(1),
          rideDistance: ((seasonStats.rideDistance || 0) / 1000).toFixed(1),
          swimDistance: ((seasonStats.swimDistance || 0) / 1000).toFixed(1),
          avgSurvivalTime: seasonStats.averageSurvivalTime 
            ? (seasonStats.averageSurvivalTime / 60).toFixed(1) 
            : '0',
          assists: seasonStats.assists || 0,
          boosts: seasonStats.boosts || 0,
          dBNOs: seasonStats.dBNOs || 0,
          killStreaks: seasonStats.killStreaks || 0,
          longestTimeSurvived: seasonStats.longestTimeSurvived 
            ? (seasonStats.longestTimeSurvived / 60).toFixed(1) 
            : '0'
        };
      }
    } catch (seasonError) {
      console.log('Estatísticas de temporada não disponíveis:', seasonError.message);
    }

    const data = {
      id: playerId,
      name: playerData.attributes?.name || playerName,
      shardId: shard,
      seasonId: seasonId,
      stats: statsData,
      matches: playerData.relationships?.matches?.data?.length || 0,
      raw: playerData
    };

    setCache(cacheKey, data);
    return { ok: true, data };

  } catch (error) {
    if (error.response?.status === 404) {
      return { ok: false, msg: '❌ Jogador não encontrado. Verifique o nome e a plataforma (steam).' };
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      return { ok: false, msg: '❌ API Key inválida ou sem permissão. Obtenha uma key em: https://developer.pubg.com' };
    }
    if (error.response?.status === 429) {
      return { ok: false, msg: '❌ Limite de requisições excedido. Tente novamente em alguns minutos.' };
    }
    console.error('Erro ao buscar jogador PUBG:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar dados do jogador. Tente novamente.' };
  }
};

// Obter perfil do jogador
const getPlayer = async (playerName, platform = 'steam') => {
  if (!playerName) {
    return { ok: false, msg: '❌ Nome do jogador é obrigatório.\n\nExemplo: !pubgperfil Nickname\n\n📌 Plataformas: steam (PC), console (Xbox/PS4)' };
  }
  
  const shard = SHARDS[platform.toLowerCase()] || 'steam';
  return getPlayerStats(playerName, shard);
};

// Obter matches recentes
const getRecentMatches = async (playerName, shard = 'steam') => {
  const cacheKey = `pubg_matches_${shard}_${playerName.toLowerCase()}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada.' };
  }

  try {
    const apiKey = getApiKey();
    
    const response = await axios.get(
      `${PUBG_API_URL}/shards/${shard}/players?filter[playerNames]=${encodeURIComponent(normalizeName(playerName))}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json'
        },
        timeout: 15000
      }
    );

    if (!response.data?.data || response.data.data.length === 0) {
      return { ok: false, msg: '❌ Jogador não encontrado.' };
    }

    const playerData = response.data.data[0];
    const matches = playerData.relationships?.matches?.data || [];
    
    const matchList = matches.slice(0, 5).map(match => ({
      id: match.id,
      matchId: match.id
    }));

    setCache(cacheKey, matchList);
    return { ok: true, data: matchList };

  } catch (error) {
    console.error('Erro ao buscar matches PUBG:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar partidas.' };
  }
};

// Obter informações de um match específico
const getMatchInfo = async (matchId, shard = 'steam') => {
  const cacheKey = `pubg_match_${shard}_${matchId}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada.' };
  }

  try {
    const apiKey = getApiKey();
    
    const response = await axios.get(
      `${PUBG_API_URL}/shards/${shard}/matches/${matchId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json'
        },
        timeout: 15000
      }
    );

    const matchData = response.data;
    
    const data = {
      id: matchData.data?.id,
      gameMode: matchData.data?.attributes?.gameMode,
      mapName: matchData.data?.attributes?.mapName,
      duration: Math.floor((matchData.data?.attributes?.duration || 0) / 60),
      createdAt: matchData.data?.attributes?.createdAt,
      matchType: matchData.data?.attributes?.matchType,
      telemetryUrl: matchData.data?.relationships?.assets?.data?.[0]?.id,
      rosterCount: matchData.data?.relationships?.rosters?.data?.length || 0
    };

    setCache(cacheKey, data);
    return { ok: true, data };

  } catch (error) {
    if (error.response?.status === 404) {
      return { ok: false, msg: '❌ Partida não encontrada.' };
    }
    console.error('Erro ao buscar match PUBG:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar partida.' };
  }
};

export {
  isApiConfigured,
  getPlayer,
  getPlayerStats,
  getRecentMatches,
  getMatchInfo,
  SHARDS
};

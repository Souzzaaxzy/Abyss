/**
 * Valorant API Module
 * API Oficial da Riot Games
 * https://developer.riotgames.com
 * Requer API Key da Riot (mesma do LoL)
 */

import axios from 'axios';
import { getApiKey as dbGetApiKey } from '../utils/database.js';

// URLs da API Oficial da Riot
const RIOT_API_BASE = 'https://americas.api.riotgames.com';
const VALORANT_API_BASE = 'https://pd.us.a.pvp.net';

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
  const tag = parts[1] || 'br1';
  
  return { name: playerName, tag: tag.toLowerCase() };
};

// Mapear região para código da API
const getRegion = (tag) => {
  const tagLower = tag.toLowerCase();
  if (tagLower === 'br' || tagLower === 'br1') return 'br';
  if (tagLower === 'la' || tagLower === 'la1') return 'la1';
  if (tagLower === 'la2') return 'la2';
  if (tagLower === 'na') return 'na';
  if (tagLower === 'eu') return 'eu';
  return 'br'; // default BR
};

// Obter PUUID pelo nome do jogador (API oficial)
const getPUUID = async (playerName, playerTag) => {
  const cacheKey = `puuid_${playerName}_${playerTag}`;
  
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!isApiConfigured()) {
    return null;
  }

  try {
    const apiKey = getApiKey();
    const region = getRegion(playerTag);
    
    // API oficial para buscar PUUID
    const response = await axios.get(
      `${RIOT_API_BASE}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(playerName)}/${encodeURIComponent(playerTag)}`,
      {
        headers: {
          'X-Riot-Token': apiKey
        },
        timeout: 15000
      }
    );

    const puuid = response.data?.puuid;
    if (puuid) {
      setCache(cacheKey, puuid);
      return puuid;
    }
    return null;

  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Jogador não encontrado na API da Riot');
    } else {
      console.error('Erro ao buscar PUUID:', error.message);
    }
    return null;
  }
};

// Obter MMR/Stats do jogador (usando API oficial)
const getPlayerStats = async (playerName, playerTag) => {
  const cacheKey = `valorant_${playerName}_${playerTag}`;
  
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  if (!isApiConfigured()) {
    return { ok: false, msg: '❌ API Key não configurada. Use !keyvalorant <api_key>\n\nObtenha sua key em: https://developer.riotgames.com' };
  }

  try {
    const apiKey = getApiKey();
    
    // Primeiro obtém o PUUID
    const puuid = await getPUUID(playerName, playerTag);
    if (!puuid) {
      return { ok: false, msg: '❌ Jogador não encontrado. Verifique o nome e a tag (ex: Nome#br1)' };
    }

    // Busca MMR usando a API de oficiais
    const mmrResponse = await axios.get(
      `https://api.henrikdev.xyz/v1/mmr/br/${encodeURIComponent(playerName)}/${playerTag}`,
      { timeout: 15000 }
    );

    const mmrData = mmrResponse.data?.data;
    if (!mmrData) {
      return { ok: false, msg: '❌ Dados de ranking não encontrados para este jogador.' };
    }

    const result = {
      name: playerName,
      tag: playerTag,
      puuid: puuid,
      currentRank: mmrData.currenttierpatched || 'Unranked',
      rank: mmrData.ranking_in_tier || 0,
      elo: mmrData.elo || mmrData.rr || 0,
      wins: mmrData.wins || 0,
      losses: mmrData.losses || 0,
      winRate: mmrData.wins && mmrData.games_played 
        ? ((mmrData.wins / mmrData.games_played) * 100).toFixed(1) 
        : '0',
      gamesPlayed: mmrData.games_played || 0,
      peakRank: mmrData.peakrank || mmrData.currenttierpatched || 'Unranked',
      competitiveSeason: mmrData.season || 'Current',
      raw: mmrData
    };

    setCache(cacheKey, result);
    return { ok: true, data: result };

  } catch (error) {
    if (error.response?.status === 404) {
      return { ok: false, msg: '❌ Jogador não encontrado. Verifique o nome e a tag (ex: Nome#br1)' };
    }
    if (error.response?.status === 403) {
      return { ok: false, msg: '❌ API Key inválida ou sem permissão. Obtenha uma key em: https://developer.riotgames.com' };
    }
    if (error.response?.status === 429) {
      return { ok: false, msg: '❌ Limite de requisições excedido. Tente novamente em alguns minutos.' };
    }
    console.error('Erro ao buscar jogador Valorant:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar dados do jogador. Tente novamente.' };
  }
};

// Obter MMR com nome completo (nome#tag)
const getPlayer = async (fullName) => {
  const { name, tag } = normalizePlayerName(fullName);
  
  if (!name) {
    return { ok: false, msg: '❌ Uso: !vaperfil Nome#TAG\n\nExemplo: !vaperfil Ronaldo#br1\n\n📌 Obtenha sua API Key em: https://developer.riotgames.com' };
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
    const puuid = await getPUUUID(playerName, playerTag);
    
    if (!puuid) {
      return { ok: false, msg: '❌ Jogador não encontrado.' };
    }

    // API oficial de matches
    const response = await axios.get(
      `${VALORANT_API_BASE}/match-history/v1/history/${puuid}?queue=competitive`,
      {
        headers: {
          'X-Riot-Token': apiKey
        },
        timeout: 15000
      }
    );

    const matches = response.data?.History?.slice(0, 5).map(match => ({
      matchId: match.MatchID,
      gameStart: match.GameStartMillis,
      gameLength: match.GameLengthMillis,
      queueId: match.QueueID,
      tier: match.TierAfterUpdate,
      tierProgress: match.TierProgressAfterUpdate
    })) || [];

    setCache(cacheKey, matches);
    return { ok: true, data: matches };

  } catch (error) {
    if (error.response?.status === 404) {
      return { ok: false, msg: '❌ Nenhuma partida competitiva encontrada.' };
    }
    console.error('Erro ao buscar partidas:', error.message);
    return { ok: false, msg: '❌ Erro ao buscar partidas.' };
  }
};

// Obter ranking de líderes (BR)
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
    // Leaderboard da API henrikdev (complementar)
    const response = await axios.get(
      `https://api.henrikdev.xyz/v1/leaderboard/br?size=${limit}`,
      { timeout: 15000 }
    );

    const leaderboard = response.data?.data?.slice(0, limit).map((player, index) => ({
      rank: index + 1,
      name: player.gameName || 'Unknown',
      tag: player.tagLine || '',
      currentRank: player.currenttierpatched || 'Unranked',
      elo: player.rankingInTier || player.ranking_in_tier || 0,
      wins: player.numberOfWins || player.wins || 0,
      gamesPlayed: player.gamesPlayed || player.games_played || 0
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

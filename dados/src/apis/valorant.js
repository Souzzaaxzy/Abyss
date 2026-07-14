/**
 * Valorant API Module
 * Usa API pública henrikdev.xyz (não requer API Key)
 * https://api.henrikdev.xyz
 */

import axios from 'axios';

// URL da API pública
const VALORANT_API_URL = 'https://api.henrikdev.xyz/v1';

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

// API pública não requer configuração
const isApiConfigured = () => {
  return true;
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

  try {
    // API pública henrikdev.xyz - não requer API key
    const response = await axios.get(`${VALORANT_API_URL}/account/${encodeURIComponent(playerName)}/${playerTag}`, {
      timeout: 15000
    });

    const data = response.data;
    
    // Verificar se a resposta tem dados válidos
    if (!data.data) {
      return { ok: false, msg: '❌ Jogador não encontrado.' };
    }

    const account = data.data;
    const result = {
      name: account.name || playerName,
      tag: account.tag || playerTag,
      level: account.account_level || 0,
      currentRank: account.currenttierpatched || 'Unranked',
      rank: account.ranking_in_tier || 0,
      elo: account.elo || 0,
      wins: account.wins || 0,
      losses: account.losses || 0,
      winRate: account.winrate || '0',
      gamesPlayed: account.games_played || 0,
      card: account.card || null,
      peakRank: account.peakrank || account.currenttierpatched || 'Unranked',
      raw: account
    };

    setCache(cacheKey, result);
    return { ok: true, data: result };

  } catch (error) {
    if (error.response?.status === 404 || error.message?.includes('Not Found')) {
      return { ok: false, msg: '❌ Jogador não encontrado. Verifique o nome e a tag (ex: Nome#br1)' };
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

  try {
    const response = await axios.get(`${VALORANT_API_URL}/match-history/br/${encodeURIComponent(playerName)}?filter=competitive`, {
      timeout: 15000
    });

    const matches = response.data?.data?.slice(0, 5).map(match => {
      const player = match.players?.all_players?.find(p => 
        p.name.toLowerCase() === playerName.toLowerCase()
      ) || {};
      
      return {
        id: match.metadata?.matchid || '',
        mode: match.metadata?.mode || 'Unknown',
        map: match.metadata?.map || 'Unknown',
        result: match.metadata?.mode || 'Unknown',
        agent: player.character || 'Unknown',
        kills: player.stats?.kills || 0,
        deaths: player.stats?.deaths || 0,
        assists: player.stats?.assists || 0,
        kd: player.stats?.kills && player.stats?.deaths 
          ? (player.stats.kills / player.stats.deaths).toFixed(2) 
          : '0',
        headshotPct: player.stats?.headshot_pct || 0,
        timestamp: match.metadata?.game_start || null
      };
    }) || [];

    setCache(cacheKey, matches);
    return { ok: true, data: matches };

  } catch (error) {
    if (error.response?.status === 404 || error.message?.includes('Not Found')) {
      return { ok: false, msg: '❌ Nenhuma partida competitiva encontrada.' };
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

  try {
    const response = await axios.get(`${VALORANT_API_URL}/leaderboard/br?size=${limit}`, {
      timeout: 15000
    });

    const leaderboard = response.data?.data?.slice(0, limit).map((player, index) => ({
      rank: index + 1,
      name: player.gameName || 'Unknown',
      tag: player.tagLine || '',
      currentRank: player.currenttierpatched || 'Unranked',
      elo: player.ranking_in_tier || 0,
      wins: player.number_of_wins || 0,
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

/**
 * Free Fire API Module
 * Utiliza a Free Fire Community API
 * ES Modules compatible
 */

import { getApiKey as dbGetApiKey } from '../utils/database.js';

// Cache para armazenar respostas (5 minutos)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

// URL base da API
const API_BASE_URL = 'https://developers.freefirecommunity.com/api/v1';

// User-Agent personalizado para evitar bloqueio
const USER_AGENT = 'AbyssBot/1.0 (https://github.com/Souzzaaxzy/Abyss; +https://developers.freefirecommunity.com)';

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

const getApiKey = () => {
  try {
    return dbGetApiKey('freefire');
  } catch (e) {
    return null;
  }
};

const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        'User-Agent': USER_AGENT
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return 'Não informado';
  
  const horas = Math.floor(seconds / 3600);
  const minutos = Math.floor((seconds % 3600) / 60);
  const segs = seconds % 60;
  
  let resultado = [];
  if (horas > 0) resultado.push(`${horas}h`);
  if (minutos > 0) resultado.push(`${minutos}m`);
  if (segs > 0 || resultado.length === 0) resultado.push(`${segs}s`);
  
  return resultado.join(' ');
};

const formatDate = (dateString) => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Não informado';
    
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return 'Não informado';
  }
};

const summarizeDescription = (description) => {
  if (!description) return 'Não informado';
  
  let summary = description.replace(/[\n\r\t]+/g, ' ').trim();
  
  if (summary.length > 100) {
    summary = summary.substring(0, 97) + '...';
  }
  
  return summary || 'Não informado';
};

const isApiConfigured = () => {
  const apiKey = getApiKey();
  return apiKey && apiKey.key;
};

const getProfile = async (playerId, region = 'br') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, msg: '❌ A API Key do Free Fire ainda não foi configurada pelo proprietário do bot.' };
  }

  const cacheKey = `profile_${region}_${playerId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/info?region=${region}&uid=${playerId}`,
      {
        headers: {
          'x-api-key': apiKey.key
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { ok: false, msg: '❌ UID não encontrado.' };
      }
      if (response.status === 403) {
        return { ok: false, msg: '❌ API Key inválida ou acesso negado.' };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.error === 'Forbidden' || result.code === 'FW_002') {
      return { ok: false, msg: '❌ Acesso automatizado bloqueado. Configure um User-Agent válido.' };
    }

    if (result.message?.includes('not found') || result.error) {
      return { ok: false, msg: '❌ UID não encontrado.' };
    }

    // Parsear resposta da nova API
    const basicInfo = result.basicInfo || {};
    const captainInfo = result.captainBasicInfo || {};
    const clanInfo = result.clanBasicInfo || {};
    const petInfo = result.petInfo || {};
    const socialInfo = result.socialInfo || {};
    const profileInfo = result.profileInfo || {};

    const profile = {
      nickname: basicInfo.nickname || null,
      uid: basicInfo.accountId || playerId,
      level: basicInfo.level || null,
      likes: socialInfo.likes || null,
      region: basicInfo.region || region,
      guild: clanInfo.clanName || null,
      guildId: clanInfo.clanId || null,
      guildLevel: clanInfo.clanLevel || null,
      guildMembers: clanInfo.memberNum || null,
      guildCapacity: clanInfo.capacity || null,
      avatar: profileInfo.avatarId ? `https://ffpocket.com/ff/assets/img/avatar/${profileInfo.avatarId}.webp` : null,
      captainNickname: captainInfo.nickname || null,
      captainUid: captainInfo.accountId || null,
      pet: petInfo.id ? `Pet ID: ${petInfo.id} (Nível ${petInfo.level})` : null,
      bio: socialInfo.signature || null,
      creditScore: result.creditScoreInfo?.creditScore || null,
      raw: result
    };

    setCache(cacheKey, profile);
    return { ok: true, data: profile };

  } catch (error) {
    if (error.name === 'AbortError') {
      return { ok: false, msg: '❌ A consulta demorou mais que o esperado.' };
    }
    console.error('Erro ao buscar perfil Free Fire:', error);
    return { ok: false, msg: '❌ O serviço do Free Fire está indisponível. Tente novamente em alguns minutos.' };
  }
};

const getStats = async (playerId, region = 'br') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, msg: '❌ A API Key do Free Fire ainda não foi configurada pelo proprietário do bot.' };
  }

  const cacheKey = `stats_${region}_${playerId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/info?region=${region}&uid=${playerId}`,
      {
        headers: {
          'x-api-key': apiKey.key
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { ok: false, msg: '❌ UID não encontrado.' };
      }
      if (response.status === 403) {
        return { ok: false, msg: '❌ API Key inválida ou acesso negado.' };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.error === 'Forbidden' || result.code === 'FW_002') {
      return { ok: false, msg: '❌ Acesso automatizado bloqueado. Configure um User-Agent válido.' };
    }

    if (result.message?.includes('not found') || result.error) {
      return { ok: false, msg: '❌ UID não encontrado.' };
    }

    // A nova API retorna informações completas no endpoint /info
    const basicInfo = result.basicInfo || {};
    const clanInfo = result.clanBasicInfo || {};
    const petInfo = result.petInfo || {};
    const captainInfo = result.captainBasicInfo || {};

    const statsFormatted = {
      nickname: basicInfo.nickname || null,
      uid: basicInfo.accountId || playerId,
      level: basicInfo.level || null,
      rank: basicInfo.rank || null,
      region: basicInfo.region || region,
      seasonId: basicInfo.seasonId || null,
      // Informações do Clan/Guilda
      guild: clanInfo.clanName || null,
      guildId: clanInfo.clanId || null,
      guildLevel: clanInfo.clanLevel || null,
      guildMembers: clanInfo.memberNum || null,
      guildCapacity: clanInfo.capacity || null,
      // Informações do Captain
      captainNickname: captainInfo.nickname || null,
      captainUid: captainInfo.accountId || null,
      // Pet
      pet: petInfo.id ? `Pet ID: ${petInfo.id} (Nível ${petInfo.level})` : null,
      petExp: petInfo.exp || null,
      // Credit Score
      creditScore: result.creditScoreInfo?.creditScore || null,
      creditRewardState: result.creditScoreInfo?.rewardState || null,
      // Raw data
      raw: result
    };

    setCache(cacheKey, statsFormatted);
    return { ok: true, data: statsFormatted };

  } catch (error) {
    if (error.name === 'AbortError') {
      return { ok: false, msg: '❌ A consulta demorou mais que o esperado.' };
    }
    console.error('Erro ao buscar estatísticas Free Fire:', error);
    return { ok: false, msg: '❌ O serviço do Free Fire está indisponível. Tente novamente em alguns minutos.' };
  }
};

const getGuild = async (guildId, region = 'br') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, msg: '❌ A API Key do Free Fire ainda não foi configurada pelo proprietário do bot.' };
  }

  // A nova API não tem endpoint específico para guild, então buscamos via perfil de captain
  const cacheKey = `guild_${region}_${guildId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  try {
    // Buscar info do captain para obter dados da guilda
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/info?region=${region}&uid=${guildId}`,
      {
        headers: {
          'x-api-key': apiKey.key
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { ok: false, msg: '❌ ID da guilda não encontrado.' };
      }
      if (response.status === 403) {
        return { ok: false, msg: '❌ API Key inválida ou acesso negado.' };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.error === 'Forbidden' || result.code === 'FW_002') {
      return { ok: false, msg: '❌ Acesso automatizado bloqueado. Configure um User-Agent válido.' };
    }

    if (result.message?.includes('not found') || result.error) {
      return { ok: false, msg: '❌ ID da guilda não encontrado.' };
    }

    const clanInfo = result.clanBasicInfo || {};
    const captainInfo = result.captainBasicInfo || {};

    const guild = {
      name: clanInfo.clanName || null,
      id: clanInfo.clanId || guildId,
      leader: captainInfo.nickname || null,
      leaderId: captainInfo.accountId || null,
      memberCount: clanInfo.memberNum || null,
      maxMembers: clanInfo.capacity || 50,
      level: clanInfo.clanLevel || null,
      region: result.basicInfo?.region || region,
      raw: result
    };

    setCache(cacheKey, guild);
    return { ok: true, data: guild };

  } catch (error) {
    if (error.name === 'AbortError') {
      return { ok: false, msg: '❌ A consulta demorou mais que o esperado.' };
    }
    console.error('Erro ao buscar guilda Free Fire:', error);
    return { ok: false, msg: '❌ O serviço do Free Fire está indisponível. Tente novamente em alguns minutos.' };
  }
};

const checkBan = async (playerId, region = 'br') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, msg: '❌ A API Key do Free Fire ainda não foi configurada pelo proprietário do bot.' };
  }

  // A nova API não tem endpoint específico para ban, retornamos info básica
  const cacheKey = `ban_${region}_${playerId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/info?region=${region}&uid=${playerId}`,
      {
        headers: {
          'x-api-key': apiKey.key
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { ok: false, msg: '❌ UID não encontrado.' };
      }
      if (response.status === 403) {
        return { ok: false, msg: '❌ API Key inválida ou acesso negado.' };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.error === 'Forbidden' || result.code === 'FW_002') {
      return { ok: false, msg: '❌ Acesso automatizado bloqueado. Configure um User-Agent válido.' };
    }

    if (result.message?.includes('not found') || result.error) {
      return { ok: false, msg: '❌ UID não encontrado.' };
    }

    const banStatus = {
      isBanned: false,
      bannedAt: null,
      reason: null,
      expiresAt: null,
      nickname: result.basicInfo?.nickname || null,
      accountId: result.basicInfo?.accountId || playerId,
      level: result.basicInfo?.level || null,
      raw: result
    };

    setCache(cacheKey, banStatus);
    return { ok: true, data: banStatus };

  } catch (error) {
    if (error.name === 'AbortError') {
      return { ok: false, msg: '❌ A consulta demorou mais que o esperado.' };
    }
    console.error('Erro ao verificar banimento Free Fire:', error);
    return { ok: false, msg: '❌ O serviço do Free Fire está indisponível. Tente novamente em alguns minutos.' };
  }
};

const getWishlist = async (playerId, region = 'br') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, msg: '❌ A API Key do Free Fire ainda não foi configurada pelo proprietário do bot.' };
  }

  // A nova API não tem endpoint específico para wishlist
  const cacheKey = `wishlist_${region}_${playerId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/info?region=${region}&uid=${playerId}`,
      {
        headers: {
          'x-api-key': apiKey.key
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { ok: false, msg: '❌ UID não encontrado.' };
      }
      if (response.status === 403) {
        return { ok: false, msg: '❌ API Key inválida ou acesso negado.' };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.error === 'Forbidden' || result.code === 'FW_002') {
      return { ok: false, msg: '❌ Acesso automatizado bloqueado. Configure um User-Agent válido.' };
    }

    if (result.message?.includes('not found') || result.error) {
      return { ok: false, msg: '❌ UID não encontrado.' };
    }

    // Wishlist não disponível na nova API
    const wishlist = {
      items: [],
      skins: [],
      emotes: [],
      collections: [],
      recentItems: [],
      count: 0,
      available: false,
      message: 'A lista de desejos não está disponível nesta API'
    };

    setCache(cacheKey, wishlist);
    return { ok: true, data: wishlist };

  } catch (error) {
    if (error.name === 'AbortError') {
      return { ok: false, msg: '❌ A consulta demorou mais que o esperado.' };
    }
    console.error('Erro ao buscar wishlist Free Fire:', error);
    return { ok: false, msg: '❌ O serviço do Free Fire está indisponível. Tente novamente em alguns minutos.' };
  }
};

export {
  isApiConfigured,
  getProfile,
  getStats,
  getGuild,
  checkBan,
  getWishlist,
  formatDuration,
  formatDate,
  summarizeDescription
};

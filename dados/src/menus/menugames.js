/**
 * Menu Games - Menu de comandos de jogos
 */

export default async function menugames(prefix, botName = "MeuBot", userName = "Usuário") {
    return `╭──────────────────────────────────────────────╮
│              🎮 ${botName} - GAMES              ║
╰──────────────────────────────────────────────╯

╭──────────────────────────────────────────────╮
│ ◈ Menu Games - Comandos de Jogos             │
╰──────────────────────────────────────────────╯

╭──────────────────────────────────────────────╮
│ 🔥 FREE FIRE
╰──────────────────────────────────────────────╯
│
│ ▸ ${prefix}ffperfil <UID>
│   Ver perfil completo do jogador
│
│ ▸ ${prefix}ffstats <UID>
│   Ver estatísticas detalhadas
│
│ ▸ ${prefix}ffguilda <ID da guilda>
│   Ver informações da guilda
│
│ ▸ ${prefix}ffban <UID>
│   Verificar status de banimento
│
│ ▸ ${prefix}ffwishlist <UID>
│   Ver lista de desejos/itens
│
╰──────────────────────────────────────────────╯

╭──────────────────────────────────────────────╮
│ 📌 Em breve
╰──────────────────────────────────────────────╯
│
│ 🎯 Valorant
│ 👑 Clash Royale
│ ⭐ Brawl Stars
│ 🟦 Roblox
│ 🪂 PUBG
│
╰──────────────────────────────────────────────╯

💡 Use ${prefix}ajuda <comando> para mais informações.`;
}

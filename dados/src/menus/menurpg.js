export default async function menuRpg(prefix, botName = "MeuBot", userName = "Usuário") {
    return `╭━━━〔 ⚔️ ${botName} • 𝐑𝐏𝐆 〕━━━╮
┃ 👋 Olá, @${userName}
┃ ⚔️ Sistema RPG completo
┃ 🌟 Evolua, batalhe e conquiste
╰━━━━━━━━━━━━━━━━━━━━━━╯


╭─❖ 👤 PERFIL & STATUS
│ 📜 ${prefix}perfilrpg
│ 💰 ${prefix}carteira
│ 🏆 ${prefix}toprpg
│ 🌎 ${prefix}rankglobal
│ ⭐ ${prefix}ranklvl
│ 🎒 ${prefix}inv
│ ⚔️ ${prefix}equipamentos
│ 🏅 ${prefix}conquistas
╰──────────────


╭─❖ 🌟 EVOLUÇÃO & PRESTIGE
│ ⬆️ ${prefix}evoluir
│ 🔥 ${prefix}prestige
│ 🔥 ${prefix}streak
│ 🎁 ${prefix}reivindicar
│ ⚡ ${prefix}speedup
╰──────────────


╭─❖ 💰 ECONOMIA & FINANÇAS
│ 🏦 ${prefix}dep <valor|all>
│ 💸 ${prefix}sacar <valor|all>
│ 💳 ${prefix}pix @user <valor>
│ 🛒 ${prefix}loja
│ 🛍️ ${prefix}comprar <item>
│ 📦 ${prefix}vender <item> <qtd>
│ 💼 ${prefix}vagas
│ 👷 ${prefix}emprego <vaga>
│ 🚪 ${prefix}demitir
│ 🧬 ${prefix}habilidades
│ 📅 ${prefix}desafiosemanal
│ 🗓️ ${prefix}desafiomensal
╰──────────────


╭─❖ 📈 INVESTIMENTOS
│ 📊 ${prefix}investir
│ 📈 ${prefix}investir <ação> <qtd>
│ 💹 ${prefix}sell <ação> <qtd>
╰──────────────


╭─❖ 🎰 CASSINO & APOSTAS
│ 🎲 ${prefix}dados <valor>
│ 🪙 ${prefix}coinflip <cara|coroa> <valor>
│ 🚀 ${prefix}crash <valor>
│ 🎰 ${prefix}slots <valor>
│ 💰 ${prefix}apostar <valor>
│ 🎯 ${prefix}roleta <valor> <cor>
│ 🃏 ${prefix}blackjack <valor>
│ 🎟️ ${prefix}loteria
│ 🛒 ${prefix}loteria comprar <qtd>
│ 🐎 ${prefix}corrida <valor> <cavalo>
│ 🔨 ${prefix}leilao
│ 💎 ${prefix}topriqueza
╰──────────────


╭─❖ 🎯 ATIVIDADES DIÁRIAS
│ 🎁 ${prefix}diario
│ 💼 ${prefix}work
│ ⛏️ ${prefix}mine
│ 🎣 ${prefix}fish
│ 📦 ${prefix}coletar
│ 🌾 ${prefix}colher
│ 🏹 ${prefix}caçar
│ 🌱 ${prefix}plantar <planta>
│ 🌿 ${prefix}cultivar <planta>
│ 🏡 ${prefix}plantacao
│ 🍳 ${prefix}cook <receita>
│ 📖 ${prefix}receitas
│ 🥕 ${prefix}ingredientes
│ 🍖 ${prefix}eat <comida>
│ 💵 ${prefix}vendercomida <item>
│ 🌱 ${prefix}sementes
╰──────────────


╭─❖ 🗺️ AVENTURA & EXPLORAÇÃO
│ 🌎 ${prefix}explore
│ 🏰 ${prefix}masmorra
│ 👹 ${prefix}bossrpg
│ 🎉 ${prefix}eventos
╰──────────────


╭─❖ 🏰 DUNGEONS & RAIDS
│ 📜 ${prefix}dungeon
│ 🏗️ ${prefix}dungeon criar <tipo>
│ 🚪 ${prefix}dungeon entrar <id>
│ ⚔️ ${prefix}dungeon iniciar
│ 🚶 ${prefix}dungeon sair
╰──────────────


╭─❖ ⚔️ CLASSES & PROFISSÕES
│ 📚 ${prefix}class
│ 🛡️ ${prefix}class <nome>
╰──────────────


╭─❖ 🏠 HOUSING
│ 🏡 ${prefix}casa
│ 🏠 ${prefix}casa comprar <tipo>
│ 📦 ${prefix}casa coletar
│ 🎨 ${prefix}casa decorar <item>
╰──────────────


╭─❖ 🛒 MERCADO
│ 🔨 ${prefix}auction
│ 💰 ${prefix}auction vender <item> <preço>
│ 🛍️ ${prefix}auction comprar <nº>
│ 📦 ${prefix}auction meus
│ ❌ ${prefix}auction cancelar <nº>
│
│ 🌐 MERCADO GERAL
│ 🏪 ${prefix}mercado
│ 📋 ${prefix}listar <item> <preço>
│ 🛒 ${prefix}cmerc <nº>
│ 📜 ${prefix}meusan
│ ❌ ${prefix}cancelar <nº>
╰──────────────


╭─❖ ⚔️ COMBATE & BATALHAS
│ ⚔️ ${prefix}duelrpg @user
│ 🏟️ ${prefix}arena
│ 🏆 ${prefix}torneio
│ 🥷 ${prefix}assaltar @user
│ 💀 ${prefix}crime
│ ⚔️ ${prefix}guerra
│ 🎯 ${prefix}desafio
╰──────────────


╭─❖ 🔨 CRAFTING & EQUIPAMENTOS
│ 🔥 ${prefix}forge <item>
│ ✨ ${prefix}enchant
│ 🗑️ ${prefix}dismantle <item>
│ 🔧 ${prefix}reparar <item>
│ ⛏️ ${prefix}materiais
│ 💰 ${prefix}precos
╰──────────────


╭─❖ 💝 SOCIAL & RELACIONAMENTOS
│ 💍 ${prefix}casar @user
│ 💔 ${prefix}divorciar
│ ❤️ ${prefix}namorar @user
│ ❌ ${prefix}terminar
│ 💑 ${prefix}relacionamento
│ 🏆 ${prefix}casais
│ 🤗 ${prefix}abracarrpg @user
│ 💋 ${prefix}beijarrpg @user
│ 👊 ${prefix}baterrpg @user
│ 🛡️ ${prefix}proteger @user
╰──────────────


╭─❖ 👨‍👩‍👧 FAMÍLIA & ADOÇÃO
│ 👪 ${prefix}familia
│ 👶 ${prefix}adotaruser @user
│ ❌ ${prefix}deserdar @user
│ 🌳 ${prefix}arvore
╰──────────────


╭─❖ 🏰 CLÃ & COMUNIDADE
│ 🏰 ${prefix}criarcla <nome>
│ 📜 ${prefix}cla
│ ➕ ${prefix}convidar @user
│ 🚪 ${prefix}sair
│ ✅ ${prefix}aceitarconvite
│ ❌ ${prefix}recusarconvite
│ 🗑️ ${prefix}expulsar @user
│ 🚫 ${prefix}rmconvite @user
╰──────────────


╭─❖ 📜 MISSÕES & CONQUISTAS
│ 📋 ${prefix}missoes
│ 🏅 ${prefix}conquistas
╰──────────────


╭─❖ 🐾 PETS & COMPANHEIROS
│ 🐕 ${prefix}pets
│ 🐾 ${prefix}adotar <pet>
│ 🍖 ${prefix}feed <nº>
│ 🏋️ ${prefix}train <nº>
│ 🌟 ${prefix}evolve <nº>
│ ⚔️ ${prefix}petbattle <nº>
│ ✏️ ${prefix}renamepet <nº> <nome>
│ 🎲 ${prefix}petbet <valor> <nº> @user
│ 🎒 ${prefix}equippet
│ 🚫 ${prefix}unequippet
╰──────────────


╭─❖ ⭐ REPUTAÇÃO & FAMA
│ ⭐ ${prefix}rep
│ 🗳️ ${prefix}vote @user
╰──────────────


╭─❖ 💎 LOJA PREMIUM
│ 💎 ${prefix}lojapremium
│ 🛒 ${prefix}comprarpremium <item>
│ 🚀 ${prefix}boost
│ 🏠 ${prefix}propriedades
│ 📜 ${prefix}cprop <id>
│ 🏡 ${prefix}cprops
│ 💰 ${prefix}tributos
│ 📊 ${prefix}meustats
│ 🎁 ${prefix}doar <valor>
│ 🎁 ${prefix}presente @user <item>
╰──────────────


╭─❖ 🔧 ADMIN RPG
│ 👑 ${prefix}rpgadd @user <valor>
│ 👑 ${prefix}rpgremove @user <valor>
│ ⭐ ${prefix}rpgsetlevel @user <nivel>
│ 🎒 ${prefix}rpgadditem @user <item> <qtd>
│ 🗑️ ${prefix}rpgremoveitem
│ 🔄 ${prefix}rpgresetplayer
│ 💥 ${prefix}rpgresetglobal confirmar
│ 👶 ${prefix}resetadot @user
│ 📊 ${prefix}rpgstats
╰──────────────`;
}

export default async function menubn(prefix, botName = "MeuBot", userName = "Usuário", isLiteMode = false) {
    // Comandos condicionais
    const comandosNsfw = !isLiteMode ? `
│ 🇧🇷 ${prefix}bolsonarista
│ 🟢 ${prefix}petista
│ 🔴 ${prefix}comunista
│ 🟠 ${prefix}lulista
│ 💔 ${prefix}traidor
│ 💔 ${prefix}traidora
│ 🤠 ${prefix}bandido
│ 🤠 ${prefix}bandida
│ 🐕 ${prefix}cachorro
│ 🐕 ${prefix}cachorra
│ 😩 ${prefix}vagabundo
│ 😩 ${prefix}vagabunda
│ 🕵 ${prefix}pilantra
│ 🍆 ${prefix}bucetuda
│ 👅 ${prefix}talarica
│ 💀 ${prefix}suicidio
│ 🐂 ${prefix}corno
│ 🐄 ${prefix}corna
│ 🏳️ ${prefix}gay
│ ⚫ ${prefix}nazista
│ 🦹 ${prefix}ladrao
│ 🦹 ${prefix}ladra
│ 🚫 ${prefix}homofobico
│ 🚫 ${prefix}homofobica
│ ⚫ ${prefix}racista
│ 🍆 ${prefix}pirocudo
│ 🧠 ${prefix}psicopata` : `
│ 👅 ${prefix}talarico`;

    const comandosLiteOcultos = !isLiteMode ? '' : `
│ 🏳️ ${prefix}gay
│ 🐂 ${prefix}corno
│ 🍆 ${prefix}pirocudo`;

    return `╭━━━〔 🎮 ${botName} • 𝐁𝐑𝐈𝐍𝐂𝐀𝐃𝐄𝐈𝐑𝐀𝐒 〕━━━╮
┃ 👋 Olá, @${userName}
┃ 🎮 Modo Brincadeira Ativo
┃ ✨ Comandos de diversão
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯


╭─❖ 🎮 JOGOS & DIVERSÃO
│ 🎯 ${prefix}tictactoe
│ 🎮 ${prefix}connect4
│ 🃏 ${prefix}uno criar
│ 🃏 ${prefix}uno entrar
│ 🃏 ${prefix}uno jogar
│ 🃏 ${prefix}uno cancelar
│ 🧠 ${prefix}memoria
│ 🏆 ${prefix}memoria ranking
│ 📝 ${prefix}wordle
│ ❓ ${prefix}quiz
│ 🎭 ${prefix}forca
│ ⌨️ ${prefix}digitar
│ 🚢 ${prefix}batalhanaval
│ 🛑 ${prefix}stop
│ 🔀 ${prefix}anagrama
│ ⚔️ ${prefix}dueloquiz
│ 🔤 ${prefix}cacapalavras
│ ❌ ${prefix}jogodavelha
│ 🎉 ${prefix}eununca
│ 💭 ${prefix}vab
│ 🎲 ${prefix}chance
│ ⏳ ${prefix}quando
│ 🍀 ${prefix}sorte
│ 💕 ${prefix}casal
│ 💘 ${prefix}shipo
│ 👀 ${prefix}sn
│ ✋ ${prefix}ppt
╰──────────────


╭─❖ 💬 FRASES & TEXTOS
│ 💡 ${prefix}conselho
│ 📖 ${prefix}conselhobiblico
│ 💘 ${prefix}cantada
│ 😄 ${prefix}piada
│ 🧩 ${prefix}charada
│ ⭐ ${prefix}motivacional
│ 🌟 ${prefix}elogio
│ 🪞 ${prefix}reflexao
│ 📰 ${prefix}fato
╰──────────────


╭─❖ 👋 INTERAÇÕES SOCIAIS
│ 💭 ${prefix}confessar
│ 💭 ${prefix}confessarn
│ 👊 ${prefix}chute
│ 👊 ${prefix}chutar
│ 👋 ${prefix}tapa
│ 👊 ${prefix}soco
│ 👊 ${prefix}socar
│ 💥 ${prefix}explodir
│ 🍅 ${prefix}tomate
│ 🤗 ${prefix}abraco
│ 🤗 ${prefix}abracar
│ 😮 ${prefix}morder
│ 😮 ${prefix}mordida
│ 👅 ${prefix}lamber
│ 👅 ${prefix}lambida
│ 💋 ${prefix}beijo
│ 💋 ${prefix}beijar
│ ⚔️ ${prefix}mata
│ ⚔️ ${prefix}matar
│ 💆 ${prefix}cafune
╰──────────────


╭─❖ 🔞 INTERAÇÕES "PICANTES"
│ 🔥 ${prefix}surubao
│ 🍑 ${prefix}siririca
│ 🔥 ${prefix}sexo
│ 💋 ${prefix}beijob
│ 💋 ${prefix}beijarb
│ 👋 ${prefix}tapar
│ ✋ ${prefix}punheta
│ 🚀 ${prefix}goza
│ 🚀 ${prefix}gozar
│ 🍼 ${prefix}mamar
│ 🍼 ${prefix}mamada
╰──────────────


╭─❖ 😆 BRINCADEIRAS MASCULINAS
│ 📏 ${prefix}medirpau${comandosLiteOcultos}
│ 🧠 ${prefix}burro
│ 🧠 ${prefix}burra
│ 🧠 ${prefix}inteligente
│ 🥷 ${prefix}otaku
│ 💍 ${prefix}fiel
│ 💔 ${prefix}infiel
│ 🐂 ${prefix}gado
│ 🐄 ${prefix}gada
│ 😎 ${prefix}gostoso
│ 😍 ${prefix}gostosa
│ 😖 ${prefix}feio
│ 😖 ${prefix}feia
│ 💰 ${prefix}rico
│ 💰 ${prefix}rica
│ 💸 ${prefix}pobre
│ 😈 ${prefix}safado
│ 😈 ${prefix}safada
│ 👁️ ${prefix}vesgo
│ 👁️ ${prefix}vesga
│ 🍺 ${prefix}bebado
│ 🍺 ${prefix}bebada
│ 😤 ${prefix}machista
│ 😴 ${prefix}chato
│ 😴 ${prefix}chata
│ 🍀 ${prefix}sortudo
│ 🍀 ${prefix}sortuda
│ 😱 ${prefix}azarado
│ 😱 ${prefix}azarada
│ 💪 ${prefix}forte
│ 💪 ${prefix}fortao
│ 😩 ${prefix}fraco
│ 😩 ${prefix}fraca
│ 😏 ${prefix}pegador
│ 😏 ${prefix}pegadora
│ 🤡 ${prefix}otario
│ 🤡 ${prefix}otaria
│ 😤 ${prefix}macho
│ 👑 ${prefix}maduro
│ 😵 ${prefix}bobo
│ 😵 ${prefix}boba
│ 🤓 ${prefix}nerd
│ 😴 ${prefix}preguicoso
│ 😴 ${prefix}preguicosa
│ ⚡ ${prefix}trabalhador
│ ⚡ ${prefix}trabalhadora
│ 🦁 ${prefix}brabo
│ 🦁 ${prefix}braba
│ 😍 ${prefix}lindo
│ 😍 ${prefix}linda
│ 🦊 ${prefix}malandro
│ 🦊 ${prefix}malandra
│ 😊 ${prefix}simpatico
│ 😊 ${prefix}simpatica
│ 😎 ${prefix}corajoso
│ 😎 ${prefix}corajosa
│ 😨 ${prefix}covarde
│ 🧠 ${prefix}esperto
│ 🧠 ${prefix}esperta
│ 🥰 ${prefix}carinhoso
│ 🥰 ${prefix}carinhosa
│ 😤 ${prefix}ciumento
│ 😤 ${prefix}ciumenta
│ 😢 ${prefix}chorona
│ 😢 ${prefix}chorao
│ 😜 ${prefix}brincalhona
│ 😜 ${prefix}brincalhao
│ 🌟 ${prefix}mito
│ 👑 ${prefix}padrao
│ 😂 ${prefix}comedia
│ 🔥 ${prefix}ateia
│ 🗺️ ${prefix}aventureira
│ 🤪 ${prefix}bagunceira
│ 😌 ${prefix}calma
│ 🏠 ${prefix}caseira
│ 🤔 ${prefix}cetica
│ 😎 ${prefix}confiante
│ 🏛️ ${prefix}conservadora
│ 🌍 ${prefix}cosmopolita
│ 🎨 ${prefix}criativa
│ 😕 ${prefix}dependente
│ 😌 ${prefix}desumilde
│ 📱 ${prefix}digital
│ 😴 ${prefix}dorminhoca
│ 🤒 ${prefix}doente
│ 💰 ${prefix}economica
│ 😂 ${prefix}engracado
│ 😂 ${prefix}engracada
│ 📚 ${prefix}estudiosa
│ 🗣️ ${prefix}extrovertida
│ 🗣️ ${prefix}fofoqueira
│ 💸 ${prefix}gastadora
│ 🌍 ${prefix}global
│ 😟 ${prefix}inseguro
│ 😟 ${prefix}insegura
│ 🤫 ${prefix}introvertido
│ 🤫 ${prefix}introvertida
│ 😕 ${prefix}irresponsavel
│ 👑 ${prefix}lider
│ ⚖️ ${prefix}liberal
│ 📍 ${prefix}local
│ 🦴 ${prefix}magrelo
│ 🦴 ${prefix}magrela
│ 🔮 ${prefix}misterioso
│ 🔮 ${prefix}misteriosa
│ 📱 ${prefix}moderna
│ 📱 ${prefix}moderno
│ 😠 ${prefix}nervoso
│ 😠 ${prefix}nervosa
│ 📴 ${prefix}offline
│ 💬 ${prefix}online
│ 😊 ${prefix}otimista
│ 🇧🇷 ${prefix}patriotico
│ 🇧🇷 ${prefix}patriotica
│ 😞 ${prefix}pessimista
│ ⚡ ${prefix}pratico
│ ⚡ ${prefix}pratica
│ 💻 ${prefix}programador
│ 💻 ${prefix}programadora
│ 👸 ${prefix}rainha
│ 😌 ${prefix}realista
│ ✝️ ${prefix}religioso
│ ✝️ ${prefix}religiosa
│ 💕 ${prefix}romantico
│ 💕 ${prefix}romantica
│ 🌾 ${prefix}rural
│ 🥗 ${prefix}saudavel
│ 🏋️ ${prefix}sedentaria
│ 👣 ${prefix}seguidor
│ 👣 ${prefix}seguidora
│ 😐 ${prefix}serio
│ 😐 ${prefix}seria
│ 👥 ${prefix}social
│ 🌙 ${prefix}solitario
│ 🌙 ${prefix}solitaria
│ 💭 ${prefix}sonhador
│ 💭 ${prefix}sonhadora
│ 🍀 ${prefix}sorte
│ 🔮 ${prefix}supersticioso
│ 🔮 ${prefix}supersticiosa
│ 💻 ${prefix}tecnologico
│ 💻 ${prefix}tecnologica
│ 🏛️ ${prefix}tradicional
│ 🏙️ ${prefix}urbano
│ 🏙️ ${prefix}urbana
│ 🏆 ${prefix}vencedor
│ 🏆 ${prefix}vencedora
│ ✈️ ${prefix}viajante
│ 🔭 ${prefix}visionario
│ 🔭 ${prefix}visionaria
│ 🤪 ${prefix}zueira
│ 🤪 ${prefix}zueiro
│ 💎 ${prefix}bilionario
│ 💎 ${prefix}bilionaria
│ 🎮 ${prefix}gamer
│ 💪 ${prefix}poderoso
│ 💪 ${prefix}poderosa
│ 👨 ${prefix}senhor
│ 👸 ${prefix}senhora
│ 💼 ${prefix}responsavel
│ 👅 ${prefix}talarico${comandosNsfw}
╰──────────────


╭─❖ 💑 RELACIONAMENTOS
│ 💌 ${prefix}ficante
│ 💍 ${prefix}namoro
│ 💒 ${prefix}casamento
│ 💍💍💍 ${prefix}trisal
│ 💍💍💍💍 ${prefix}quadrisal
│ 💕 ${prefix}relacionamento
│ 💔 ${prefix}terminar
│ 💔 ${prefix}terminartrisal
│ 💔 ${prefix}terminarquadrisal
│ 🤥 ${prefix}trair
│ 📜 ${prefix}historicotraicao
│ 🏳️ ${prefix}lesbica
╰──────────────


╭─❖ 🏆 RANKINGS MASCULINOS
│ 🏳️ ${prefix}rankgay
│ 🧠 ${prefix}rankburro
│ 🧠 ${prefix}rankinteligente
│ 🥷 ${prefix}rankotaku
│ 💍 ${prefix}rankfiel
│ 💔 ${prefix}rankinfiel
│ 🐂 ${prefix}rankcorno
│ 🐂 ${prefix}rankgado
│ 😎 ${prefix}rankgostoso
│ 💰 ${prefix}rankrico
│ 💸 ${prefix}rankpobre
│ 💪 ${prefix}rankforte
│ 😏 ${prefix}rankpegador
│ 😤 ${prefix}rankmacho
│ 🤓 ${prefix}ranknerd
│ ⚡ ${prefix}ranktrabalhador
│ 🦁 ${prefix}rankbrabo
│ 😍 ${prefix}ranklindo
│ 🦊 ${prefix}rankmalandro
│ 😂 ${prefix}rankengracado
│ ✨ ${prefix}rankcharmoso
│ 🔭 ${prefix}rankvisionario
│ 💪 ${prefix}rankpoderoso
│ 🏆 ${prefix}rankvencedor
╰──────────────


╭─❖ 🏆 RANKINGS FEMININOS
│ 🏳️ ${prefix}ranklesbica
│ 🧠 ${prefix}rankburra
│ 🧠 ${prefix}rankinteligente
│ 🥷 ${prefix}rankotaku
│ 💍 ${prefix}rankfiel
│ 💔 ${prefix}rankinfiel
│ 🐄 ${prefix}rankcorna
│ 🐄 ${prefix}rankgada
│ 😍 ${prefix}rankgostosa
│ 💰 ${prefix}rankrica
│ 💸 ${prefix}rankpobre
│ 💪 ${prefix}rankforte
│ 😏 ${prefix}rankpegadora
│ 🤓 ${prefix}ranknerd
│ ⚡ ${prefix}ranktrabalhadora
│ 🦁 ${prefix}rankbraba
│ 😍 ${prefix}ranklinda
│ 🦊 ${prefix}rankmalandra
│ 😂 ${prefix}rankengracada
│ ✨ ${prefix}rankcharmosa
│ 🔭 ${prefix}rankvisionaria
│ 💪 ${prefix}rankpoderosa
│ 🏆 ${prefix}rankvencedora
╰──────────────`;
}

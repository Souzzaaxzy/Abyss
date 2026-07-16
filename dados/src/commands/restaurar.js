import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..', '..');

// Diretórios a restaurar
const RESTORE_DIRS = ['dados/database', 'dados/midias'];
const RESTORE_FILES = ['dados/src/config.json'];

export async function handleRestaurar(sock, info, body, prefix, sender, isOwner, reply, downloadContentFromMessage) {
  if (!isOwner) {
    return reply('⚠️ Apenas o Dono pode usar este comando!');
  }

  // Verifica se há arquivo anexado
  const messageContent = info.message;
  const hasDocument = messageContent?.documentMessage;
  const hasImage = messageContent?.imageMessage;
  const hasVideo = messageContent?.videoMessage;
  const hasAudio = messageContent?.audioMessage;

  if (!hasDocument && !hasImage && !hasVideo && !hasAudio) {
    return reply(`📋 *COMANDO: Restaurar Backup*\n\n`
      + `Envie o arquivo de backup junto com o comando.\n\n`
      + `📌 *Formatos aceitos:* .zip, .tar.gz, .rar\n\n`
      + `💡 *Exemplo:* Reply/encaminhe o arquivo .zip do backup com:\n`
      + `\`${prefix}restaurar\``);
  }

  try {
    await reply('🔄 *INICIANDO RESTAURAÇÃO...*\n\n'
      + '⏳ Baixando arquivo de backup...');

    // Determina o tipo de mensagem
    const mediaMessage = hasDocument || hasImage || hasVideo || hasAudio;
    const fileName = mediaMessage?.fileName || `backup_${Date.now()}.zip`;

    // Diretório temporário
    const tempDir = path.join(PROJECT_ROOT, '.restore_temp');
    const restoreDir = path.join(tempDir, 'extracted');

    // Limpa e cria diretórios
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(restoreDir, { recursive: true });

    // Salva o arquivo
    const ext = path.extname(fileName).toLowerCase();
    const tempFile = path.join(tempDir, `backup${ext}`);

    // Download
    let stream;
    if (hasDocument) {
      stream = await downloadContentFromMessage(info.message.documentMessage, 'document');
    } else if (hasImage) {
      stream = await downloadContentFromMessage(info.message.imageMessage, 'image');
    } else if (hasVideo) {
      stream = await downloadContentFromMessage(info.message.videoMessage, 'video');
    } else if (hasAudio) {
      stream = await downloadContentFromMessage(info.message.audioMessage, 'audio');
    }

    const buffer = Buffer.concat(await stream.toArray());
    fs.writeFileSync(tempFile, buffer);

    await reply('📦 *Download concluído!*\n\n'
      + '🔓 Extraindo backup...');

    // Extrai baseado na extensão
    let extracted = false;

    if (ext === '.zip') {
      try {
        execSync(`unzip -o "${tempFile}" -d "${restoreDir}"`, { stdio: 'pipe' });
        extracted = true;
      } catch (e) {
        // Tenta com Python
        try {
          execSync(`python3 -c "import zipfile; zipfile.ZipFile('${tempFile}').extractall('${restoreDir}}')"`, { stdio: 'pipe' });
          extracted = true;
        } catch (e2) {}
      }
    } else if (ext === '.gz' || ext === '.tgz' || ext === '.tar.gz') {
      try {
        execSync(`tar -xzf "${tempFile}" -C "${restoreDir}"`, { stdio: 'pipe' });
        extracted = true;
      } catch (e) {}
    } else if (ext === '.rar') {
      try {
        execSync(`unrar x -o+ "${tempFile}" "${restoreDir}"`, { stdio: 'pipe' });
        extracted = true;
      } catch (e) {}
    } else {
      // Tenta como zip por padrão
      try {
        execSync(`unzip -o "${tempFile}" -d "${restoreDir}"`, { stdio: 'pipe' });
        extracted = true;
      } catch (e) {}
    }

    if (!extracted) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      return reply('❌ *Erro ao extrair arquivo!*\n\n'
        + 'Formatos suportados: .zip, .tar.gz, .rar\n\n'
        + 'Tente compactar em formato ZIP.');
    }

    await reply('📂 *Arquivo extraído!*\n\n'
      + '🔄 Restaurando dados...');

    // Procura o conteúdo do backup
    const backupContent = findBackupContent(restoreDir);
    const sourceDir = backupContent || restoreDir;

    // Restaura
    let restored = 0;

    for (const dir of RESTORE_DIRS) {
      const source = path.join(sourceDir, dir);
      const dest = path.join(PROJECT_ROOT, dir);

      if (fs.existsSync(source)) {
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.cpSync(source, dest);
        restored++;
        await reply(`  ✅ ${dir}/`);
      }
    }

    for (const file of RESTORE_FILES) {
      const source = path.join(sourceDir, file);
      const dest = path.join(PROJECT_ROOT, file);

      if (fs.existsSync(source)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(source, dest);
        restored++;
        await reply(`  ✅ ${file}`);
      }
    }

    // Limpa
    fs.rmSync(tempDir, { recursive: true, force: true });

    if (restored > 0) {
      await reply('✅ *RESTAURAÇÃO CONCLUÍDA!*\n\n'
        + `📦 ${restored} item(s) restaurado(s)\n\n`
        + '📌 Reinicie o bot para aplicar as alterações.');
    } else {
      await reply('⚠️ *Nenhum dado encontrado para restaurar!*\n\n'
        + 'Verifique se o arquivo de backup contém as pastas:\n'
        + '- dados/database\n'
        + '- dados/midias\n'
        + '- dados/src/config.json');
    }

  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    await reply('❌ *Erro ao restaurar backup!*\n\n'
      + `Erro: ${error.message}`);
  }
}

function findBackupContent(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name === 'dados' || entry.name.startsWith('backup')) {
        return path.join(dir, entry.name);
      }
      const found = findBackupContent(path.join(dir, entry.name));
      if (found) return found;
    }
  }
  return null;
}

export default { handleRestaurar };

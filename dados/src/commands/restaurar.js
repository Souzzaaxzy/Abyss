import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..', '..');

// Diretórios e arquivos a restaurar
const RESTORE_DIRS = [
  { src: 'dados/database', desc: '📊 Database' },
  { src: 'dados/midias', desc: '🖼️ Mídias' }
];
const RESTORE_FILES = [
  { src: 'dados/src/config.json', desc: '⚙️ Configuração' },
  { src: 'dados/database/updateSave.json', desc: '📝 Update Save' }
];

export async function handleRestaurar(sock, info, body, prefix, sender, isOwner, reply, downloadContentFromMessage) {
  if (!isOwner) {
    return reply('⚠️ Apenas o Dono pode usar este comando!');
  }

  // Analisa o comando para ver se há um número de backup especificado
  const args = body.trim().split(' ');
  const backupIndex = parseInt(args[1]) - 1; // -1 porque usuário vê 1-based

  // Lista backups locais disponíveis
  const localBackups = listLocalBackups();

  // Verifica se há arquivo anexado na mensagem atual ou na quotada
  const messageContent = info.message;
  const quotedContent = messageContent?.extendedTextMessage?.contextInfo?.quotedMessage
    || messageContent?.imageMessage?.contextInfo?.quotedMessage
    || messageContent?.videoMessage?.contextInfo?.quotedMessage
    || messageContent?.audioMessage?.contextInfo?.quotedMessage;

  // Verifica mensagem atual
  let docMsg = messageContent?.documentMessage;
  let imgMsg = messageContent?.imageMessage;
  let vidMsg = messageContent?.videoMessage;
  let audMsg = messageContent?.audioMessage;

  // Verifica mensagem quotada
  if (!docMsg) docMsg = quotedContent?.documentMessage;
  if (!imgMsg) imgMsg = quotedContent?.imageMessage;
  if (!vidMsg) vidMsg = quotedContent?.videoMessage;
  if (!audMsg) audMsg = quotedContent?.audioMessage;

  // Se há arquivo anexado, restaura do arquivo
  if (docMsg || imgMsg || vidMsg || audMsg) {
    return restoreFromFile(docMsg, imgMsg, vidMsg, audMsg, reply, downloadContentFromMessage, PROJECT_ROOT);
  }

  // Se especificado um número de backup, restaura desse backup local
  if (!isNaN(backupIndex) && backupIndex >= 0) {
    if (localBackups.length === 0) {
      return reply('❌ *Nenhum backup local encontrado!*\n\n'
        + 'Use um arquivo de backup (.zip) ou faça uma atualização primeiro.');
    }
    if (backupIndex >= localBackups.length) {
      return reply(`❌ *Backup #${backupIndex + 1} não encontrado!*\n\n`
        + `Backups disponíveis: ${localBackups.length}`);
    }
    return restoreFromLocalBackup(localBackups[backupIndex], reply, PROJECT_ROOT);
  }

  // Mostra menu de backups disponíveis
  const helpText = `📋 *COMANDO: Restaurar Backup*\n\n`
    + `Este comando restaura dados de backups.\n\n`
    + `${localBackups.length > 0 ? '📁 *BACKUPS LOCAIS DISPONÍVEIS:*\n' : ''}`;

  let message = helpText;
  
  if (localBackups.length > 0) {
    localBackups.forEach((backup, index) => {
      message += `\`${index + 1}\` - ${formatDate(backup.date)}\n`;
    });
    message += '\n💡 *Uso:* `!restaurar 1` (para restaurar o backup #1)\n\n';
  }

  message += '📎 *OU envie um arquivo de backup:*\n'
    + `Envie um arquivo .zip junto com o comando.\n\n`
    + `💡 *Exemplo:* Reply/encaminhe o arquivo .zip do backup com:\n`
    + `\`${prefix}restaurar\``;

  return reply(message);
}

function listLocalBackups() {
  const backups = [];
  try {
    const entries = fs.readdirSync(PROJECT_ROOT, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('backup_')) {
        const fullPath = path.join(PROJECT_ROOT, entry.name);
        let date = entry.name.replace('backup_', '').replace(/_/g, ' ').replace(/-/g, ':').split('.')[0];
        backups.push({
          name: entry.name,
          path: fullPath,
          date: new Date(date.replace(/_/g, 'T'))
        });
      }
    }
  } catch (e) {
    console.error('Erro ao listar backups:', e);
  }
  // Ordena por data (mais recente primeiro)
  return backups.sort((a, b) => b.date - a.date);
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function restoreFromLocalBackup(backup, reply, projectRoot) {
  try {
    await reply('🔄 *RESTAURAÇÃO DE BACKUP LOCAL*\n\n'
      + `📁 Backup: ${backup.name}\n`
      + `📅 Data: ${formatDate(backup.date)}\n\n`
      + '⏳ Iniciando restauração...');

    const backupDir = backup.path;
    let restored = 0;

    // Restaura cada diretório
    for (const dir of RESTORE_DIRS) {
      const source = path.join(backupDir, dir.src);
      const dest = path.join(projectRoot, dir.src);

      if (fs.existsSync(source)) {
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.cpSync(source, dest);
        restored++;
        await reply(`✅ ${dir.desc} restaurado!`);
      } else {
        await reply(`⚠️ ${dir.desc} não encontrado no backup`);
      }
    }

    // Restaura cada arquivo
    for (const file of RESTORE_FILES) {
      const source = path.join(backupDir, file.src);
      const dest = path.join(projectRoot, file.src);

      if (fs.existsSync(source)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(source, dest);
        restored++;
        await reply(`✅ ${file.desc} restaurado!`);
      }
    }

    if (restored > 0) {
      await reply('✅ *RESTAURAÇÃO CONCLUÍDA!*\n\n'
        + `📦 ${restored} item(s) restaurado(s)\n\n`
        + '📌 *Importante:* Reinicie o bot para aplicar as alterações!');
    } else {
      await reply('⚠️ *Nenhum dado encontrado para restaurar!*\n\n'
        + 'O backup pode estar corrompido ou incompleto.');
    }

  } catch (error) {
    console.error('Erro ao restaurar backup local:', error);
    await reply('❌ *Erro ao restaurar backup!*\n\n'
      + `Erro: ${error.message}`);
  }
}

async function restoreFromFile(docMsg, imgMsg, vidMsg, audMsg, reply, downloadContentFromMessage, projectRoot) {
  try {
    await reply('🔄 *INICIANDO RESTAURAÇÃO DE ARQUIVO...*\n\n'
      + '⏳ Baixando arquivo de backup...');

    const mediaMessage = docMsg || imgMsg || vidMsg || audMsg;
    const fileName = mediaMessage?.fileName || `backup_${Date.now()}.zip`;

    // Diretório temporário
    const tempDir = path.join(projectRoot, '.restore_temp');
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
    if (docMsg) {
      stream = await downloadContentFromMessage(docMsg, 'document');
    } else if (imgMsg) {
      stream = await downloadContentFromMessage(imgMsg, 'image');
    } else if (vidMsg) {
      stream = await downloadContentFromMessage(vidMsg, 'video');
    } else if (audMsg) {
      stream = await downloadContentFromMessage(audMsg, 'audio');
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
        console.error('Unzip error:', e.message);
      }
    } else if (ext === '.gz' || ext === '.tgz' || ext === '.tar.gz') {
      try {
        execSync(`tar -xzf "${tempFile}" -C "${restoreDir}"`, { stdio: 'pipe' });
        extracted = true;
      } catch (e) {
        console.error('Tar error:', e.message);
      }
    } else if (ext === '.rar') {
      try {
        execSync(`unrar x -o+ "${tempFile}" "${restoreDir}"`, { stdio: 'pipe' });
        extracted = true;
      } catch (e) {
        console.error('Unrar error:', e.message);
      }
    } else {
      // Tenta como zip por padrão
      try {
        execSync(`unzip -o "${tempFile}" -d "${restoreDir}"`, { stdio: 'pipe' });
        extracted = true;
      } catch (e) {
        console.error('Default unzip error:', e.message);
      }
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
      const source = path.join(sourceDir, dir.src);
      const dest = path.join(projectRoot, dir.src);

      if (fs.existsSync(source)) {
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.cpSync(source, dest);
        restored++;
        await reply(`✅ ${dir.desc} restaurado!`);
      }
    }

    for (const file of RESTORE_FILES) {
      const source = path.join(sourceDir, file.src);
      const dest = path.join(projectRoot, file.src);

      if (fs.existsSync(source)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(source, dest);
        restored++;
        await reply(`✅ ${file.desc} restaurado!`);
      }
    }

    // Limpa
    fs.rmSync(tempDir, { recursive: true, force: true });

    if (restored > 0) {
      await reply('✅ *RESTAURAÇÃO CONCLUÍDA!*\n\n'
        + `📦 ${restored} item(s) restaurado(s)\n\n`
        + '📌 *Importante:* Reinicie o bot para aplicar as alterações!');
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

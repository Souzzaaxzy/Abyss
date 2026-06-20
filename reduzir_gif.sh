#!/bin/bash
# Script para reduzir GIF do menufut para o WhatsApp
# Limite do WhatsApp: ~1MB

GIF_PATH="/data/data/com.termux/files/home/Abyss/dados/midias/menufut.gif"

echo "🎬 Reduzindo GIF para WhatsApp..."
echo "📁 Original: $GIF_PATH"
ls -lh "$GIF_PATH"

# Verificar tamanho atual
SIZE=$(stat -c%s "$GIF_PATH" 2>/dev/null || stat -f%z "$GIF_PATH" 2>/dev/null)
MAX_SIZE=1048576  # 1MB

if [ "$SIZE" -gt "$MAX_SIZE" ]; then
  echo "⚠️ GIF grande (${SIZE} bytes), reduzindo..."
  
  # Reduzir GIF: menor resolução e fps
  ffmpeg -i "$GIF_PATH" \
    -vf "scale=480:-1:flags=lanczos,fps=10,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" \
    -loop 0 \
    -y \
    "$GIF_PATH.tmp.gif"
  
  mv "$GIF_PATH.tmp.gif" "$GIF_PATH"
  
  echo "✅ GIF reduzido!"
  ls -lh "$GIF_PATH"
else
  echo "✅ GIF já está no tamanho certo!"
fi

echo ""
echo "🎉 Pronto! Use !menufut para testar!"
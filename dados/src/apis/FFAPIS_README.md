# Free Fire API - FFAPIS Implementation

Este módulo implementa a API do Free Fire usando o sistema do [ffapis](https://github.com/senoseya/ffapis).

## Configuração

### 1. Instalar dependência

```bash
npm install protobufjs
```

### 2. Obter credenciais

As credenciais são necessárias para autenticar com os servidores da Garena.

1. Acesse o repositório: https://github.com/senoseya/ffapis/tree/main/config/credentials
2. Copie o conteúdo do arquivo da sua região (ex: `BR.yaml` ou use o `IND.yaml`)
3. Crie o arquivo `dados/database/dono/ff_credentials_br.json` com o formato:

```json
{
  "credentials": [
    {
      "uid": "4718507406",
      "password": "8C33879DCE23FB788CE56E20CC28D2504CF1886C94F232164ACC20E155E36006"
    }
  ]
}
```

### 3. Usar a API

```javascript
import { searchAccount, getPlayerProfile, getPlayerStats } from './apis/freefire-ffapis.js';

// Buscar jogador por nickname
const results = await searchAccount('NomeDoJogador');
console.log(results);

// Obter perfil do jogador
const profile = await getPlayerProfile('123456789');
console.log(profile);

// Obter estatísticas BR
const stats = await getPlayerStats('123456789', 'br', 'career');
console.log(stats);

// Obter estatísticas CS
const csStats = await getPlayerStats('123456789', 'cs', 'ranked');
console.log(csStats);
```

## Estrutura dos Arquivos

- `freefire-ffapis.js` - Implementação principal da API
- `../proto/` - Arquivos .proto para codificação/decodificação
- `../../database/dono/ff_credentials_br.json` - Credenciais (criar manualmente)

## Endpoints Implementados

- `searchAccount(keyword)` - Buscar jogadores por nickname
- `getPlayerProfile(uid)` - Obter perfil completo do jogador
- `getPlayerStats(uid, mode, matchType)` - Obter estatísticas
  - `mode`: 'br' ou 'cs'
  - `matchType`: 'career' ou 'ranked'

## Nota sobre OB Version

Quando a Garena atualiza o Free Fire (OB update), pode ser necessário atualizar a `RELEASE_VERSION` no arquivo `freefire-ffapis.js` para a nova versão.
